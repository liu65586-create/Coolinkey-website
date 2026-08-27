import { getMediaBlob, saveMediaBlob, suggestUploadPath } from "./mediaStore";

export type UploadResult = {
  path: string;
  previewUrl: string;
  savedToDisk: boolean;
};

export async function uploadMediaFile(
  slotId: string,
  file: File,
  suggestedPath?: string
): Promise<UploadResult> {
  const path = suggestedPath ?? suggestUploadPath(slotId, file);

  let savedToDisk = false;
  try {
    const res = await fetch(`/api/upload?path=${encodeURIComponent(path.replace(/^\//, ""))}`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: file,
    });
    if (res.ok) savedToDisk = true;
  } catch {
    /* dev API unavailable */
  }

  await saveMediaBlob(path, file);

  const previewUrl = savedToDisk ? path : URL.createObjectURL(file);
  return { path, previewUrl, savedToDisk };
}

export async function downloadStoredMedia(path: string, filename?: string): Promise<void> {
  const blob = await getMediaBlob(path);
  if (!blob) {
    alert("本地未找到该文件，请重新上传。");
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? path.split("/").pop() ?? "file";
  a.click();
  URL.revokeObjectURL(url);
}

export function mediaAccept(kind: "image" | "video" | "pdf" | "any"): string {
  switch (kind) {
    case "image":
      return "image/*,.gif,.webp";
    case "video":
      return "video/mp4,video/webm,video/ogg,.mp4,.webm";
    case "pdf":
      return "application/pdf,.pdf";
    default:
      return "image/*,video/*,application/pdf,.gif,.webp,.mp4,.pdf";
  }
}
