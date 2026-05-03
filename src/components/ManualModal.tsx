import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CmsManual, ManualType } from "../types/cms";
import { Button } from "./Button";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type Props = {
  open: boolean;
  onClose: () => void;
  manual: CmsManual | null;
  lang: "en" | "zh";
};

export function ManualModal({ open, onClose, manual, lang }: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const type: ManualType | null = manual?.type ?? null;
  const pdfUrl =
    manual && (lang === "zh" ? manual.pdfFileZh : manual.pdfFileEn)
      ? lang === "zh"
        ? (manual.pdfFileZh as string)
        : (manual.pdfFileEn as string)
      : null;
  const videoUrl =
    manual && manual.type === "video"
      ? lang === "zh"
        ? (manual.videoUrlZh ?? manual.videoUrlEn)
        : (manual.videoUrlEn ?? manual.videoUrlZh)
      : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = "";
    setPdfError(null);
    if (type !== "video" && pdfUrl) {
      let cancelled = false;
      (async () => {
        try {
          const task = pdfjsLib.getDocument({ url: pdfUrl });
          const pdf = await task.promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            if (cancelled) return;
            const page = await pdf.getPage(i);
            const scale = 1.25;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.className = "mx-auto mb-4 max-w-full bg-white";
            await page.render({ canvasContext: ctx, viewport }).promise;
            el.appendChild(canvas);
          }
        } catch {
          if (!cancelled) setPdfError("PDF preview failed. You can still download the file.");
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, [open, type, pdfUrl]);

  if (!open || !manual) return null;

  const title = lang === "zh" ? manual.title.zh : manual.title.en;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[80vh] w-[80vw] max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700"
            onClick={onClose}
          >
            {t("manualsSection.close")}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-4 py-4">
          {type === "video" && videoUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  title={title}
                  src={videoUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-center text-sm text-slate-600">{t("manualsSection.videoNote")}</p>
            </div>
          ) : pdfUrl ? (
            <div>
              {pdfError ? <p className="text-center text-slate-600">{pdfError}</p> : null}
              <div ref={containerRef} className="flex flex-col items-stretch" />
            </div>
          ) : (
            <p className="text-center text-slate-600">No preview available.</p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-[8px] border-2 border-transparent bg-emerald-600 px-8 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              {t("manualsSection.downloadPdf")}
            </a>
          ) : null}
          <Button variant="secondary" onClick={onClose}>
            {t("manualsSection.close")}
          </Button>
        </footer>
      </div>
    </div>
  );
}
