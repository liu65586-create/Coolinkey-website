const DB_NAME = "coolinkey_media";
const STORE = "blobs";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
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
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(path);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
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

const blobUrlCache = new Map<string, string>();

export async function resolveMediaUrl(url: string): Promise<string> {
  if (!url || url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }
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
  for (const u of blobUrlCache.values()) URL.revokeObjectURL(u);
  blobUrlCache.clear();
}

export function suggestUploadPath(slotId: string, file: File): string {
  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "bin" : "bin";
  const safe = slotId.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return `/uploads/${safe}.${ext}`;
}
