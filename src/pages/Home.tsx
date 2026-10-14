import { ArrowRight, CirclePlay } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { MidSplitCarousel } from "../components/MidSplitCarousel";
import { PhoneMock } from "../components/PhoneMock";
import { VideoModal } from "../components/VideoModal";
import { renderFeatureIcon } from "../components/icons/FeatureIcons";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import type { FeatureIconKey, MidSlide } from "../types/siteConfig";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

const FEATURE_DEFAULTS: Array<{ titleKey: string; descKey: string; key: FeatureIconKey }> = [
  { titleKey: "features.title_fp", descKey: "features.desc_fp", key: "fingerprint" },
  { titleKey: "features.title_dual", descKey: "features.desc_dual", key: "dual" },
  { titleKey: "features.title_share", descKey: "features.desc_share", key: "share" },
  { titleKey: "features.title_logs", descKey: "features.desc_logs", key: "logs" },
  { titleKey: "features.title_battery", descKey: "features.desc_battery", key: "battery" },
  { titleKey: "features.title_ip67", descKey: "features.desc_ip67", key: "water" },
];

const SCENARIOS = [
  { img: "/images/lifestyle/scenario-bicycle.jpg", labelKey: "scenarios.bicycle" },
  { img: "/images/lifestyle/scenario-ebike.jpg", labelKey: "scenarios.ebike" },
  { img: "/images/lifestyle/scenario-glass.jpg", labelKey: "scenarios.glass" },
  { img: "/images/lifestyle/scenario-gate.jpg", labelKey: "scenarios.gate" },
] as const;

export function Home() {
  const { t, i18n } = useTranslation();
  const { config, loading: siteLoading } = useSiteConfig();
  const { defaultProduct } = useCms();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);

  const modules = config?.modules;
  const heroImgFromProduct = defaultProduct?.mainImage;
  const heroBgUrl =
    (config?.hero.backgroundImageUrl?.trim() ? config.hero.backgroundImageUrl.trim() : "") ||
    "/images/lifestyle/hero-cyclists.jpg";
  const heroBgResolved = useResolvedMediaUrl(heroBgUrl);
  const productImg = useResolvedMediaUrl(
    defaultProduct?.mainImage || "/images/defaults/mid-module-a-use-case.png"
  );

  const heroTitle = pickBilingual(lang, config?.hero.title, t("hero.title"));
  const heroSubtitle = pickBilingual(lang, config?.hero.subtitle, t("hero.subtitle"));

  const features = config?.features ?? [];
  const videoManual = defaultProduct?.manuals?.find((m) => m.type === "video");
  const videoSrc =
    lang === "zh"
      ? (videoManual?.videoUrlZh ?? videoManual?.videoUrlEn ?? null)
      : (videoManual?.videoUrlEn ?? videoManual?.videoUrlZh ?? null);

  const midSlides = (slides: MidSlide[]) => slides.filter((s) => Boolean(s.mediaUrl?.trim()));

  if (siteLoading || !config) return <div className="px-4 py-20 text-text-muted">…</div>;

  return (
    <div>
      {modules?.homeHero !== false ? (
        <section className="page-wrap grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16" aria-label="Hero">
          <div>
            <h1 className="max-w-xl whitespace-pre-line font-display text-[36px] font-bold leading-[1.08] tracking-tight text-text sm:text-[52px]">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-muted sm:text-base">{heroSubtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button variant="primary" onClick={() => document.getElementById("product-spotlight")?.scrollIntoView({ behavior: "smooth" })}>
                {t("hero.discover")}
                <ArrowRight size={16} />
              </Button>
              {videoSrc ? (
                <Button variant="secondary" onClick={() => setVideoOpen(true)}>
                  <CirclePlay size={18} />
                  {t("hero.watch")}
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate("/support")}>
                  <CirclePlay size={18} />
                  {t("hero.watch")}
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] bg-surface-muted shadow-[0_20px_50px_rgba(11,27,43,0.12)]">
            {heroBgResolved ? (
              <img
                src={heroBgResolved}
                alt=""
                className="aspect-[5/4] w-full object-cover lg:aspect-[4/3] lg:min-h-[420px]"
              />
            ) : heroImgFromProduct ? (
              <img src={heroImgFromProduct} alt="" className="aspect-[5/4] w-full object-cover" />
            ) : null}
          </div>
        </section>
      ) : null}

      {modules?.homeFeatures !== false ? (
        <section id="features" className="page-wrap grid grid-cols-2 gap-y-8 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:py-10">
          {FEATURE_DEFAULTS.map((fd, i) => {
            const row = features[i];
            const iconKey = row?.icon ?? fd.key;
            const title = pickBilingual(lang, row?.title, t(fd.titleKey));
            const desc = pickBilingual(lang, row?.description, t(fd.descKey));
            return <FeatureCard key={i} icon={renderFeatureIcon(iconKey)} title={title} description={desc} />;
          })}
        </section>
      ) : null}

      <section id="product-spotlight" className="page-wrap py-6 sm:py-10">
        <div className="grid items-center gap-8 rounded-[28px] bg-surface-muted px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-8">
            <img src={productImg} alt={t("spotlight.title")} className="mx-auto max-h-[360px] w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent">{t("spotlight.kicker")}</p>
            <h2 className="mt-2 font-display text-[28px] font-bold tracking-tight text-text sm:text-[34px]">
              {t("spotlight.title")}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-muted">{t("spotlight.body")}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-6">
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{t("spotlight.specChain")}</div>
                <div className="mt-1 text-xs text-text-muted">{t("spotlight.specChainLabel")}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{t("spotlight.specIp")}</div>
                <div className="mt-1 text-xs text-text-muted">{t("spotlight.specIpLabel")}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{t("spotlight.specLen")}</div>
                <div className="mt-1 text-xs text-text-muted">{t("spotlight.specLenLabel")}</div>
              </div>
            </div>
            <Link
              to="/product"
              className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-accent hover:text-accent-hover"
            >
              {t("spotlight.learnMore")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-wrap section-pad">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{t("scenarios.kicker")}</p>
            <h2 className="mt-2 font-display text-[28px] font-bold tracking-tight text-text sm:text-[34px]">
              {t("scenarios.title")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{t("scenarios.body")}</p>
          </div>
          <Link to="/product" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover">
            {t("scenarios.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {SCENARIOS.map((item) => (
            <figure key={item.labelKey} className="group">
              <div className="overflow-hidden rounded-2xl bg-surface-muted">
                <img
                  src={item.img}
                  alt={t(item.labelKey)}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 text-sm font-medium text-text">{t(item.labelKey)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="page-wrap pb-16">
        <div className="relative overflow-hidden rounded-[28px]">
          <img
            src="/images/lifestyle/app-landscape.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            <div className="max-w-lg text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{t("appBanner.kicker")}</p>
              <h2 className="mt-3 font-display text-[30px] font-bold leading-tight sm:text-[36px]">{t("appBanner.title")}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">{t("appBanner.body")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-semibold">
                  {t("appBanner.appStore")}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-semibold">
                  {t("appBanner.googlePlay")}
                </span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>

      {config.midModules.a.enabled && midSlides(config.midModules.a.slides).length ? (
        <section className="section-pad border-t border-[var(--color-border)] bg-surface-muted">
          <MidSplitCarousel
            variant="imageLeft"
            title={config.midModules.a.title}
            slides={midSlides(config.midModules.a.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      {config.midModules.b.enabled && midSlides(config.midModules.b.slides).length ? (
        <section className="section-pad border-t border-[var(--color-border)]">
          <MidSplitCarousel
            variant="textLeft"
            title={config.midModules.b.title}
            slides={midSlides(config.midModules.b.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      {config.midModules.d.enabled && midSlides(config.midModules.d.slides).length ? (
        <section className="section-pad border-t border-[var(--color-border)] bg-surface-muted">
          <MidSplitCarousel
            variant="imageLeft"
            title={config.midModules.d.title}
            slides={midSlides(config.midModules.d.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src={videoSrc} />
    </div>
  );
}
