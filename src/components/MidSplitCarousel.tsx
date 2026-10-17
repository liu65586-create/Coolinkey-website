import { useMemo, useState } from "react";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import type { Bilingual, MidSlide, MidSlideMediaKind } from "../types/siteConfig";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { CarouselControls } from "./CarouselControls";
import { MediaPlayer } from "./MediaPlayer";
import { ResolvedImage } from "./ResolvedImage";

type Variant = "imageLeft" | "textLeft";

function MediaView({ url, kind, fit, focus }: { url: string; kind: MidSlideMediaKind; fit?: MidSlide["imageFit"]; focus?: string }) {
  const resolved = useResolvedMediaUrl(url);
  const k = kind === "video" || /\.(mp4|webm)(\?|$)/i.test(url) ? "video" : "image";
  if (!resolved && k !== "video") return null;
  if (k === "video") {
    return <MediaPlayer url={url} className="aspect-[16/10] w-full max-h-[400px] rounded-lg bg-black object-contain" />;
  }
  return (
    <ResolvedImage
      src={url}
      alt=""
      fit={fit === "contain" ? "contain" : "cover"}
      focus={focus || "50% 50%"}
      className="aspect-[16/10] w-full max-h-[400px] rounded-lg"
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

  const media = <MediaView url={slide.mediaUrl} kind={slide.mediaKind} fit={slide.imageFit} focus={slide.focus} />;
  const textBlock = (
    <div className="flex flex-col justify-center space-y-4 lg:py-4">
      {heading ? <h3 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{heading}</h3> : null}
      <p className="text-[15px] leading-relaxed text-text-muted">{body}</p>
    </div>
  );

  const controls = (
    <CarouselControls
      index={i}
      total={safeSlides.length}
      onPrev={() => setI((x) => Math.max(0, x - 1))}
      onNext={() => setI((x) => Math.min(safeSlides.length - 1, x + 1))}
      onSelect={setI}
    />
  );

  const row =
    variant === "imageLeft" ? (
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          {media}
          {controls}
        </div>
        <div>{textBlock}</div>
      </div>
    ) : (
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          {textBlock}
          {controls}
        </div>
        <div className="order-1 lg:order-2">{media}</div>
      </div>
    );

  return <div className="page-wrap">{row}</div>;
}
