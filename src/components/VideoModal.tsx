import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { CmsManual } from "../types/cms";
import { MediaPlayer } from "./MediaPlayer";

export function manualVideoUrl(manual: CmsManual, lang: "en" | "zh"): string | null {
  const url = lang === "zh" ? manual.videoUrlZh || manual.videoUrlEn : manual.videoUrlEn || manual.videoUrlZh;
  return url?.trim() || null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  src: string | null;
};

export function VideoModal({ open, onClose, src }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !src) return null;

  return createPortal(
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4" onMouseDown={onClose}>
      <div className="relative w-[min(920px,92vw)]" onMouseDown={(e) => e.stopPropagation()}>
        <div className="v2-modal-stage">
          <MediaPlayer url={src} title="coolinkey video" autoPlay className="v2-video-player" />
          <button type="button" className="v2-modal-close" onClick={onClose}>
            {t("manualsSection.close")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
