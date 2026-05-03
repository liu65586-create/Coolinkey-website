import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const { t } = useTranslation();
  const list = useMemo(() => (images.length ? images : []), [images]);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (list.length === 0) return null;

  const current = list[Math.min(idx, list.length - 1)];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setLightbox(current)}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
        aria-label={t("product.zoomHint")}
      >
        <img src={current} alt={productName} className="mx-auto max-h-[420px] w-full object-contain" />
      </button>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        >
          ‹
        </button>
        <div className="flex flex-1 justify-center gap-2 overflow-x-auto py-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={[
                "h-14 w-20 shrink-0 overflow-hidden rounded-md border",
                i === idx ? "border-emerald-600" : "border-slate-200 hover:border-emerald-500",
              ].join(" ")}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40"
          disabled={idx >= list.length - 1}
          onClick={() => setIdx((i) => Math.min(list.length - 1, i + 1))}
        >
          ›
        </button>
      </div>

      {lightbox ? (
        <button
          type="button"
          className="fixed inset-0 z-[250] bg-black/90 p-6"
          onMouseDown={() => setLightbox(null)}
          aria-label="Close"
        >
          <img
            src={lightbox}
            alt={productName}
            className="mx-auto max-h-[90vh] max-w-[95vw] object-contain"
            onMouseDown={(e) => e.stopPropagation()}
          />
        </button>
      ) : null}
    </div>
  );
}
