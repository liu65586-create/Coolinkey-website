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
    <div className="v2-home v2-section">
      <div className="v2-wrap v2-section-head">
        <p className="v2-eyebrow">{lang === "zh" ? "联系" : "Contact"}</p>
        <h2 id="contact-title">{title}</h2>
        <p>{body}</p>
        <div className="v2-actions">
          <Button variant="primary" href={`mailto:${config?.contact?.email?.trim() || "support@coolinkey.com"}`}>
            {pickBilingual(lang, config?.supportPage?.contactCta, t("supportPage.contactCta"))}
          </Button>
        </div>
      </div>
    </div>
  );
}
