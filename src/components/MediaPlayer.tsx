import { useLayoutEffect, useRef } from "react";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import { playbackPlan } from "../utils/linkKind";

type Props = {
  url: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
};

function withAutoplay(src: string): string {
  try {
    const next = new URL(src);
    next.searchParams.set("autoplay", "1");
    return next.toString();
  } catch {
    return src;
  }
}

export function MediaPlayer({ url, title = "video", className = "", autoPlay = false }: Props) {
  const resolved = useResolvedMediaUrl(url);
  const plan = playbackPlan(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const original = url.trim();
  const videoSrc =
    plan.mode === "video"
      ? plan.src !== original && !plan.src.startsWith("/")
        ? plan.src
        : resolved || plan.src
      : "";

  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlay || !videoSrc) return;
    const start = el.play();
    if (!start) return;
    start.catch(() => {
      el.muted = true;
      void el.play();
    });
  }, [autoPlay, videoSrc]);

  if (plan.mode === "video") {
    return <video ref={videoRef} className={className} src={videoSrc} controls playsInline autoPlay={autoPlay} />;
  }
  if (plan.mode === "iframe") {
    return (
      <iframe
        title={title}
        src={autoPlay ? withAutoplay(plan.src) : plan.src}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <p className="p-4 text-sm text-text-muted">{plan.reason}</p>;
}
