import crypto from "node:crypto";

const COOKIE = "coolinkey_admin";
const MAX_AGE = 12 * 60 * 60;

export function missingPublishEnv() {
  const missing = [];
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (!process.env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  return missing;
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || typeof password !== "string" || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function signingKey() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function createSessionValue() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  const sig = crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readSession(cookieHeader) {
  if (!signingKey()) return false;
  const raw = String(cookieHeader || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const token = decodeURIComponent(raw.slice(COOKIE.length + 1));
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookie(value, secure) {
  const base = `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
  return secure ? `${base}; Secure` : base;
}

export function clearCookie(secure) {
  const base = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  return secure ? `${base}; Secure` : base;
}

export function isSecureRequest(req) {
  return process.env.VERCEL === "1" || req.headers["x-forwarded-proto"] === "https";
}

function repoCoordinates() {
  const repo = process.env.GITHUB_REPO || "liu65586-create/Coolinkey-website";
  const branch = process.env.GITHUB_BRANCH || "main";
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error("GITHUB_REPO 需要写成 owner/name");
  return { repo, branch, owner, name };
}

async function github(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("服务器未配置 GITHUB_TOKEN");
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "coolinkey-admin",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`GitHub：${message}`);
  }
  return data;
}

const CLIENT_BASE64_MAX = 4_200_000;
export const FILE_BYTES_MAX = 48 * 1024 * 1024;

async function postGitBlob(contentBase64) {
  if (typeof contentBase64 !== "string" || !contentBase64) throw new Error("文件内容为空");
  const bytes = Math.floor((contentBase64.length * 3) / 4);
  if (bytes > FILE_BYTES_MAX) throw new Error("单个文件超过 48MB，请先压缩后再发布");
  const { owner, name } = repoCoordinates();
  const blob = await github(`/repos/${owner}/${name}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({ content: contentBase64, encoding: "base64" }),
  });
  return blob.sha;
}

export async function createBlob(contentBase64) {
  if (typeof contentBase64 === "string" && contentBase64.length > CLIENT_BASE64_MAX) {
    throw new Error("上传片段过大，请重新发布");
  }
  return postGitBlob(contentBase64);
}

async function readGitBlob(sha) {
  const { owner, name } = repoCoordinates();
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("服务器未配置 GITHUB_TOKEN");
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}/git/blobs/${sha}`, {
    headers: {
      Accept: "application/vnd.github.raw",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "coolinkey-admin",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    let message = response.statusText;
    try {
      message = JSON.parse(text).message || message;
    } catch {
      message = text || message;
    }
    throw new Error(`GitHub：${message}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function assembleBlobs(shas) {
  if (!Array.isArray(shas) || shas.length < 2 || shas.length > 24) throw new Error("文件片段数量不正确");
  const parts = [];
  let total = 0;
  for (const sha of shas) {
    if (!/^[a-f0-9]{40}$/.test(String(sha))) throw new Error("文件片段无效");
    const part = await readGitBlob(sha);
    total += part.length;
    if (total > FILE_BYTES_MAX) throw new Error("单个文件超过 48MB，请先压缩后再发布");
    parts.push(part);
  }
  return postGitBlob(Buffer.concat(parts, total).toString("base64"));
}

function contentPath(path) {
  const clean = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (!clean.startsWith("public/") || clean.split("/").includes("..")) {
    throw new Error("只能发布网站 public 目录中的内容");
  }
  return clean;
}

export async function commitBlobs(message, files) {
  if (!Array.isArray(files) || files.length === 0) throw new Error("没有可提交的文件");
  const { owner, name, branch, repo } = repoCoordinates();
  const ref = await github(`/repos/${owner}/${name}/git/ref/heads/${encodeURIComponent(branch)}`);
  const parentSha = ref.object.sha;
  const parent = await github(`/repos/${owner}/${name}/git/commits/${parentSha}`);
  const tree = await github(`/repos/${owner}/${name}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree: files.map((file) => ({
        path: contentPath(file.path),
        mode: "100644",
        type: "blob",
        sha: file.sha,
      })),
    }),
  });
  const commit = await github(`/repos/${owner}/${name}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: message || "publish: update website content",
      tree: tree.sha,
      parents: [parentSha],
    }),
  });
  await github(`/repos/${owner}/${name}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  return {
    sha: commit.sha,
    url: `https://github.com/${repo}/commit/${commit.sha}`,
    branch,
  };
}
