import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import { playbackPlan } from "../utils/linkKind";

type Props = {
  url: string;
  title?: string;
  className?: string;
};

export function MediaPlayer({ url, title = "video", className = "" }: Props) {
  const resolved = useResolvedMediaUrl(url);
  const plan = playbackPlan(url);
  if (plan.mode === "video") {
    return <video className={className} src={resolved || url} controls playsInline />;
  }
  if (plan.mode === "iframe") {
    return (
      <iframe
        title={title}
        src={plan.src}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <p className="p-4 text-sm text-text-muted">{plan.reason}</p>;
}
