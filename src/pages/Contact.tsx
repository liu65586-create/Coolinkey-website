import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function Contact() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = pickBilingual(lang, config?.contact?.title, t("contact.title"));
  const body = pickBilingual(lang, config?.contact?.body, t("contact.body"));
  return (
    <div className="page-wrap max-w-3xl py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{t("supportPage.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text">{title}</h1>
      <p className="mt-6 text-[16px] leading-relaxed text-text-muted">{body}</p>
      <div className="mt-8">
        <Button variant="primary" href="mailto:support@coolinkey.com">
          {t("supportPage.contactCta")}
        </Button>
      </div>
    </div>
  );
}
