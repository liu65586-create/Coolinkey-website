import CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGeoIpContext } from "../context/GeoIpContext";

export function CookieConsentBanner() {
  const { t } = useTranslation();
  const { showCookieBanner, loading } = useGeoIpContext();

  if (loading || !showCookieBanner) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("cookieBanner.accept")}
      cookieName="coolinkey_cookie_consent"
      expires={180}
      style={{
        background: "#111111",
        color: "#ffffff",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        alignItems: "center",
      }}
      buttonStyle={{
        background: "#00b51a",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 700,
        padding: "10px 16px",
        borderRadius: "8px",
      }}
      buttonWrapperClasses="!ml-4"
    >
      <span>
        {t("cookieBanner.message")}{" "}
        <Link className="text-[#00b51a] hover:underline" to="/cookie-policy">
          {t("cookieBanner.learnMore")}
        </Link>
      </span>
    </CookieConsent>
  );
}
