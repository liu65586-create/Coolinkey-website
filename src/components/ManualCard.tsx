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
      className="group w-full rounded-[12px] bg-[#111111] p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow hover:shadow-[0_0_0_1px_#00b51a,0_12px_40px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00b51a]"
    >
      <div className="text-[16px] font-semibold text-white">{title}</div>
      <div className="mt-4 flex justify-center text-[#00b51a]">{isVideo ? <IconVideo /> : <IconDoc />}</div>
      <div className="mt-4 text-sm font-semibold text-[#00b51a]">{t("manualsSection.preview")}</div>
    </button>
  );
}
