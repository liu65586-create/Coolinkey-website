import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

if (typeof window !== "undefined") i18n.use(LanguageDetector);

void i18n.use(initReactI18next).init({
    ...(typeof window === "undefined" ? { lng: "en" } : {}),
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

export default i18n;
