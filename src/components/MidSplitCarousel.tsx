import { useMemo, useState } from "react";
import type { Bilingual, MidSlide, MidSlideMediaKind } from "../types/siteConfig";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

type Variant = "imageLeft" | "textLeft";

function MediaView({ url, kind }: { url: string; kind: MidSlideMediaKind }) {
  const k = kind === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(url) ? "video" : "image";
  if (k === "video") {
    return (
      <video
        className="h-full w-full max-h-[420px] rounded-xl object-cover"
        src={url}
        controls
        playsInline
        muted
        loop
        preload="metadata"
      />
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="h-full w-full max-h-[420px] rounded-xl object-cover"
      loading="lazy"
      decoding="async"
    />
  );
}

export function MidSplitCarousel({
  variant,
  title,
  slides,
  lang,
}: {
  variant: Variant;
  title: Bilingual | undefined;
  slides: MidSlide[];
  lang: Lang;
}) {
  const [i, setI] = useState(0);
  const safeSlides = useMemo(() => (slides.length ? slides : []), [slides]);

  if (!safeSlides.length) return null;

  const slide = safeSlides[Math.min(i, safeSlides.length - 1)];
  const heading = pickBilingual(lang, title, "").trim();
  const body = pickBilingual(lang, slide.text, "");

  const media = <MediaView url={slide.mediaUrl} kind={slide.mediaKind} />;
  const textBlock = (
    <div className="flex flex-col justify-center space-y-4">
      {heading ? <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">{heading}</h3> : null}
      <p className="text-[15px] leading-relaxed text-slate-600 sm:text-base">{body}</p>
    </div>
  );

  const carouselControls = (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40"
          disabled={i === 0}
          onClick={() => setI((x) => Math.max(0, x - 1))}
        >
          ‹
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40"
          disabled={i >= safeSlides.length - 1}
          onClick={() => setI((x) => Math.min(safeSlides.length - 1, x + 1))}
        >
          ›
        </button>
      </div>
      <div className="flex gap-1">
        {safeSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            className={`h-2 w-2 rounded-full ${idx === i ? "bg-emerald-600" : "bg-slate-300"}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </div>
  );

  const row =
    variant === "imageLeft" ? (
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div>
          {media}
          {carouselControls}
        </div>
        <div>{textBlock}</div>
      </div>
    ) : (
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="order-1 lg:order-1">
          {textBlock}
          {carouselControls}
        </div>
        <div className="order-2 lg:order-2">{media}</div>
      </div>
    );

  return <div className="mx-auto max-w-6xl px-4 sm:px-6">{row}</div>;
}
