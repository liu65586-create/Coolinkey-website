import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const setLang = (lng: "en" | "zh") => {
    void i18n.changeLanguage(lng);
    try {
      localStorage.setItem("coolinkey_lang", lng);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lng);
    window.history.replaceState({}, "", url.toString());
    window.dispatchEvent(new Event("coolinkey-lang-change"));
  };

  const isZh = i18n.language.startsWith("zh");

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-[var(--color-border)] bg-white p-0.5"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          !isZh ? "bg-accent text-[#142018]" : "text-text-muted hover:text-accent"
        }`}
        onClick={() => setLang("en")}
      >
        {t("lang.en")}
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          isZh ? "bg-accent text-[#142018]" : "text-text-muted hover:text-accent"
        }`}
        onClick={() => setLang("zh")}
      >
        {t("lang.zh")}
      </button>
    </div>
  );
}
