import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { ManualsGrid } from "../components/ManualsGrid";
import { ProductDropdown } from "../components/ProductDropdown";
import { ProductGallery } from "../components/ProductGallery";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useShoppingRegion } from "../context/ShoppingRegionContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { openPurchase } from "../utils/purchaseLinks";

export function Product() {
  const { i18n, t } = useTranslation();
  const [slug, setSlug] = useState<string | undefined>();
  const { products, loading, getBySlug, defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const { useChinaStores } = useShoppingRegion();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  const manualsHeading = pickBilingual(lang, config?.productPage?.manualsHeading, t("product.manuals"));

  const visibleProducts = useMemo(() => products.filter((product) => product.enabled !== false), [products]);

  const active = useMemo(() => {
    const found = slug ? getBySlug(slug) : defaultProduct;
    if (found && found.enabled === false) return defaultProduct;
    return found ?? defaultProduct;
  }, [slug, getBySlug, defaultProduct]);

  const name = active ? (lang === "zh" ? active.name.zh : active.name.en) : "";
  const desc = active ? (lang === "zh" ? active.shortDescription.zh : active.shortDescription.en) : "";
  const gallery = active ? [active.mainImage, ...active.galleryImages].filter(Boolean) : [];
  const visibleManuals = active
    ? getVisibleManuals(active.manuals, config?.manualsSection?.hiddenManualTypes)
    : [];

  return (
    <div className="page-wrap py-8 sm:py-10">
      <div className="max-w-md">
        <ProductDropdown
          products={visibleProducts}
          valueSlug={active?.slug ?? ""}
          disabled={loading}
          onChangeSlug={setSlug}
        />
      </div>

      {!active ? (
        <p className="mt-16 text-text-muted">{loading ? "…" : "—"}</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="rounded-[28px] bg-surface-muted p-4 sm:p-6">
              <ProductGallery images={gallery} productName={name} fit={active.imageFit} focus={active.focus} />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-text-muted">CLX1</p>
                <h2 className="font-display text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-none tracking-tight text-text">{name}</h2>
                <p className="text-[16px] leading-relaxed text-text-muted">{desc}</p>
              </div>

              <Button
                variant="primary"
                onClick={() => openPurchase(active, { useChinaStores, i18nLang: i18n.language })}
              >
                {t("hero.buy")}
              </Button>

              <div>
                <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-text-muted">{t("product.specs")}</h2>
                <dl className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                  {active.specs.map((row, i) => (
                    <div
                      key={i}
                      className={[
                        "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-4 py-2.5 text-[15px]",
                        i % 2 === 0 ? "bg-white" : "bg-surface-muted",
                      ].join(" ")}
                    >
                      <dt className="font-medium text-text">{lang === "zh" ? row.key.zh : row.key.en}</dt>
                      <dd className="text-text-muted">{lang === "zh" ? row.value.zh : row.value.en}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {visibleManuals.length ? (
            <div className="product-manuals mt-8">
              <h2 className="mb-5 text-center font-display text-[22px] font-semibold tracking-tight text-text sm:text-[24px]">
                {manualsHeading}
              </h2>
              <ManualsGrid manuals={visibleManuals} showHeading={false} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
