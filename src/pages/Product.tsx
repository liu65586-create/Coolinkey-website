import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading, getBySlug, defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const { useChinaStores } = useShoppingRegion();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  const manualsHeading = pickBilingual(lang, config?.productPage?.manualsHeading, t("product.manuals"));

  const active = useMemo(() => {
    if (slug) return getBySlug(slug) ?? defaultProduct;
    return defaultProduct;
  }, [slug, getBySlug, defaultProduct]);

  useEffect(() => {
    if (loading) return;
    if (slug && !getBySlug(slug) && defaultProduct) {
      navigate(`/product/${defaultProduct.slug}`, { replace: true });
    }
  }, [loading, slug, getBySlug, defaultProduct, navigate]);

  const name = active ? (lang === "zh" ? active.name.zh : active.name.en) : "";
  const desc = active ? (lang === "zh" ? active.shortDescription.zh : active.shortDescription.en) : "";
  const gallery = active ? [active.mainImage, ...active.galleryImages].filter(Boolean) : [];
  const visibleManuals = active
    ? getVisibleManuals(active.manuals, config?.manualsSection?.hiddenManualTypes)
    : [];

  return (
    <div className="page-wrap py-12 sm:py-16">
      <div className="max-w-md">
        <ProductDropdown
          products={products}
          valueSlug={active?.slug ?? ""}
          disabled={loading}
          onChangeSlug={(next) => navigate(`/product/${next}`)}
        />
      </div>

      {!active ? (
        <p className="mt-16 text-text-muted">{loading ? "…" : "—"}</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="rounded-[28px] bg-surface-muted p-4 sm:p-6">
              <ProductGallery images={gallery} productName={name} />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold tracking-wide text-accent">CLX1</p>
                <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-[2.15rem]">{name}</h1>
                <p className="text-[15px] leading-relaxed text-text-muted">{desc}</p>
              </div>

              <Button
                variant="primary"
                onClick={() => openPurchase(active, { useChinaStores, i18nLang: i18n.language })}
              >
                {t("hero.buy")}
              </Button>

              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">{t("product.specs")}</h2>
                <dl className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                  {active.specs.map((row, i) => (
                    <div
                      key={i}
                      className={[
                        "grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-4 py-3.5 text-sm",
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
            <div className="mt-20 border-t border-[var(--color-border)] pt-16">
              <h2 className="mb-10 text-center font-display text-2xl font-semibold tracking-tight text-text sm:text-[28px]">
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
