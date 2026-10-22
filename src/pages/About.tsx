import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

function copy(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

export function About() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = pickBilingual(lang, config?.about?.title, t("about.title"));
  const body = pickBilingual(lang, config?.about?.body, t("about.body"));
  const paragraphs = body.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  return (
    <div id="about" className="v2-wrap about-panel site-anchor" tabIndex={-1}>
      <div className="about-lead">
        <p className="use-kicker">{copy(lang, "About COOLINKEY", "关于 COOLINKEY")}</p>
        <h2>{title}</h2>
      </div>
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
  );
}
