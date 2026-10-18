import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { CmsManual, ManualType } from "../types/cms";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import { Button } from "./Button";
import { MediaPlayer } from "./MediaPlayer";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type Props = {
  open: boolean;
  onClose: () => void;
  manual: CmsManual | null;
  lang: "en" | "zh";
};

type PdfState = "idle" | "checking" | "ready" | "invalid" | "failed";

const CMAP_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`;

export function ManualModal({ open, onClose, manual, lang }: Props) {
  const { t } = useTranslation();
  const titleId = useId();
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [pdfState, setPdfState] = useState<PdfState>("idle");

  const type: ManualType | null = manual?.type ?? null;
  const pdfUrl =
    manual && (lang === "zh" ? manual.pdfFileZh : manual.pdfFileEn)
      ? lang === "zh"
        ? (manual.pdfFileZh as string)
        : (manual.pdfFileEn as string)
      : null;
  const resolvedPdf = useResolvedMediaUrl(pdfUrl);
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
    const host = canvasHostRef.current;
    if (!open || type === "video" || !resolvedPdf || !host) {
      setPdfState(open && pdfUrl && !resolvedPdf ? "checking" : "idle");
      return;
    }

    let cancelled = false;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
    host.replaceChildren();
    setPdfState("checking");

    (async () => {
      const response = await fetch(resolvedPdf);
      if (!response.ok) throw new Error("http");
      const data = new Uint8Array(await response.arrayBuffer());
      const header = new TextDecoder().decode(data.subarray(0, 5));
      if (!header.startsWith("%PDF")) throw new Error("not-pdf");

      loadingTask = pdfjsLib.getDocument({
        data,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
      });
      const pdf = await loadingTask.promise;
      if (cancelled) return;
      setPdfState("ready");

      for (let i = 1; i <= pdf.numPages; i += 1) {
        if (cancelled) return;
        const page = await pdf.getPage(i);
        const base = page.getViewport({ scale: 1 });
        const cssWidth = Math.max(280, host.clientWidth || 880);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: (cssWidth / base.width) * pixelRatio });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.style.display = "block";
        canvas.style.background = "#fff";
        if (i < pdf.numPages) canvas.style.marginBottom = "12px";
        host.appendChild(canvas);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    })().catch((error: unknown) => {
      if (cancelled) return;
      const message = error instanceof Error ? error.message : "";
      setPdfState(message === "not-pdf" ? "invalid" : "failed");
    });

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [open, pdfUrl, type, resolvedPdf]);

  if (!open || !manual) return null;

  const title = lang === "zh" ? manual.title.zh : manual.title.en;
  const showPdf = type !== "video" && Boolean(resolvedPdf || pdfUrl);

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[86vh] w-[min(960px,92vw)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-text-muted hover:text-accent"
            onClick={onClose}
          >
            {t("manualsSection.close")}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-neutral-100 px-4 py-4">
          {type === "video" && videoUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <MediaPlayer url={videoUrl} title={title} className="absolute inset-0 h-full w-full" />
            </div>
          ) : showPdf ? (
            <div>
              {pdfState === "checking" || pdfState === "idle" ? (
                <p className="px-6 py-16 text-center text-[15px] text-slate-600">{t("manualsSection.previewLoading")}</p>
              ) : null}
              {pdfState === "invalid" ? (
                <p className="px-6 py-16 text-center text-[15px] leading-relaxed text-slate-600">{t("manualsSection.previewFailed")}</p>
              ) : null}
              {pdfState === "failed" ? (
                <iframe title={title} src={resolvedPdf || undefined} className="h-[min(68vh,760px)] w-full rounded-lg border-0 bg-white" />
              ) : null}
              <div ref={canvasHostRef} className={pdfState === "ready" ? "rounded-lg bg-white" : "hidden"} />
            </div>
          ) : (
            <p className="px-6 py-16 text-center text-[15px] text-slate-600">{t("manualsSection.noPreview")}</p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          {resolvedPdf ? (
            <a
              href={resolvedPdf}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-transparent bg-black px-8 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#222]"
            >
              {t("manualsSection.downloadPdf")}
            </a>
          ) : null}
          <Button variant="secondary" onClick={onClose}>
            {t("manualsSection.close")}
          </Button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
