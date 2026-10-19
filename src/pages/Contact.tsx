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
    <div className="page-wrap max-w-3xl py-16 sm:py-24">
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-text-muted">{lang === "zh" ? "联系" : "Contact"}</p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,4rem)] font-semibold tracking-tight text-text">{title}</h1>
      <p className="mt-6 text-[1.0625rem] leading-relaxed text-text-muted">{body}</p>
      <div className="mt-8">
        <Button variant="primary" href={`mailto:${config?.contact?.email?.trim() || "support@coolinkey.com"}`}>
          {pickBilingual(lang, config?.supportPage?.contactCta, t("supportPage.contactCta"))}
        </Button>
      </div>
    </div>
  );
}
