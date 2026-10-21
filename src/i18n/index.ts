import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export const i18nReady = i18n.use(initReactI18next).init({
    lng: "en",
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "zh"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "coolinkey_lang",
      caches: ["localStorage"],
    },
  });

/** Match the prerendered English HTML first, then apply the visitor's language. */
export function applyPreferredLanguage() {
  if (typeof window === "undefined") return;
  const query = new URLSearchParams(window.location.search).get("lang");
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("coolinkey_lang");
  } catch {
    stored = null;
  }
  const pick = query || stored || window.navigator.language || "en";
  const lng = pick.toLowerCase().startsWith("zh") ? "zh" : "en";
  if (lng !== i18n.resolvedLanguage && lng !== i18n.language) {
    void i18n.changeLanguage(lng);
  }
}

export default i18n;
