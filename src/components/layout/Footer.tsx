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

  const onRegionChange = (next: ShoppingRegionMode) => {
    setMode(next);
  };

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="page-wrap flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-text-muted">© COOLINKEY</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link className="font-medium text-text-muted hover:text-accent" to="/privacy">
              {pickBilingual(lang, config?.footer?.privacy, t("footer.privacy"))}
            </Link>
            <Link className="font-medium text-text-muted hover:text-accent" to="/cookie-policy">
              {pickBilingual(lang, config?.footer?.cookie, t("footer.cookie"))}
            </Link>
            <a className="font-medium text-text-muted hover:text-accent" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center text-xs text-text-muted sm:text-left">{pickBilingual(lang, config?.footer?.icp, t("footer.icp"))}</div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-xs text-text-muted">{t("footer.shoppingRegion")}</div>
            <div className="flex flex-wrap gap-2">
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
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    mode === key
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-[var(--color-border)] text-text-muted hover:border-accent hover:text-accent",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
