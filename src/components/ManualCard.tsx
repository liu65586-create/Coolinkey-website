import { useTranslation } from "react-i18next";
import type { CmsManual } from "../types/cms";
import { renderManualIcon } from "./icons/ManualIcons";

type Props = {
  manual: CmsManual;
  onOpen: (m: CmsManual) => void;
};

export function ManualCard({ manual, onOpen }: Props) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const title = lang === "zh" ? manual.title.zh : manual.title.en;

  return (
    <button
      type="button"
      onClick={() => onOpen(manual)}
      className="group flex w-full flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-8 text-center shadow-[0_8px_24px_rgba(11,27,43,0.04)] transition-colors hover:bg-accent/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {renderManualIcon(manual.type)}
      <div className="space-y-1">
        <div className="text-[15px] font-semibold text-text">{title}</div>
        <div className="text-xs font-medium text-accent">{t("manualsSection.preview")}</div>
      </div>
    </button>
  );
}
