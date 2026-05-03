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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
