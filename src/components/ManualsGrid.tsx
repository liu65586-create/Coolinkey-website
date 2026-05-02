import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { CmsManual } from "../types/cms";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { ManualCard } from "./ManualCard";
import { ManualModal } from "./ManualModal";

type Props = {
  manuals: CmsManual[];
  /** When false, only renders cards (use when the page already provides a section title). */
  showHeading?: boolean;
};

export function ManualsGrid({ manuals, showHeading = true }: Props) {
  const { i18n, t } = useTranslation();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const [active, setActive] = useState<CmsManual | null>(null);

  const heading = pickBilingual(lang, config?.manualsSection?.heading, t("manualsSection.heading"));

  const sorted = useMemo(() => {
    const order = ["installation", "user_manual", "faq", "video"] as const;
    return [...manuals].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  }, [manuals]);

  return (
    <section
      id="manuals"
      className={`mx-auto max-w-6xl px-4 sm:px-6 ${showHeading ? "py-16" : "py-0"}`}
    >
      {showHeading ? (
        <>
          <h2 className="text-center text-[32px] font-bold text-white">{heading}</h2>
          <div className="mx-auto mt-4 h-1 w-28 bg-[#00b51a]" />
        </>
      ) : null}

      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${showHeading ? "mt-10" : "mt-0"}`}>
        {sorted.map((m) => (
          <ManualCard key={m.id} manual={m} onOpen={setActive} />
        ))}
      </div>

      <ManualModal open={Boolean(active)} onClose={() => setActive(null)} manual={active} lang={lang} />
    </section>
  );
}
