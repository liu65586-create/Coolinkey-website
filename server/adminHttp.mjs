import {
  checkPassword,
  clearCookie,
  assembleBlobs,
  commitBlobs,
  createBlob,
  createSessionValue,
  isSecureRequest,
  missingPublishEnv,
  readSession,
  sessionCookie,
} from "./adminPublish.mjs";

function send(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function requireSession(req, res) {
  if (readSession(req.headers.cookie)) return true;
  send(res, 401, { ok: false, error: "请先登录" });
  return false;
}

export async function handleAdminApi(req, res, pathname) {
  try {
    if (pathname === "/api/session" && req.method === "GET") {
      const missing = missingPublishEnv();
      return send(res, 200, {
        ok: true,
        authenticated: readSession(req.headers.cookie),
        publishReady: missing.length === 0,
        missing,
      });
    }

    if (pathname === "/api/login" && req.method === "POST") {
      const missing = missingPublishEnv();
      if (missing.includes("ADMIN_PASSWORD")) {
        return send(res, 503, { ok: false, error: "服务器还没有配置 ADMIN_PASSWORD", missing });
      }
      const body = await readJson(req);
      if (!checkPassword(body.password)) return send(res, 401, { ok: false, error: "密码不正确" });
      const secure = isSecureRequest(req);
      return send(res, 200, { ok: true, publishReady: missing.length === 0, missing }, {
        "Set-Cookie": sessionCookie(createSessionValue(), secure),
      });
    }

    if (pathname === "/api/logout" && req.method === "POST") {
      return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie(isSecureRequest(req)) });
    }

    if (pathname === "/api/blob" && req.method === "POST") {
      if (!requireSession(req, res)) return;
      const body = await readJson(req);
      const sha = await createBlob(body.contentBase64);
      return send(res, 200, { ok: true, sha, path: body.path });
    }

    if (pathname === "/api/assemble" && req.method === "POST") {
      if (!requireSession(req, res)) return;
      const body = await readJson(req);
      const sha = await assembleBlobs(body.shas);
      return send(res, 200, { ok: true, sha, path: body.path });
    }

    if (pathname === "/api/commit" && req.method === "POST") {
      if (!requireSession(req, res)) return;
      const body = await readJson(req);
      const result = await commitBlobs(body.message, body.files);
      return send(res, 200, { ok: true, ...result });
    }

    send(res, 404, { ok: false, error: "接口不存在" });
  } catch (error) {
    send(res, 500, { ok: false, error: error instanceof Error ? error.message : "发布失败" });
  }
}
