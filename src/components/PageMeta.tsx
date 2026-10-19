import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
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

export function PageMeta() {
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  useEffect(() => {
    const key = pageKey(pathname);
    const fields: SeoFields | undefined = key ? config?.seo?.[key] : undefined;
    const title = fields
      ? pickBilingual(lang, fields.title, "")
      : pathname.startsWith("/business")
        ? lang === "zh"
          ? "商务合作与咨询"
          : "Business Partnerships & Inquiries"
        : "";
    const description = pickBilingual(lang, fields?.description, "");
    const meta = document.querySelector('meta[name="description"]');
    const previousTitle = document.title;
    const previousDescription = meta?.getAttribute("content") ?? "";
    if (title) document.title = title;
    if (description && meta) meta.setAttribute("content", description);
    return () => {
      document.title = previousTitle;
      if (meta) meta.setAttribute("content", previousDescription);
    };
  }, [pathname, config, lang]);

  return null;
}
