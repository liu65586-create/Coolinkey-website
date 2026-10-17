import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { getMediaBlob, listMediaMeta, type MediaMeta } from "./mediaStore";
import { normalizeProducts } from "./normalizeProducts";
import { normalizeSiteConfig } from "./normalizeSiteConfig";
import { collectReferences } from "./contentRefs";
import { readStoredZip, writeStoredZip, type ZipFile } from "./zipStore";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function jsonFile(name: string, value: unknown): ZipFile {
  return { name, data: encoder.encode(`${JSON.stringify(value, null, 2)}\n`) };
}

function repoPath(sitePath: string): string {
  return `public${sitePath.startsWith("/") ? sitePath : `/${sitePath}`}`;
}

export async function buildContentZip(options: {
  site: SiteConfig;
  products: CmsProduct[];
  mode: "json" | "full";
}): Promise<Blob> {
  const site = normalizeSiteConfig(options.site);
  const products = normalizeProducts(options.products);
  const files: ZipFile[] = [
    jsonFile("public/cms/site.config.json", site),
    jsonFile("public/cms/products.json", { products }),
  ];
  const imported: MediaMeta[] = options.mode === "full" ? await listMediaMeta() : [];
  const refs = collectReferences(site, products);
  const included = new Set<string>();
  const missing: string[] = [];

  if (options.mode === "full") {
    for (const meta of imported) {
      const blob = await getMediaBlob(meta.path);
      if (!blob) continue;
      const bytes = new Uint8Array(await blob.arrayBuffer());
      files.push({ name: repoPath(meta.path), data: bytes });
      included.add(meta.path);
    }
    for (const path of refs.keys()) {
      if (!included.has(path) && path.startsWith("/uploads/")) missing.push(path);
    }
    files.push(jsonFile("public/cms/media.json", { media: imported }));
  }

  const lines = [
    "# COOLINKEY 内容变更包",
    "",
    options.mode === "json"
      ? "这个包只有配置 JSON，不含新上传的图片、视频或 PDF。"
      : "这个包包含配置 JSON，以及本机媒体库里的原始文件。",
    "",
    "这不是线上发布。把文件放回仓库并推送后，Vercel 重新构建，访客才能看到更新。",
    "",
    "## 放到仓库里的路径",
    "",
    ...files
      .filter((file) => file.name !== "MANIFEST.md")
      .map((file) => `- \`${file.name}\``),
    "",
    "## 操作",
    "",
    "1. 解压，按上面的路径覆盖仓库文件。",
    "2. 检查 diff，确认没有把浏览器临时地址写进去。",
    "3. git commit 并 push，或在 GitHub 网页提交。",
    "4. 等待 Vercel 构建完成。",
    "5. 用无痕窗口打开线上页面核对。",
    "6. 回到 /admin，手动确认「已提交」和「已部署」。后台不会自行判断 GitHub 或 Vercel 状态。",
    "",
  ];
  if (imported.length) {
    lines.push("## 本机导入的媒体", "");
    for (const meta of imported) {
      const where = refs.get(meta.path)?.join("、") || "当前内容未引用";
      lines.push(`- \`${meta.path}\` · ${meta.name} · ${meta.size} bytes · 引用：${where}`);
    }
    lines.push("");
  }
  if (missing.length) {
    lines.push("## 引用了 /uploads 但本机没有文件", "");
    for (const path of missing) lines.push(`- \`${path}\``);
    lines.push("");
  }
  const external = [...refs.keys()].filter((path) => !path.startsWith("/uploads/") && !included.has(path));
  if (external.length && options.mode === "full") {
    lines.push("## 已在仓库或外部的路径（本包未附带文件）", "");
    for (const path of external) lines.push(`- \`${path}\``);
    lines.push("");
  }
  files.unshift({ name: "MANIFEST.md", data: encoder.encode(lines.join("\n")) });
  const zip = writeStoredZip(files);
  return new Blob([zip], { type: "application/zip" });
}

export async function restoreContentZip(file: File): Promise<{ site: SiteConfig; products: CmsProduct[] }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const entries = readStoredZip(bytes);
  const siteEntry = entries.find((entry) => entry.name.endsWith("public/cms/site.config.json"));
  const productsEntry = entries.find((entry) => entry.name.endsWith("public/cms/products.json"));
  if (!siteEntry || !productsEntry) throw new Error("变更包里没有 site.config.json 或 products.json");
  const site = normalizeSiteConfig(JSON.parse(decoder.decode(siteEntry.data)) as SiteConfig);
  const parsed = JSON.parse(decoder.decode(productsEntry.data)) as { products: CmsProduct[] };
  if (!Array.isArray(parsed.products)) throw new Error("products.json 格式不对");
  const products = normalizeProducts(parsed.products);
  const { saveMediaBlob, saveMediaMeta } = await import("./mediaStore");
  const mediaEntry = entries.find((entry) => entry.name.endsWith("public/cms/media.json"));
  const mediaPayload = mediaEntry ? JSON.parse(decoder.decode(mediaEntry.data)) as { media?: MediaMeta[] } : {};
  const metadataByPath = new Map((mediaPayload.media ?? []).map((meta) => [meta.path, meta]));
  const mimeForPath = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase();
    const types: Record<string, string> = {
      png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml",
      mp4: "video/mp4", webm: "video/webm", pdf: "application/pdf", gif: "image/gif",
    };
    return types[ext ?? ""] ?? "application/octet-stream";
  };
  for (const entry of entries) {
    if (!entry.name.startsWith("public/uploads/") && !entry.name.startsWith("public/manuals/") && !entry.name.startsWith("public/brand/") && !entry.name.startsWith("public/images/")) {
      continue;
    }
    const sitePath = `/${entry.name.replace(/^public\//, "")}`;
    const priorMeta = metadataByPath.get(sitePath);
    const blob = new Blob([entry.data], { type: priorMeta?.mime || mimeForPath(sitePath) });
    await saveMediaBlob(sitePath, blob);
    await saveMediaMeta({
      path: sitePath,
      name: priorMeta?.name || sitePath.split("/").pop() || sitePath,
      altEn: priorMeta?.altEn || "",
      altZh: priorMeta?.altZh || "",
      mime: blob.type,
      size: blob.size,
      width: priorMeta?.width,
      height: priorMeta?.height,
      duration: priorMeta?.duration,
      addedAt: priorMeta?.addedAt || new Date().toISOString(),
    });
  }
  window.dispatchEvent(new Event("coolinkey-media"));
  return { site, products };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
