import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useShoppingRegion, type ShoppingRegionMode } from "../../context/ShoppingRegionContext";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../../hooks/useResolvedMediaUrl";
import type { Lang } from "../../utils/siteCopy";
import { pickBilingual } from "../../utils/siteCopy";

function WeChatIcon({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none inline-flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400 hover:text-slate-400"
      aria-label={label}
      title={label}
    >
      {/* TODO: integrate WeChat ecosystem. */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8.5 10c.8 0 1.5-.7 1.5-1.5S9.3 7 8.5 7 7 7.7 7 8.5 7.7 10 8.5 10Zm7 0c.8 0 1.5-.7 1.5-1.5S16.3 7 15.5 7 14 7.7 14 8.5s.7 1.5 1.5 1.5Z"
          fill="currentColor"
        />
        <path
          d="M12 3C7 3 3 6.6 3 11c0 2.2 1.1 4.1 2.8 5.4L5 21l4.7-2.4c.8.2 1.6.4 2.4.4 5 0 9-3.6 9-8s-4-8-9-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    </span>
  );
}

export function Footer() {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useShoppingRegion();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const logoSrc = useResolvedMediaUrl(config?.brand.logoSrc?.trim() || "");
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";

  const onRegionChange = (next: ShoppingRegionMode) => {
    setMode(next);
  };

  const links = (config?.nav?.links ?? []).map((item) => ({
    id: item.id,
    to: item.to,
    label: pickBilingual(lang, item.label, item.to),
  }));

  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="page-wrap flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {logoSrc ? (
              <img src={logoSrc} alt={config?.brand.logoAlt || "coolinkey"} style={{ maxHeight: config?.brand.logoMaxHeightPx ?? 30 }} className="w-auto" />
            ) : (
              <div className="font-display text-xl font-semibold tracking-tight text-text">{config?.brand.displayName || "coolinkey"}</div>
            )}
            <p className="mt-1 text-sm text-text-muted">{pickBilingual(lang, config?.footer?.tagline, t("footer.tagline"))}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm font-medium text-text-muted">
            {links.map((item) => (
              <Link key={item.id} to={item.to} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {/* TODO: integrate WeChat ecosystem. */}
            <WeChatIcon label="WeChat Official Account (placeholder)" />
            <WeChatIcon label="WeChat Mini Program (placeholder)" />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
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
