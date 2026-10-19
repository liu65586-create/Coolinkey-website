import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function About() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = pickBilingual(lang, config?.about?.title, t("about.title"));
  const body = pickBilingual(lang, config?.about?.body, t("about.body"));
  return (
    <div className="page-wrap max-w-3xl py-16 sm:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-text-muted">coolinkey</p>
      <h2 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-text sm:text-[36px]">{title}</h2>
      <p className="mt-4 text-[16px] leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}
