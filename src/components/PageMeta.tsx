import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import { SITE_ORIGIN, seoForPath } from "../seo/documentMeta";
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

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function PageMeta() {
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.title = "COOLINKEY";
      upsertMeta("name", "robots", "noindex, nofollow");
      return;
    }
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
    const robots = "index, follow, max-image-preview:large";
    const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const canonical = path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
    document.title = title;
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
    if (description) upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertCanonical(canonical);
    return () => {
      document.title = previousTitle;
      if (meta) meta.setAttribute("content", previousDescription);
    };
  }, [pathname, config, lang]);

  return null;
}
