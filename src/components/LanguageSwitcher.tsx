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

  return (
    <div
      className="flex items-center gap-1 rounded-[8px] border border-[rgba(255,255,255,0.2)] p-1"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors ${
          i18n.language.startsWith("zh")
            ? "text-white/50 hover:text-[#00b51a]"
            : "bg-[#111111] text-[#00b51a]"
        }`}
        onClick={() => setLang("en")}
      >
        {t("lang.en")}
      </button>
      <button
        type="button"
        className={`rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors ${
          i18n.language.startsWith("zh")
            ? "bg-[#111111] text-[#00b51a]"
            : "text-white/50 hover:text-[#00b51a]"
        }`}
        onClick={() => setLang("zh")}
      >
        {t("lang.zh")}
      </button>
    </div>
  );
}
