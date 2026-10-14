import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CarouselControls } from "./CarouselControls";
import { ResolvedImage } from "./ResolvedImage";

type Props = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const { t } = useTranslation();
  const list = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (list.length === 0) return null;

  const current = list[Math.min(idx, list.length - 1)];

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setLightbox(current)}
        className="relative w-full overflow-hidden rounded-2xl bg-white"
        aria-label={t("product.zoomHint")}
      >
        <ResolvedImage
          src={current}
          alt={productName}
          className="mx-auto max-h-[420px] w-full object-contain p-4"
        />
      </button>

      <CarouselControls
        index={idx}
        total={list.length}
        onPrev={() => setIdx((i) => Math.max(0, i - 1))}
        onNext={() => setIdx((i) => Math.min(list.length - 1, i + 1))}
        onSelect={setIdx}
      />

      {list.length > 1 ? (
        <div className="flex justify-center gap-2 overflow-x-auto py-1">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={[
                "h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-surface-muted transition-opacity",
                i === idx ? "ring-2 ring-accent ring-offset-2" : "opacity-60 hover:opacity-100",
              ].join(" ")}
            >
              <ResolvedImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <button
          type="button"
          className="fixed inset-0 z-[250] bg-black/90 p-6"
          onMouseDown={() => setLightbox(null)}
          aria-label="Close"
        >
          <ResolvedImage
            src={lightbox}
            alt={productName}
            className="mx-auto max-h-[90vh] max-w-[95vw] object-contain"
            loading="eager"
          />
        </button>
      ) : null}
    </div>
  );
}
