import { ArrowRight, ChevronRight, CirclePlay, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { ManualModal } from "../components/ManualModal";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import type { CmsManual } from "../types/cms";
import { getVisibleManuals } from "../utils/manualsVisibility";

export function Support() {
  const { t, i18n } = useTranslation();
  const { defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const [active, setActive] = useState<CmsManual | null>(null);

  const productImg = useResolvedMediaUrl(
    defaultProduct?.mainImage || "/images/defaults/mid-module-a-use-case.png"
  );

  const manuals = useMemo(
    () => getVisibleManuals(defaultProduct?.manuals ?? [], config?.manualsSection?.hiddenManualTypes),
    [defaultProduct, config]
  );
  const docs = manuals.filter((m) => m.type !== "video");
  const videos = manuals.filter((m) => m.type === "video");

  const steps = [
    { n: "1", title: t("supportPage.step1"), hint: t("supportPage.step1Hint") },
    { n: "2", title: t("supportPage.step2"), hint: t("supportPage.step2Hint") },
    { n: "3", title: t("supportPage.step3"), hint: t("supportPage.step3Hint") },
    { n: "4", title: t("supportPage.step4"), hint: t("supportPage.step4Hint") },
  ];

  const faqs = [
    { q: t("supportPage.faq1q"), a: t("supportPage.faq1a") },
    { q: t("supportPage.faq2q"), a: t("supportPage.faq2a") },
    { q: t("supportPage.faq3q"), a: t("supportPage.faq3a") },
  ];

  return (
    <div>
      <section className="page-wrap grid items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{t("supportPage.kicker")}</p>
          <h1 className="mt-3 font-display text-[36px] font-bold leading-tight tracking-tight text-text sm:text-[48px]">
            {t("supportPage.title")}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-muted">{t("supportPage.subtitle")}</p>
        </div>
        <div className="overflow-hidden rounded-[28px] bg-surface-muted p-6">
          <img src={productImg} alt="CLX1" className="mx-auto max-h-[280px] w-full object-contain" />
        </div>
      </section>

      <section className="page-wrap grid gap-5 pb-8 lg:grid-cols-3">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-lg font-semibold text-text">{t("supportPage.quickStart")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("supportPage.quickStartHint")}</p>
          <ol className="mt-6 space-y-1">
            {steps.map((s) => (
              <li key={s.n}>
                <div className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f8ea] text-xs font-bold text-accent">
                    {s.n}
                  </span>
                  <span className="flex-1 text-sm font-medium text-text">{s.title}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-lg font-semibold text-text">{t("supportPage.guides")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("supportPage.guidesHint")}</p>
          <ul className="mt-6 space-y-1">
            {docs.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left hover:bg-surface-muted"
                >
                  <FileText size={18} className="text-accent" />
                  <span className="flex-1 text-sm font-medium text-text">{lang === "zh" ? m.title.zh : m.title.en}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-lg font-semibold text-text">{t("supportPage.videos")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("supportPage.videosHint")}</p>
          <ul className="mt-6 space-y-3">
            {(videos.length ? videos : docs.slice(0, 3)).map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="flex w-full items-center gap-3 rounded-xl bg-surface-muted p-2 text-left hover:bg-[#e7f8ea]"
                >
                  <span className="flex h-14 w-20 items-center justify-center rounded-lg bg-[#dce8e1] text-accent">
                    <CirclePlay size={22} />
                  </span>
                  <span className="text-sm font-medium text-text">{lang === "zh" ? m.title.zh : m.title.en}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-wrap pb-8">
        <article className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-lg font-semibold text-text">{t("supportPage.troubleshooting")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("supportPage.troubleshootingHint")}</p>
          <div className="mt-4 divide-y divide-[var(--color-border)]">
            {faqs.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronRight size={16} className="shrink-0 text-text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </article>
      </section>

      <section className="page-wrap pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] bg-surface-muted px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <div>
            <h2 className="text-xl font-semibold text-text">{t("supportPage.helpTitle")}</h2>
            <p className="mt-1 text-sm text-text-muted">{t("supportPage.helpBody")}</p>
          </div>
          <Button variant="primary" href="mailto:support@coolinkey.com">
            {t("supportPage.contactCta")}
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <ManualModal open={Boolean(active)} onClose={() => setActive(null)} manual={active} lang={lang} />
    </div>
  );
}
