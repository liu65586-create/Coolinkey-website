const DB_NAME = "coolinkey_media";
const STORE = "blobs";
const META = "meta";
const DB_VERSION = 2;

export type MediaMeta = {
  path: string;
  name: string;
  altEn: string;
  altZh: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  addedAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
    };
  });
}

export async function saveMediaBlob(path: string, blob: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, path);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function saveMediaMeta(meta: MediaMeta): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(META, "readwrite");
    tx.objectStore(META).put(meta, meta.path);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function getMediaBlob(path: string): Promise<Blob | null> {
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(path);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob;
}

export async function deleteMediaBlob(path: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE, META], "readwrite");
    tx.objectStore(STORE).delete(path);
    tx.objectStore(META).delete(path);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  invalidateMediaUrl(path);
}

export async function listMediaPaths(): Promise<string[]> {
  const db = await openDb();
  const keys = await new Promise<string[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve((req.result as string[]) ?? []);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return keys;
}

export async function listMediaMeta(): Promise<MediaMeta[]> {
  const db = await openDb();
  const rows = await new Promise<MediaMeta[]>((resolve, reject) => {
    const tx = db.transaction(META, "readonly");
    const req = tx.objectStore(META).getAll();
    req.onsuccess = () => resolve((req.result as MediaMeta[]) ?? []);
    req.onerror = () => reject(req.error);
  });
  db.close();
  const paths = await listMediaPaths();
  const known = new Set(rows.map((row) => row.path));
  for (const path of paths) {
    if (known.has(path)) continue;
    const blob = await getMediaBlob(path);
    rows.push({
      path,
      name: path.split("/").pop() ?? path,
      altEn: "",
      altZh: "",
      mime: blob?.type ?? "",
      size: blob?.size ?? 0,
      addedAt: "",
    });
  }
  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

const blobUrlCache = new Map<string, string>();

export function invalidateMediaUrl(path: string): void {
  const cached = blobUrlCache.get(path);
  if (cached) URL.revokeObjectURL(cached);
  blobUrlCache.delete(path);
}

export async function resolveMediaUrl(url: string): Promise<string> {
  if (!url || url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (!url.startsWith("/")) return url;

  const cached = blobUrlCache.get(url);
  if (cached) return cached;

  const blob = await getMediaBlob(url);
  if (!blob) return url;

  const objectUrl = URL.createObjectURL(blob);
  blobUrlCache.set(url, objectUrl);
  return objectUrl;
}

export function revokeMediaUrlCache(): void {
  for (const objectUrl of blobUrlCache.values()) URL.revokeObjectURL(objectUrl);
  blobUrlCache.clear();
}

export function suggestUploadPath(file: File): string {
  const ext = file.name.includes(".") ? (file.name.split(".").pop()?.toLowerCase() ?? "bin") : "bin";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").slice(0, 15);
  return `/uploads/${stamp}-${base}.${ext}`;
}

export const MEDIA_MAX_BYTES = 48 * 1024 * 1024;

const ALLOWED = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg", "mp4", "webm", "pdf"]);

export function fileExtension(file: File): string {
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "" : "";
  return ext === "jpeg" ? "jpg" : ext;
}

export async function assertSafeMediaFile(file: File): Promise<void> {
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "" : "";
  if (!ALLOWED.has(ext)) throw new Error(`不支持的格式 .${ext || "未知"}。可用 PNG、JPG、WebP、GIF、SVG、MP4、WebM、PDF。`);
  if (file.size <= 0) throw new Error("文件是空的");
  if (file.size > MEDIA_MAX_BYTES) {
    throw new Error(`文件超过 ${Math.round(MEDIA_MAX_BYTES / (1024 * 1024))} MB 上限`);
  }
  if (ext === "svg") {
    const text = await file.text();
    if (/<script|javascript:|on\w+\s*=|<foreignObject|<iframe/i.test(text)) {
      throw new Error("SVG 含有脚本或事件处理，已拒绝");
    }
  }
}

export async function readImageSize(file: File): Promise<{ width?: number; height?: number; duration?: number }> {
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) return {};
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  }
  if (file.type.startsWith("video/")) {
    const url = URL.createObjectURL(file);
    try {
      const duration = await new Promise<number>((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => resolve(video.duration);
        video.onerror = () => reject(new Error("metadata"));
        video.src = url;
      });
      return { duration };
    } catch {
      return {};
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return {};
}
