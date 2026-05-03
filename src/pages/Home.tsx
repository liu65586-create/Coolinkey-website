import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { renderFeatureIcon } from "../components/icons/FeatureIcons";
import { ManualsGrid } from "../components/ManualsGrid";
import { MidSplitCarousel } from "../components/MidSplitCarousel";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useShoppingRegion } from "../context/ShoppingRegionContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { openPurchase } from "../utils/purchaseLinks";

export function Home() {
  const { t, i18n } = useTranslation();
  const { config, loading: siteLoading } = useSiteConfig();
  const { defaultProduct, loading } = useCms();
  const { useChinaStores } = useShoppingRegion();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  const modules = config?.modules;
  const heroImgFromProduct = defaultProduct?.mainImage;
  const heroBgUrl =
    (config?.hero.backgroundImageUrl?.trim() ? config.hero.backgroundImageUrl.trim() : "") ||
    (config?.hero.overlayUsesProductImage !== false && heroImgFromProduct ? heroImgFromProduct : "");

  const heroTitle = pickBilingual(lang, config?.hero.title, t("hero.title"));
  const heroSubtitle = pickBilingual(lang, config?.hero.subtitle, t("hero.subtitle"));

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = config?.features ?? [];
  const featureDefaults = [
    { title: t("features.title_ip67"), desc: t("features.desc_ip67"), key: "water" as const },
    { title: t("features.title_fp"), desc: t("features.desc_fp"), key: "fingerprint" as const },
    { title: t("features.title_steel"), desc: t("features.desc_steel"), key: "chain" as const },
  ];

  if (siteLoading || !config) return <div className="px-4 py-20 text-[#cccccc]">…</div>;

  const hiddenManualTypes = config.manualsSection.hiddenManualTypes;
  const visibleManuals = defaultProduct?.manuals?.length
    ? getVisibleManuals(defaultProduct.manuals, hiddenManualTypes)
    : [];

  const midSlides = (slides: (typeof config.midModules.a.slides)[number][]) =>
    slides.filter((s) => Boolean(s.mediaUrl?.trim()));

  return (
    <div>
      {modules?.homeHero !== false ? (
        <section
          className="relative isolate flex min-h-[max(80vh,600px)] items-center"
          aria-label="Hero"
        >
          <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0a0a0b] to-[#141418]" />
          {heroBgUrl ? (
            <div
              className="absolute inset-0 -z-10 opacity-20"
              style={{
                backgroundImage: `url(${heroBgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : null}

          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
            <h1 className="max-w-4xl text-[36px] font-bold leading-tight sm:text-[64px]">{heroTitle}</h1>
            <p className="max-w-3xl text-base text-[#cccccc] sm:text-lg">{heroSubtitle}</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-[20px]">
              <Button
                variant="primary"
                disabled={loading || !defaultProduct}
                onClick={() => {
                  if (!defaultProduct) return;
                  openPurchase(defaultProduct, { useChinaStores, i18nLang: i18n.language });
                }}
              >
                {t("hero.buy")}
              </Button>
              <Button variant="secondary" onClick={scrollToFeatures}>
                {t("hero.learnMore")}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {modules?.homeFeatures !== false ? (
        <section id="features" className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0b] py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 md:gap-6">
            {featureDefaults.map((fd, i) => {
              const row = features[i];
              const iconKey = row?.icon ?? fd.key;
              const title = pickBilingual(lang, row?.title, fd.title);
              const desc = pickBilingual(lang, row?.description, fd.desc);
              return (
                <FeatureCard
                  key={i}
                  icon={renderFeatureIcon(iconKey)}
                  title={title}
                  description={desc}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {config.midModules.a.enabled && midSlides(config.midModules.a.slides).length ? (
        <section className="border-t border-[rgba(255,255,255,0.06)] py-16">
          <MidSplitCarousel
            variant="imageLeft"
            title={config.midModules.a.title}
            slides={midSlides(config.midModules.a.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      {config.midModules.b.enabled && midSlides(config.midModules.b.slides).length ? (
        <section className="border-t border-[rgba(255,255,255,0.06)] py-16">
          <MidSplitCarousel
            variant="textLeft"
            title={config.midModules.b.title}
            slides={midSlides(config.midModules.b.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      {config.midModules.d.enabled && midSlides(config.midModules.d.slides).length ? (
        <section className="border-t border-[rgba(255,255,255,0.06)] py-16">
          <MidSplitCarousel
            variant="imageLeft"
            title={config.midModules.d.title}
            slides={midSlides(config.midModules.d.slides)}
            lang={lang}
          />
        </section>
      ) : null}

      {modules?.homeManuals !== false && visibleManuals.length ? (
        <ManualsGrid manuals={visibleManuals} />
      ) : null}
    </div>
  );
}
