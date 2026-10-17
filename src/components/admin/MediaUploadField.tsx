import { useCallback, useRef, useState } from "react";
import { useResolvedMediaUrl } from "../../hooks/useResolvedMediaUrl";
import { mediaAccept, uploadMediaFile } from "../../utils/mediaUpload";

export type MediaKind = "image" | "video" | "pdf" | "any";

type Props = {
  label: string;
  spec?: string;
  slotId: string;
  value: string;
  onChange: (url: string) => void;
  kind?: MediaKind;
  compact?: boolean;
};

const IMAGE_PRESETS = [
  { label: "跟随原图 / 自定义", value: "custom" },
  { label: "首页主视觉 · 16:9 · 2400×1350", value: "16:9" },
  { label: "宽幅横图 · 2.44:1 · 1464×600", value: "244:100" },
  { label: "A+ 模块 · 16:6.56 · 1646×600", value: "1646:600" },
  { label: "A+ 模块 · 13:9 · 650×450", value: "13:9" },
  { label: "产品展示 · 4:3 · 1600×1200", value: "4:3" },
  { label: "方形图片 · 1:1 · 1600×1600", value: "1:1" },
  { label: "竖版图片 · 3:4 · 1200×1600", value: "3:4" },
];

function normalizeDriveUrl(raw: string, kind: MediaKind): string {
  const value = raw.trim();
  if (!value) return value;
  const id = value.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([a-zA-Z0-9_-]+)/)?.[1]
    ?? value.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
  if (!id) return value;
  if (kind === "video") return `https://drive.google.com/file/d/${id}/preview`;
  if (kind === "pdf") return `https://drive.google.com/uc?export=download&id=${id}`;
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function MediaUploadField({
  label,
  spec,
  slotId,
  value,
  onChange,
  kind = "image",
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [preset, setPreset] = useState("custom");
  const preview = useResolvedMediaUrl(value);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setUploading(true);
      setStatus(null);
      try {
        const result = await uploadMediaFile(slotId, file);
        onChange(result.path);
        setStatus(
          result.savedToDisk
            ? "已写入网站文件目录（本地开发）"
            : "已存本浏览器预览缓存；发布前需配置持久化存储或把文件部署到网站"
        );
      } catch {
        setStatus("上传失败，请重试。");
      } finally {
        setUploading(false);
      }
    },
    [slotId, onChange]
  );

  const isVideo = kind === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(value);
  const isPdf = kind === "pdf" || /\.pdf(\?|$)/i.test(value);
  const isDrive = /drive\.google\.com/i.test(value);

  const applyDriveLink = () => {
    const normalized = normalizeDriveUrl(value, kind);
    onChange(normalized);
    setStatus(normalized !== value.trim()
      ? "已转换为适合当前媒体类型的 Drive 链接。请确认文件权限设置为可访问。"
      : "已保存链接。请确认文件权限允许网站访客查看。");
  };

  return (
    <div className={`space-y-2 ${compact ? "" : "rounded-lg border border-white/10 bg-black/30 p-4"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-white/90">{label}</div>
          {spec ? <div className="mt-0.5 text-[11px] text-[#888]">{spec}</div> : null}
        </div>
        {status ? <div className="max-w-full text-[11px] text-[#00e676]">{status}</div> : null}
      </div>

      {kind === "image" || kind === "any" ? (
        <label className="block text-xs text-[#bbb]">
          <span className="mb-1 block">展示尺寸预设（仅控制前台显示比例，不会修改原始文件像素）</span>
          <select
            className="w-full rounded-lg border border-white/12 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#00e676]"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            {IMAGE_PRESETS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {preset !== "custom" ? <span className="mt-1 block text-[10px] text-[#888]">选定比例可作为编辑参考；图片仍以完整显示为默认，具体页面布局可能有差异。</span> : null}
        </label>
      ) : null}

      <div
        className={[
          "relative overflow-hidden rounded-lg border border-dashed transition-colors",
          dragOver ? "border-[#00e676] bg-[#00e676]/5" : "border-white/15 bg-black/40",
          compact ? "min-h-[100px]" : "min-h-[140px]",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFile(e.dataTransfer.files[0] ?? null);
        }}
      >
        {preview && !isPdf && !isDrive ? (
          isVideo ? (
            <video src={preview} className="mx-auto max-h-[160px] w-full object-contain" muted playsInline controls />
          ) : (
            <img src={preview} alt="" className="mx-auto max-h-[160px] w-full object-contain" />
          )
        ) : (
          <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-2 px-4 py-6 text-center text-xs text-[#888]">
            {isPdf && value ? (
              <span className="text-[#00e676]">PDF · {value.split("/").pop()}</span>
            ) : isDrive ? (
              <span className="text-[#00e676]">Google Drive 链接已填写</span>
            ) : (
              <>
                <span>拖拽文件到此处，或点击选择</span>
                <span className="text-[10px] text-[#666]">支持直接上传或填写外部链接</span>
              </>
            )}
          </div>
        )}
        <button
          type="button"
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label={`Upload ${label}`}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          type="file"
          accept={mediaAccept(kind)}
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border border-white/12 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#00e676]"
          value={value}
          placeholder="粘贴 Google Drive 分享链接或 https 外链"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#ccc] hover:border-[#00e676]"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "上传中…" : "选择文件"}
        </button>
        {isDrive ? (
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[#00e676]/60 px-3 py-2 text-xs text-[#00e676] hover:bg-[#00e676]/10"
            onClick={applyDriveLink}
          >
            规范化 Drive 链接
          </button>
        ) : null}
      </div>
      {isDrive ? (
        <p className="text-[10px] leading-5 text-amber-200/80">
          Drive 文件必须允许网站访客访问；视频使用预览链接，图片/PDF 使用文件链接。部分 Drive 文件仍可能受跨域、下载或分享权限限制，发布前请用无登录窗口测试。
        </p>
      ) : null}
    </div>
  );
}
