import { Fingerprint, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PhoneMock() {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto h-[420px] w-[210px] rounded-[2.2rem] border-[10px] border-[#1a1f27] bg-[#0f141b] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex h-full flex-col items-center px-5 pb-6 pt-10 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Lock size={28} strokeWidth={1.75} />
        </div>
        <p className="mt-4 text-sm font-semibold">{t("appBanner.locked")}</p>
        <p className="mt-1 text-[11px] text-white/55">coolinkey · CLX1</p>
        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-white"
        >
          <Fingerprint size={16} />
          {t("appBanner.unlock")}
        </button>
        <div className="mt-6 w-full space-y-2">
          {["Fingerprint", "Shared key", "History"].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px] text-white/75"
            >
              <span>{row}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
