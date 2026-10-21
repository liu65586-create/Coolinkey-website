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
  const paragraphs = body.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  return (
    <section id="contact" className="site-anchor" tabIndex={-1}>
      <div id="about" className="v2-wrap about-panel">
        <h2>{title}</h2>
        <div className="about-body">
          {paragraphs.map((paragraph, index) => {
            const signoff = index === paragraphs.length - 1 && paragraph.startsWith("COOLINKEY");
            return (
              <p key={paragraph} className={signoff ? "about-signoff" : undefined}>
                {signoff ? <strong>{paragraph}</strong> : paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
