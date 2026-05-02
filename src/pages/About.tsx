import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold">{t("about.title")}</h1>
      <p className="mt-6 text-[15px] leading-relaxed text-[#cccccc]">{t("about.body")}</p>
    </div>
  );
}
