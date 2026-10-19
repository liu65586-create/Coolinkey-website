import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function About() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = pickBilingual(lang, config?.about?.title, t("about.title"));
  const body = pickBilingual(lang, config?.about?.body, t("about.body"));
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";
  return (
    <section id="contact" className="site-anchor" tabIndex={-1}>
      <div id="about" className="v2-wrap about-panel">
        <p className="v2-eyebrow">coolinkey</p>
        <h2>{title}</h2>
        <p className="about-body">{body}</p>
        <Button variant="primary" href={`mailto:${email}`}>
          {pickBilingual(lang, config?.supportPage?.contactCta, t("supportPage.contactCta"))}
        </Button>
      </div>
    </section>
  );
}
