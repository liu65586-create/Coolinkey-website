import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
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
    <div className="video-modal-backdrop" onMouseDown={onClose}>
      <div
        className="video-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="COOLINKEY video"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="video-modal-bar">
          <span className="video-modal-label" aria-hidden="true">COOLINKEY</span>
          <button type="button" className="video-modal-close" onClick={onClose} aria-label={t("manualsSection.close")}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="video-modal-stage">
          <MediaPlayer url={src} title="COOLINKEY video" autoPlay className="video-modal-player" />
        </div>
      </div>
    </div>,
    document.body
  );
}
