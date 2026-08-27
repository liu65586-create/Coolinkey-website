import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/** Image with IndexedDB blob resolution for admin local preview. */
export function ResolvedImage({ src, alt = "", className = "", loading = "lazy" }: Props) {
  const resolved = useResolvedMediaUrl(src);
  if (!resolved) return null;
  return <img src={resolved} alt={alt} className={className} loading={loading} decoding="async" />;
}
