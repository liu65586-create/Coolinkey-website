import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import { seoForPath } from "../seo/documentMeta";
import type { SeoFields } from "../types/siteConfig";
import { pickBilingual, type Lang } from "../utils/siteCopy";

type SeoKey = "home" | "product" | "support" | "about" | "contact" | "privacy" | "cookie";

function pageKey(pathname: string): SeoKey | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/privacy")) return "privacy";
  if (pathname.startsWith("/cookie-policy")) return "cookie";
  return null;
}

function upsertMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

export function PageMeta() {
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  useEffect(() => {
    const fallback = seoForPath(pathname);
    const key = pageKey(pathname);
    const fields: SeoFields | undefined = key ? config?.seo?.[key] : undefined;
    const cmsTitle = fields ? pickBilingual(lang, fields.title, "") : "";
    const cmsDescription = pickBilingual(lang, fields?.description, "");
    const title = cmsTitle || (lang === "zh" ? fallback.titleZh : fallback.title);
    const description = cmsDescription || (lang === "zh" ? fallback.descriptionZh : fallback.description);
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    const robots = pathname.startsWith("/admin") ? "noindex, nofollow" : "index, follow, max-image-preview:large";
    document.title = title;
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
    if (description) upsertMeta("description", description);
    upsertMeta("robots", robots);
    return () => {
      document.title = previousTitle;
      if (meta) meta.setAttribute("content", previousDescription);
    };
  }, [pathname, config, lang]);

  return null;
}
