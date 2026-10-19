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
import { pickBilingual, type Lang } from "../utils/siteCopy";

export function Support() {
  const { t, i18n } = useTranslation();
  const { defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const page = config?.supportPage;
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";
  const text = (field: Parameters<typeof pickBilingual>[1], key: string) => pickBilingual(lang, field, t(key));
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

  const steps = (page?.steps?.length ? page.steps : []).map((step, index) => ({
    n: String(index + 1),
    title: pickBilingual(lang, step.title, ""),
    hint: pickBilingual(lang, step.hint, ""),
    id: step.id,
  }));

  const faqs = (page?.faqs?.length ? page.faqs : []).map((item) => ({
    id: item.id,
    q: pickBilingual(lang, item.question, ""),
    a: pickBilingual(lang, item.answer, ""),
  }));

  return (
    <div className="support-stack w-full">
      <section className="support-hero page-wrap grid items-center gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-text-muted">{text(page?.kicker, "supportPage.kicker")}</p>
          <h2 className="mt-2 font-display text-[30px] font-semibold leading-tight tracking-tight text-text sm:text-[36px]">
            {text(page?.title, "supportPage.title")}
          </h2>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-text-muted">{text(page?.subtitle, "supportPage.subtitle")}</p>
        </div>
        <div className="overflow-hidden rounded-[24px] bg-surface-muted p-4">
          <img src={productImg} alt="CLX1" className="mx-auto max-h-[180px] w-full object-contain" />
        </div>
      </section>

      <section className="support-panels page-wrap grid gap-4 pb-4 lg:grid-cols-3">
        <article className="rounded-[20px] border border-[var(--color-border)] bg-white p-5 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-[17px] font-semibold text-text">{text(page?.quickStart, "supportPage.quickStart")}</h2>
          <p className="mt-1 text-[15px] text-text-muted">{text(page?.quickStartHint, "supportPage.quickStartHint")}</p>
          <ol className="mt-4 space-y-0.5">
            {steps.map((s) => (
            <li key={s.id}>
                <div className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f8ea] text-xs font-bold text-accent">
                    {s.n}
                  </span>
                  <span className="flex-1 text-[15px] font-medium text-text">{s.title}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-[20px] border border-[var(--color-border)] bg-white p-5 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-[17px] font-semibold text-text">{text(page?.guides, "supportPage.guides")}</h2>
          <p className="mt-1 text-[15px] text-text-muted">{text(page?.guidesHint, "supportPage.guidesHint")}</p>
          <ul className="mt-4 space-y-0.5">
            {docs.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left hover:bg-surface-muted"
                >
                  <FileText size={18} className="text-accent" />
                  <span className="flex-1 text-[15px] font-medium text-text">{lang === "zh" ? m.title.zh : m.title.en}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[20px] border border-[var(--color-border)] bg-white p-5 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-[17px] font-semibold text-text">{text(page?.videos, "supportPage.videos")}</h2>
          <p className="mt-1 text-[15px] text-text-muted">{text(page?.videosHint, "supportPage.videosHint")}</p>
          <ul className="mt-4 space-y-2">
            {(videos.length ? videos : docs.slice(0, 3)).map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActive(m)}
                  className="flex w-full items-center gap-3 rounded-xl bg-surface-muted p-2 text-left hover:bg-[#e7f8ea]"
                >
                  <span className="flex h-11 w-16 items-center justify-center rounded-lg bg-[#dce8e1] text-accent">
                    <CirclePlay size={22} />
                  </span>
                  <span className="text-[15px] font-medium text-text">{lang === "zh" ? m.title.zh : m.title.en}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="support-faq page-wrap pb-4">
        <article className="rounded-[20px] border border-[var(--color-border)] bg-white p-5 shadow-[0_8px_30px_rgba(11,27,43,0.04)]">
          <h2 className="text-[17px] font-semibold text-text">{text(page?.troubleshooting, "supportPage.troubleshooting")}</h2>
          <p className="mt-1 text-[15px] text-text-muted">{text(page?.troubleshootingHint, "supportPage.troubleshootingHint")}</p>
          <div className="mt-2 divide-y divide-[var(--color-border)]">
            {faqs.map((item) => (
              <details key={item.id} className="group py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-text [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronRight size={16} className="shrink-0 text-text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </article>
      </section>

      <section className="support-cta page-wrap pb-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[20px] bg-surface-muted px-5 py-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-[17px] font-semibold text-text">{text(page?.helpTitle, "supportPage.helpTitle")}</h2>
            <p className="mt-1 text-[15px] text-text-muted">{text(page?.helpBody, "supportPage.helpBody")}</p>
          </div>
          <Button variant="primary" href={`mailto:${email}`} className="!border-transparent !bg-black !text-white hover:!bg-[#222]">
            {text(page?.contactCta, "supportPage.contactCta")}
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <ManualModal open={Boolean(active)} onClose={() => setActive(null)} manual={active} lang={lang} />
    </div>
  );
}
