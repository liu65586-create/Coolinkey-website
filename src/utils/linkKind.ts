export type LinkKind =
  | "empty"
  | "repo"
  | "direct-video"
  | "direct-pdf"
  | "direct-image"
  | "youtube"
  | "vimeo"
  | "drive-folder"
  | "drive-file"
  | "drive-preview"
  | "external";

export type LinkInfo = {
  kind: LinkKind;
  /** Shape check only. Remote permission is never fetched. */
  verified: false;
  note: string;
};

export type PlaybackPlan =
  | { mode: "video"; src: string }
  | { mode: "iframe"; src: string }
  | { mode: "blocked"; reason: string };

const UNVERIFIED = "格式已识别，未验证是否可公开访问。请自行确认分享权限。";

function driveId(url: string): string | null {
  const file = url.match(/\/file\/d\/([^/]+)/);
  if (file) return file[1];
  const open = url.match(/[?&]id=([^&]+)/);
  return open ? open[1] : null;
}

export function classifyLink(raw: string): LinkInfo {
  const url = raw.trim();
  if (!url) return { kind: "empty", verified: false, note: "空链接" };
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return { kind: "external", verified: false, note: "这是浏览器临时地址，不能写入导出包。" };
  }
  if (url.startsWith("/")) return { kind: "repo", verified: false, note: "仓库内相对路径。新上传的文件会在提交并发布时写入仓库。" };

  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return { kind: "external", verified: false, note: "无法解析的链接" };
  }

  if (host === "drive.google.com" || host === "docs.google.com") {
    if (/\/folders\/|\/folderview/.test(url)) {
      return {
        kind: "drive-folder",
        verified: false,
        note: "这是 Google Drive 文件夹链接，不能当作文件直链或视频地址。",
      };
    }
    if (/\/preview/.test(url)) {
      return { kind: "drive-preview", verified: false, note: `Google Drive 预览链接。${UNVERIFIED}` };
    }
    if (driveId(url)) {
      return { kind: "drive-file", verified: false, note: `Google Drive 文件链接。${UNVERIFIED}` };
    }
    return { kind: "external", verified: false, note: "无法识别的 Google Drive 链接。" };
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "youtu.be" || host === "m.youtube.com") {
    return { kind: "youtube", verified: false, note: `YouTube 链接。${UNVERIFIED}` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    return { kind: "vimeo", verified: false, note: `Vimeo 链接。${UNVERIFIED}` };
  }
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return { kind: "direct-video", verified: false, note: "MP4/WebM 直链。" };
  if (/\.pdf(\?|$)/i.test(url)) return { kind: "direct-pdf", verified: false, note: "PDF 直链。未验证能否下载。" };
  if (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url)) {
    return { kind: "direct-image", verified: false, note: "图片直链。未验证能否访问。" };
  }
  return { kind: "external", verified: false, note: "外部链接。未验证能否访问。" };
}

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.pathname.startsWith("/embed/")) return url;
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function vimeoEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("player.vimeo.com")) return url;
    const id = u.pathname.split("/").filter(Boolean).pop();
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

export type DocumentPreview =
  | { mode: "pdf" }
  | { mode: "iframe"; src: string }
  | { mode: "none" };

/** Local uploads stay on the PDF renderer. A cloud file address opens in a preview frame. */
export function documentPreview(raw: string): DocumentPreview {
  const url = raw.trim();
  if (!url) return { mode: "none" };
  const info = classifyLink(url);
  if (info.kind === "drive-folder") return { mode: "none" };
  if (info.kind === "drive-preview") return { mode: "iframe", src: url };
  if (info.kind === "drive-file") {
    const id = driveId(url);
    return id ? { mode: "iframe", src: `https://drive.google.com/file/d/${id}/preview` } : { mode: "none" };
  }
  return { mode: "pdf" };
}

export function playbackPlan(raw: string): PlaybackPlan {
  const url = raw.trim();
  const info = classifyLink(url);
  if (info.kind === "direct-video" || (info.kind === "repo" && /\.(mp4|webm)(\?|$)/i.test(url))) {
    return { mode: "video", src: url };
  }
  if (info.kind === "youtube") {
    const src = youtubeEmbed(url);
    return src ? { mode: "iframe", src } : { mode: "blocked", reason: "无法从这条 YouTube 链接得到嵌入地址。" };
  }
  if (info.kind === "vimeo") {
    const src = vimeoEmbed(url);
    return src ? { mode: "iframe", src } : { mode: "blocked", reason: "无法从这条 Vimeo 链接得到嵌入地址。" };
  }
  if (info.kind === "drive-preview") return { mode: "iframe", src: url };
  if (info.kind === "drive-file") {
    const id = driveId(url);
    return id
      ? { mode: "iframe", src: `https://drive.google.com/file/d/${id}/preview` }
      : { mode: "blocked", reason: "无法识别 Drive 文件 ID。" };
  }
  if (info.kind === "drive-folder") {
    return { mode: "blocked", reason: "文件夹链接不能当作视频播放地址。" };
  }
  if (!url) return { mode: "blocked", reason: "没有视频地址。" };
  return { mode: "blocked", reason: "这条链接不是可播放的 MP4/WebM，也不是 YouTube、Vimeo 或 Drive 预览地址。" };
}
