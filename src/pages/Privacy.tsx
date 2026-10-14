import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function Privacy() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = pickBilingual(lang, config?.legal?.privacyTitle, t("legal.privacyTitle"));
  const body = pickBilingual(lang, config?.legal?.privacyBody, t("legal.privacyBody"));
  return (
    <div className="page-wrap max-w-3xl py-16 sm:py-20">
      <h1 className="font-display text-4xl font-bold tracking-tight text-text">{title}</h1>
      <p className="mt-6 text-[16px] leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}
