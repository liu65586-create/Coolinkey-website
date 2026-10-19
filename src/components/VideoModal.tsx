import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MediaPlayer } from "./MediaPlayer";

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
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4" onMouseDown={onClose}>
      <div
        className="relative w-[min(80vw,960px)] overflow-hidden rounded-2xl bg-black shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-text hover:bg-white"
          onClick={onClose}
        >
          {t("manualsSection.close")}
        </button>
        <div className="aspect-video w-full">
          <MediaPlayer url={src} title="coolinkey video" autoPlay className="h-full w-full" />
        </div>
      </div>
    </div>,
    document.body
  );
}
