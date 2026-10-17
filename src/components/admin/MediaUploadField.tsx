import { useCallback, useRef, useState } from "react";
import { useResolvedMediaUrl } from "../../hooks/useResolvedMediaUrl";
import { MEDIA_MAX_BYTES } from "../../utils/mediaStore";
import { mediaAccept, importMediaFile } from "../../utils/mediaUpload";
import { LinkKindNote } from "./LinkKindNote";

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
  const [failed, setFailed] = useState(false);
  const preview = useResolvedMediaUrl(value);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setUploading(true);
      setStatus(null);
      setFailed(false);
      try {
        const result = await importMediaFile(file);
        onChange(result.path);
        setStatus("已放入本机媒体库。导出完整变更包并提交仓库后，线上才会更新。");
        setFailed(false);
      } catch (error) {
        setFailed(true);
        setStatus(error instanceof Error ? error.message : "导入失败");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const isVideo = kind === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(value);
  const isPdf = kind === "pdf" || /\.pdf(\?|$)/i.test(value);

  return (
    <div data-slot={slotId} className={`space-y-2 ${compact ? "" : "rounded-lg border border-white/10 bg-black/30 p-4"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-white/90">{label}</div>
          {spec ? <div className="mt-0.5 text-[11px] text-[#888]">{spec}</div> : null}
        </div>
        {status ? <div className={`text-[11px] ${failed ? "text-red-300" : "text-[#d7ecdf]"}`}>{status}</div> : null}
      </div>

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
        {preview && !isPdf ? (
          isVideo ? (
            <video src={preview} className="mx-auto max-h-[160px] w-full object-contain" muted playsInline controls />
          ) : (
            <img src={preview} alt="" className="mx-auto max-h-[160px] w-full object-contain" />
          )
        ) : (
          <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-2 px-4 py-6 text-center text-xs text-[#888]">
            {isPdf && value ? (
              <span className="text-[#00e676]">PDF · {value.split("/").pop()}</span>
            ) : (
              <>
                <span>拖拽文件到此处，或点击选择</span>
                <span className="text-[10px] text-[#666]">上限 {Math.round(MEDIA_MAX_BYTES / (1024 * 1024))} MB。选择文件后进入本机媒体库，不会直接写入服务器。</span>
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

      <div className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border border-white/12 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#00e676]"
          value={value}
          placeholder="https://… 或 /uploads/…"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#ccc] hover:border-[#00e676]"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "…" : "选择文件"}
        </button>
      </div>
      <LinkKindNote value={value} />
    </div>
  );
}
