import CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGeoIpContext } from "../context/GeoIpContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function CookieConsentBanner() {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const { showCookieBanner, loading } = useGeoIpContext();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  if (loading || !showCookieBanner) return null;

  const accept = pickBilingual(lang, config?.cookieBanner?.accept, t("cookieBanner.accept"));
  const message = pickBilingual(lang, config?.cookieBanner?.message, t("cookieBanner.message"));
  const learnMore = pickBilingual(lang, config?.cookieBanner?.learnMore, t("cookieBanner.learnMore"));

  return (
    <CookieConsent
      location="bottom"
      buttonText={accept}
      cookieName="coolinkey_cookie_consent"
      expires={180}
      style={{
        background: "#ffffff",
        color: "#0f172a",
        borderTop: "1px solid #e2e8f0",
        alignItems: "center",
        boxShadow: "0 -4px 24px rgba(15, 23, 42, 0.06)",
      }}
      buttonStyle={{
        background: "#059669",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 700,
        padding: "10px 16px",
        borderRadius: "8px",
      }}
      buttonWrapperClasses="!ml-4"
    >
      <span>
        {message}{" "}
        <Link className="font-medium text-emerald-700 hover:underline" to="/cookie-policy">
          {learnMore}
        </Link>
      </span>
    </CookieConsent>
  );
}
