import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useShoppingRegion, type ShoppingRegionMode } from "../../context/ShoppingRegionContext";
import { useSiteConfig } from "../../context/SiteConfigContext";
import type { Lang } from "../../utils/siteCopy";
import { pickBilingual } from "../../utils/siteCopy";

export function Footer() {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useShoppingRegion();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";
  const logo = config?.brand.logoSrc?.trim() || "/brand/coolinkey-logo-dark.png";

  const onRegionChange = (next: ShoppingRegionMode) => {
    setMode(next);
  };

  return (
    <footer className="v2-footer">
      <div className="v2-wrap v2-footer-brand">
        <img className="v2-footer-logo" src={logo} alt="COOLINKEY" />
      </div>
      <div className="v2-wrap v2-footer-meta">
        <div>© COOLINKEY · {pickBilingual(lang, config?.footer?.icp, t("footer.icp"))}</div>
        <div className="v2-footer-legal">
          <Link to="/privacy">{pickBilingual(lang, config?.footer?.privacy, t("footer.privacy"))}</Link>
          <Link to="/cookie-policy">{pickBilingual(lang, config?.footer?.cookie, t("footer.cookie"))}</Link>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span>{t("footer.shoppingRegion")}</span>
          {(
            [
              ["auto", t("footer.regionAuto")],
              ["cn", t("footer.regionCn")],
              ["global", t("footer.regionGlobal")],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onRegionChange(key)}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold",
                mode === key ? "border-accent text-accent" : "border-[var(--color-border)] text-text-muted",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
