import { useState } from "react";
import type { CmsManual } from "../types/cms";
import { MediaPlayer } from "./MediaPlayer";

const POSTER = "/images/listing/one-touch-unlock.jpg";

export function manualVideoUrl(manual: CmsManual, lang: "en" | "zh"): string | null {
  const url = lang === "zh" ? manual.videoUrlZh || manual.videoUrlEn : manual.videoUrlEn || manual.videoUrlZh;
  return url?.trim() || null;
}

type Props = {
  src: string | null;
  label: string;
};

export function VideoFrame({ src, label }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={playing ? "v2-video-frame is-playing" : "v2-video-frame"}>
      {playing && src ? (
        <MediaPlayer url={src} title={label} autoPlay className="v2-video-player" />
      ) : (
        <button
          type="button"
          className="v2-video"
          onClick={() => src && setPlaying(true)}
          disabled={!src}
          aria-label={label}
        >
          <img src={POSTER} alt="" />
          {src ? <span className="v2-play" aria-hidden="true" /> : null}
        </button>
      )}
    </div>
  );
}
