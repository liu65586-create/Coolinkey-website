import {
  assertSafeMediaFile,
  invalidateMediaUrl,
  readImageSize,
  saveMediaBlob,
  saveMediaMeta,
  suggestUploadPath,
  type MediaMeta,
} from "./mediaStore";

export type UploadResult = {
  path: string;
  savedToDisk: false;
};

export async function importMediaFile(file: File, path = suggestUploadPath(file)): Promise<UploadResult> {
  await assertSafeMediaFile(file);
  const measured = await readImageSize(file).catch(() => ({}) as Awaited<ReturnType<typeof readImageSize>>);
  await saveMediaBlob(path, file);
  const meta: MediaMeta = {
    path,
    name: file.name,
    altEn: "",
    altZh: "",
    mime: file.type || "application/octet-stream",
    size: file.size,
    width: measured.width,
    height: measured.height,
    duration: measured.duration,
    addedAt: new Date().toISOString(),
  };
  await saveMediaMeta(meta);
  invalidateMediaUrl(path);
  window.dispatchEvent(new Event("coolinkey-media"));
  return { path, savedToDisk: false };
}

export function mediaAccept(kind: "image" | "video" | "pdf" | "any"): string {
  switch (kind) {
    case "image":
      return "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.svg";
    case "video":
      return "video/mp4,video/webm,.mp4,.webm";
    case "pdf":
      return "application/pdf,.pdf";
    default:
      return "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,application/pdf,.png,.jpg,.jpeg,.webp,.gif,.svg,.mp4,.webm,.pdf";
  }
}
