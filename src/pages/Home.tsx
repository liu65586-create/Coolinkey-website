import { ArrowRight, CirclePlay } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { ManualsGrid } from "../components/ManualsGrid";
import { MediaPlayer } from "../components/MediaPlayer";
import { MidSplitCarousel } from "../components/MidSplitCarousel";
import { PhoneMock } from "../components/PhoneMock";
import { ResolvedImage } from "../components/ResolvedImage";
import { VideoModal } from "../components/VideoModal";
import { renderFeatureIcon } from "../components/icons/FeatureIcons";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import type { HomeSectionId, MidSlide } from "../types/siteConfig";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { classifyLink } from "../utils/linkKind";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

export function Home() {
  const { t, i18n } = useTranslation();
  const { config, loading: siteLoading } = useSiteConfig();
  const { defaultProduct } = useCms();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);

  const heroBgUrl = config?.hero.backgroundImageUrl?.trim() || "/images/lifestyle/hero-cyclists.jpg";
  const heroBgResolved = useResolvedMediaUrl(heroBgUrl);
  const productImg = useResolvedMediaUrl(defaultProduct?.mainImage || "/images/defaults/mid-module-a-use-case.png");
  const appImage = useResolvedMediaUrl(config?.appBanner?.image || "/images/lifestyle/app-landscape.jpg");

  if (siteLoading || !config) return <div className="px-4 py-20 text-text-muted">…</div>;

  const heroTitle = pickBilingual(lang, config.hero.title, t("hero.title"));
  const heroSubtitle = pickBilingual(lang, config.hero.subtitle, t("hero.subtitle"));
  const features = config.features ?? [];
  const videoManual = defaultProduct?.manuals?.find((manual) => manual.type === "video");
  const videoSrc =
    lang === "zh"
      ? (videoManual?.videoUrlZh ?? videoManual?.videoUrlEn ?? null)
      : (videoManual?.videoUrlEn ?? videoManual?.videoUrlZh ?? null);
  const midSlides = (slides: MidSlide[]) => slides.filter((slide) => Boolean(slide.mediaUrl?.trim()));
  const manuals = getVisibleManuals(defaultProduct?.manuals ?? [], config.manualsSection?.hiddenManualTypes);
  const heroIsVideo = classifyLink(heroBgUrl).kind === "direct-video" || /\.(mp4|webm)(\?|$)/i.test(heroBgUrl);

  const sections: Record<HomeSectionId, ReactNode> = {
    hero: (
      <section className="page-wrap grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16" aria-label="Hero">
        <div>
          <h1 className="max-w-xl whitespace-pre-line font-display text-[36px] font-bold leading-[1.08] tracking-tight text-text sm:text-[52px]">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-muted sm:text-base">{heroSubtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="primary" onClick={() => document.getElementById("product-spotlight")?.scrollIntoView({ behavior: "smooth" })}>
              {pickBilingual(lang, config.hero.discoverLabel, t("hero.discover"))}
              <ArrowRight size={16} />
            </Button>
            {videoSrc ? (
              <Button variant="secondary" onClick={() => setVideoOpen(true)}>
                <CirclePlay size={18} />
                {pickBilingual(lang, config.hero.watchLabel, t("hero.watch"))}
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate("/support")}>
                <CirclePlay size={18} />
                {pickBilingual(lang, config.hero.watchLabel, t("hero.watch"))}
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] bg-surface-muted shadow-[0_20px_50px_rgba(11,27,43,0.12)]">
          {heroIsVideo ? (
            <MediaPlayer url={heroBgUrl} className="aspect-[5/4] w-full lg:aspect-[4/3] lg:min-h-[420px]" />
          ) : heroBgResolved ? (
            <img
              src={heroBgResolved}
              alt=""
              className={`aspect-[5/4] w-full lg:aspect-[4/3] lg:min-h-[420px] ${config.hero.imageFit === "contain" ? "object-contain" : "object-cover"}`}
              style={{ objectPosition: config.hero.focus || "50% 50%" }}
            />
          ) : null}
        </div>
      </section>
    ),
    features: (
      <section id="features" className="page-wrap grid grid-cols-2 gap-y-8 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:py-10">
        {features.map((row) => (
          <FeatureCard
            key={row.id || row.icon}
            icon={renderFeatureIcon(row.icon)}
            title={pickBilingual(lang, row.title, row.title.en)}
            description={pickBilingual(lang, row.description, row.description.en)}
          />
        ))}
      </section>
    ),
    spotlight: (
      <section id="product-spotlight" className="page-wrap py-6 sm:py-10">
        <div className="grid items-center gap-8 rounded-[28px] bg-surface-muted px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-8">
            <img
              src={productImg}
              alt={pickBilingual(lang, config.spotlight?.title, t("spotlight.title"))}
              className={`mx-auto max-h-[360px] w-full ${config.spotlight?.imageFit === "cover" ? "object-cover" : "object-contain"}`}
              style={{ objectPosition: config.spotlight?.focus || "50% 50%" }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent">{pickBilingual(lang, config.spotlight?.kicker, t("spotlight.kicker"))}</p>
            <h2 className="mt-2 font-display text-[28px] font-bold tracking-tight text-text sm:text-[34px]">
              {pickBilingual(lang, config.spotlight?.title, t("spotlight.title"))}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-muted">
              {pickBilingual(lang, config.spotlight?.body, t("spotlight.body"))}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-6">
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{pickBilingual(lang, config.spotlight?.specChain, t("spotlight.specChain"))}</div>
                <div className="mt-1 text-xs text-text-muted">{pickBilingual(lang, config.spotlight?.specChainLabel, t("spotlight.specChainLabel"))}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{pickBilingual(lang, config.spotlight?.specIp, t("spotlight.specIp"))}</div>
                <div className="mt-1 text-xs text-text-muted">{pickBilingual(lang, config.spotlight?.specIpLabel, t("spotlight.specIpLabel"))}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent sm:text-2xl">{pickBilingual(lang, config.spotlight?.specLen, t("spotlight.specLen"))}</div>
                <div className="mt-1 text-xs text-text-muted">{pickBilingual(lang, config.spotlight?.specLenLabel, t("spotlight.specLenLabel"))}</div>
              </div>
            </div>
            <Link to="/product" className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-accent hover:text-accent-hover">
              {pickBilingual(lang, config.spotlight?.learnMore, t("spotlight.learnMore"))}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    ),
    scenarios: (
      <section className="page-wrap section-pad">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              {pickBilingual(lang, config.scenarios?.kicker, t("scenarios.kicker"))}
            </p>
            <h2 className="mt-2 font-display text-[28px] font-bold tracking-tight text-text sm:text-[34px]">
              {pickBilingual(lang, config.scenarios?.title, t("scenarios.title"))}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{pickBilingual(lang, config.scenarios?.body, t("scenarios.body"))}</p>
          </div>
          <Link to="/product" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover">
            {pickBilingual(lang, config.scenarios?.viewAll, t("scenarios.viewAll"))}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {(config.scenarios?.items ?? []).map((item) => (
            <figure key={item.id} className="group">
              <div className="overflow-hidden rounded-2xl bg-surface-muted">
                <ResolvedImage
                  src={item.image}
                  alt={pickBilingual(lang, item.label, "")}
                  fit={config.scenarios?.imageFit}
                  focus={config.scenarios?.focus}
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 text-sm font-medium text-text">{pickBilingual(lang, item.label, "")}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    ),
    app: (
      <section className="page-wrap pb-16">
        <div className="relative overflow-hidden rounded-[28px]">
          <img
            src={appImage}
            alt=""
            className={`absolute inset-0 h-full w-full ${config.appBanner?.imageFit === "contain" ? "object-contain" : "object-cover"}`}
            style={{ objectPosition: config.appBanner?.focus || "50% 50%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            <div className="max-w-lg text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                {pickBilingual(lang, config.appBanner?.kicker, t("appBanner.kicker"))}
              </p>
              <h2 className="mt-3 font-display text-[30px] font-bold leading-tight sm:text-[36px]">
                {pickBilingual(lang, config.appBanner?.title, t("appBanner.title"))}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">{pickBilingual(lang, config.appBanner?.body, t("appBanner.body"))}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-semibold">
                  {pickBilingual(lang, config.appBanner?.appStore, t("appBanner.appStore"))}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-semibold">
                  {pickBilingual(lang, config.appBanner?.googlePlay, t("appBanner.googlePlay"))}
                </span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>
    ),
    midA:
      midSlides(config.midModules.a.slides).length > 0 ? (
        <section className="section-pad border-t border-[var(--color-border)] bg-surface-muted">
          <MidSplitCarousel variant="imageLeft" title={config.midModules.a.title} slides={midSlides(config.midModules.a.slides)} lang={lang} />
        </section>
      ) : null,
    midB:
      midSlides(config.midModules.b.slides).length > 0 ? (
        <section className="section-pad border-t border-[var(--color-border)]">
          <MidSplitCarousel variant="textLeft" title={config.midModules.b.title} slides={midSlides(config.midModules.b.slides)} lang={lang} />
        </section>
      ) : null,
    midD:
      midSlides(config.midModules.d.slides).length > 0 ? (
        <section className="section-pad border-t border-[var(--color-border)] bg-surface-muted">
          <MidSplitCarousel variant="imageLeft" title={config.midModules.d.title} slides={midSlides(config.midModules.d.slides)} lang={lang} />
        </section>
      ) : null,
    manuals: manuals.length ? <ManualsGrid manuals={manuals} /> : null,
  };

  const order = config.homeSections ?? [];

  return (
    <div>
      {order.map((section) => (section.enabled ? <div key={section.id}>{sections[section.id]}</div> : null))}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src={videoSrc} />
    </div>
  );
}
