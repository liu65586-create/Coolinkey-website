import { useTranslation } from "react-i18next";
import type { CmsManual } from "../types/cms";
import { IconDoc, IconVideo } from "./icons/ManualIcons";

type Props = {
  manual: CmsManual;
  onOpen: (m: CmsManual) => void;
};

export function ManualCard({ manual, onOpen }: Props) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = lang === "zh" ? manual.title.zh : manual.title.en;
  const isVideo = manual.type === "video";

  return (
    <button
      type="button"
      onClick={() => onOpen(manual)}
      className="group w-full rounded-[12px] border border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-200/50 transition-shadow hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="text-[16px] font-semibold text-slate-900">{title}</div>
      <div className="mt-4 flex justify-center text-emerald-600">{isVideo ? <IconVideo /> : <IconDoc />}</div>
      <div className="mt-4 text-sm font-semibold text-emerald-700">{t("manualsSection.preview")}</div>
    </button>
  );
}
