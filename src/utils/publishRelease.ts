import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { listMediaMeta, getMediaBlob, type MediaMeta } from "./mediaStore";

export type PublishSession = {
  ok: boolean;
  authenticated: boolean;
  publishReady: boolean;
  missing: string[];
  error?: string;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const size = 0x8000;
  for (let index = 0; index < bytes.length; index += size) {
    binary += String.fromCharCode(...bytes.subarray(index, index + size));
  }
  return btoa(binary);
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  });
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

export function fetchSession() {
  return api<PublishSession>("/api/session");
}

export function loginAdmin(password: string) {
  return api<PublishSession>("/api/login", { method: "POST", body: JSON.stringify({ password }) });
}

export function logoutAdmin() {
  return api<{ ok: boolean }>("/api/logout", { method: "POST" });
}

async function collectFiles(site: SiteConfig, products: CmsProduct[]) {
  const encoder = new TextEncoder();
  const media = await listMediaMeta();
  const files: { path: string; bytes: Uint8Array }[] = [
    { path: "public/cms/site.config.json", bytes: encoder.encode(`${JSON.stringify(site, null, 2)}\n`) },
    { path: "public/cms/products.json", bytes: encoder.encode(`${JSON.stringify({ products }, null, 2)}\n`) },
  ];
  const kept: MediaMeta[] = [];
  for (const meta of media) {
    const blob = await getMediaBlob(meta.path);
    if (!blob) continue;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes.byteLength > 3_500_000) throw new Error(`${meta.name} 超过 3.5MB，请压缩后再发布`);
    const sitePath = meta.path.startsWith("/") ? meta.path : `/${meta.path}`;
    files.push({ path: `public${sitePath}`, bytes });
    kept.push(meta);
  }
  files.push({ path: "public/cms/media.json", bytes: encoder.encode(`${JSON.stringify({ media: kept }, null, 2)}\n`) });
  return files;
}

export async function publishContent(site: SiteConfig, products: CmsProduct[]) {
  const files = await collectFiles(site, products);
  const uploaded: { path: string; sha: string }[] = [];
  for (const file of files) {
    const result = await api<{ sha: string; path: string }>("/api/blob", {
      method: "POST",
      body: JSON.stringify({ path: file.path, contentBase64: bytesToBase64(file.bytes) }),
    });
    uploaded.push({ path: file.path, sha: result.sha });
  }
  return api<{ sha: string; url: string; branch: string }>("/api/commit", {
    method: "POST",
    body: JSON.stringify({
      message: "publish: update website content from admin",
      files: uploaded,
    }),
  });
}
