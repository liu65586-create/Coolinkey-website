import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { CmsManual } from "../types/cms";
import { MediaPlayer } from "./MediaPlayer";

const POSTER = "/images/listing/one-touch-unlock.jpg";

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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) setStarted(false);
  }, [open]);

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
        <button
          type="button"
          className="absolute -top-11 right-0 rounded-full px-3 py-1.5 text-sm font-semibold text-white hover:text-accent"
          onClick={onClose}
        >
          {t("manualsSection.close")}
        </button>
        <div className="v2-modal-stage">
          {started ? (
            <MediaPlayer url={src} title="coolinkey video" autoPlay className="v2-video-player" />
          ) : (
            <button type="button" className="v2-video" onClick={() => setStarted(true)} aria-label={t("manualsSection.preview")}>
              <img src={POSTER} alt="" />
              <span className="v2-play" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
