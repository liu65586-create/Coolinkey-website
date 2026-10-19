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
  const copy = (en: string, zh: string) => (lang === "zh" ? zh : en);

  const onRegionChange = (next: ShoppingRegionMode) => {
    setMode(next);
  };

  return (
    <footer className="v2-footer">
      <div className="v2-wrap v2-footer-grid">
        <div>
          <img className="v2-footer-logo" src={logo} alt="COOLINKEY" />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-text-muted">
            {pickBilingual(lang, config?.footer?.tagline, copy("Smart Lock for a Freer You.", "让出行更自由的智能锁。"))}
          </p>
          {/* TODO: integrate WeChat ecosystem. */}
          <p className="v2-wechat mt-4">WeChat</p>
        </div>
        <div>
          <h2>{copy("Product", "产品")}</h2>
          <ul>
            <li><Link to="/#clx1">CLX1</Link></li>
            <li><Link to="/#clx1">{copy("Specifications", "规格")}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{copy("Support", "支持")}</h2>
          <ul>
            <li><Link to="/#support">{copy("FAQ", "常见问题")}</Link></li>
            <li><Link to="/#support">{copy("User Manual", "用户手册")}</Link></li>
            <li><Link to="/#contact">{copy("Contact", "联系")}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{copy("Business", "商务")}</h2>
          <ul>
            <li><Link to="/#contact">{copy("Business Inquiries", "商务咨询")}</Link></li>
            <li><Link to="/#clx1">{copy("Product Information", "产品信息")}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{copy("Legal", "法律")}</h2>
          <ul>
            <li><Link to="/privacy">{pickBilingual(lang, config?.footer?.privacy, t("footer.privacy"))}</Link></li>
            <li><Link to="/cookie-policy">{pickBilingual(lang, config?.footer?.cookie, t("footer.cookie"))}</Link></li>
            <li><a href={`mailto:${email}`}>{email}</a></li>
          </ul>
        </div>
      </div>
      <div className="v2-wrap v2-footer-meta">
        <div>© COOLINKEY · {pickBilingual(lang, config?.footer?.icp, t("footer.icp"))}</div>
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
