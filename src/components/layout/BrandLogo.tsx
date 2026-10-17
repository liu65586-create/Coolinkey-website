import { useEffect, useState } from "react";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../../hooks/useResolvedMediaUrl";
import { clampLogoHeight } from "../../utils/brandLogo";

type Props = {
  variant?: "nav" | "footer";
};

export function BrandLogo({ variant = "nav" }: Props) {
  const { config } = useSiteConfig();
  const raw = config?.brand.logoSrc?.trim() ?? "";
  const resolved = useResolvedMediaUrl(raw);
  const [broken, setBroken] = useState(false);
  const height = clampLogoHeight(config?.brand.logoMaxHeightPx);
  const alt = config?.brand.logoAlt?.trim() || "coolinkey";
  const name = config?.brand.displayName?.trim() || "coolinkey";

  useEffect(() => {
    setBroken(false);
  }, [resolved]);

  if (!resolved || broken) {
    return (
      <span
        className={
          variant === "nav"
            ? "font-display text-[22px] font-semibold tracking-tight text-text sm:text-[24px]"
            : "font-display text-xl font-semibold tracking-tight text-text"
        }
      >
        {name}
      </span>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      decoding="async"
      draggable={false}
      className={
        variant === "nav"
          ? "block h-auto w-auto max-w-[42vw] object-contain sm:max-w-[180px]"
          : "block h-auto w-auto max-w-[min(200px,70vw)] object-contain"
      }
      style={{ maxHeight: height, height: "auto", width: "auto", objectFit: "contain" }}
      onError={() => setBroken(true)}
    />
  );
}
