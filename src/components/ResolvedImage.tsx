import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fit?: "contain" | "cover";
  focus?: string;
};

/** Image with IndexedDB blob resolution for admin local preview. */
export function ResolvedImage({ src, alt = "", className = "", loading = "lazy", fit, focus }: Props) {
  const resolved = useResolvedMediaUrl(src);
  if (!resolved) return null;
  const fitClass = fit === "contain" ? "object-contain" : fit === "cover" ? "object-cover" : "";
  return (
    <img
      src={resolved}
      alt={alt}
      className={[className, fitClass].filter(Boolean).join(" ")}
      style={focus ? { objectPosition: focus } : undefined}
      loading={loading}
      decoding="async"
    />
  );
}
