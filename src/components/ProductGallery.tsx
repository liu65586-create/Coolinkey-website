import { ZoomIn } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResolvedImage } from "./ResolvedImage";

type Props = {
  images: string[];
  productName: string;
  focus?: string;
};

export function ProductGallery({ images, productName, focus = "50% 50%" }: Props) {
  const { t } = useTranslation();
  const list = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (list.length === 0) return null;

  const current = list[Math.min(idx, list.length - 1)];

  return (
    <div className="product-gallery">
      {list.length > 1 ? (
        <div className="product-thumbs">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`${productName} ${i + 1}`}
              aria-current={i === idx ? "true" : undefined}
              onClick={() => setIdx(i)}
            >
              <ResolvedImage src={src} alt="" fit="cover" className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setLightbox(current)}
        className="product-frame"
        aria-label={t("product.zoomHint")}
      >
        <ResolvedImage
          src={current}
          alt={productName}
          fit="cover"
          focus={focus}
          className="product-hero-image"
        />
        <span className="product-zoom" aria-hidden="true">
          <ZoomIn size={18} strokeWidth={1.75} />
        </span>
      </button>

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
