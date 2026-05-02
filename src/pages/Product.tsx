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
  const gallery = active ? [active.mainImage, ...active.galleryImages] : [];
  const visibleManuals = active
    ? getVisibleManuals(active.manuals, config?.manualsSection?.hiddenManualTypes)
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-xl">
        <div className="mb-2 text-sm font-semibold text-[#cccccc]">{t("product.selectProduct")}</div>
        <ProductDropdown
          products={products}
          valueSlug={active?.slug ?? ""}
          disabled={loading}
          onChangeSlug={(next) => navigate(`/product/${next}`)}
        />
      </div>

      {!active ? (
        <p className="mt-10 text-[#cccccc]">{loading ? "…" : "—"}</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <ProductGallery images={gallery} productName={name} />

            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-[#cccccc]">{desc}</p>

              <div className="mt-8">
                <Button
                  variant="primary"
                  onClick={() => openPurchase(active, { useChinaStores, i18nLang: i18n.language })}
                >
                  {t("hero.buy")}
                </Button>
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-semibold">{t("product.specs")}</h2>
                <div className="mt-4 overflow-hidden rounded-lg border border-[rgba(255,255,255,0.18)]">
                  <table className="w-full border-collapse text-left text-sm text-white">
                    <tbody>
                      {active.specs.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 1 ? "bg-[rgba(255,255,255,0.04)]" : "bg-transparent"}
                        >
                          <th className="border-b border-[rgba(255,255,255,0.12)] px-4 py-3 font-semibold text-white">
                            {lang === "zh" ? row.key.zh : row.key.en}
                          </th>
                          <td className="border-b border-[rgba(255,255,255,0.12)] px-4 py-3 text-[#cccccc]">
                            {lang === "zh" ? row.value.zh : row.value.en}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {visibleManuals.length ? (
            <div className="mt-16 border-t border-[rgba(255,255,255,0.06)] pt-6">
              <h2 className="mb-2 text-center text-[32px] font-bold text-white">{manualsHeading}</h2>
              <div className="mx-auto mb-8 h-1 w-28 bg-[#00b51a]" />
              <ManualsGrid manuals={visibleManuals} showHeading={false} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
