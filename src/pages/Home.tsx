import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { FeatureCard } from "../components/FeatureCard";
import { IconChain, IconFingerprint, IconWater } from "../components/icons/FeatureIcons";
import { ManualsGrid } from "../components/ManualsGrid";
import { useCms } from "../context/CmsContext";
import { useShoppingRegion } from "../context/ShoppingRegionContext";
import { openPurchase } from "../utils/purchaseLinks";

export function Home() {
  const { t, i18n } = useTranslation();
  const { defaultProduct, loading } = useCms();
  const { useChinaStores } = useShoppingRegion();
  const heroImg = defaultProduct?.mainImage;

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <section
        className="relative isolate flex min-h-[max(80vh,600px)] items-center"
        aria-label="Hero"
      >
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-black to-[#111111]" />
        {heroImg ? (
          <div
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : null}

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <h1 className="max-w-4xl text-[36px] font-bold leading-tight sm:text-[64px]">{t("hero.title")}</h1>
          <p className="max-w-3xl text-base text-[#cccccc] sm:text-lg">{t("hero.subtitle")}</p>

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

      <section id="features" className="border-t border-[rgba(255,255,255,0.06)] bg-black py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 md:gap-6">
          <FeatureCard icon={<IconWater />} title={t("features.title_ip67")} description={t("features.desc_ip67")} />
          <FeatureCard icon={<IconFingerprint />} title={t("features.title_fp")} description={t("features.desc_fp")} />
          <FeatureCard icon={<IconChain />} title={t("features.title_steel")} description={t("features.desc_steel")} />
        </div>
      </section>

      {defaultProduct?.manuals?.length ? <ManualsGrid manuals={defaultProduct.manuals} /> : null}
    </div>
  );
}
