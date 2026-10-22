import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { ProductDropdown } from "../components/ProductDropdown";
import { ProductGallery } from "../components/ProductGallery";
import { useCms } from "../context/CmsContext";
import { useShoppingRegion } from "../context/ShoppingRegionContext";
import type { Lang } from "../utils/siteCopy";
import { openPurchase } from "../utils/purchaseLinks";

export function Product() {
  const { i18n, t } = useTranslation();
  const [slug, setSlug] = useState<string | undefined>();
  const { products, loading, getBySlug, defaultProduct } = useCms();
  const { useChinaStores } = useShoppingRegion();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  const visibleProducts = useMemo(() => products.filter((product) => product.enabled !== false), [products]);

  const active = useMemo(() => {
    const found = slug ? getBySlug(slug) : defaultProduct;
    if (found && found.enabled === false) return defaultProduct;
    return found ?? defaultProduct;
  }, [slug, getBySlug, defaultProduct]);

  const name = active ? (lang === "zh" ? active.name.zh : active.name.en) : "";
  const desc = active ? (lang === "zh" ? active.shortDescription.zh : active.shortDescription.en) : "";
  const gallery = active
    ? [...new Set([active.mainImage, ...active.galleryImages].filter(Boolean))]
    : [];
  const pills = active?.slug === "smart-chain-lock"
    ? [lang === "zh" ? "指纹" : "Fingerprint", "App", lang === "zh" ? "机械钥匙" : "Mechanical key", "IP67", "USB-C"]
    : [];

  return (
    <div className="page-wrap py-8 sm:py-10">
      {!active ? (
        <>
          <div className="max-w-md">
            <ProductDropdown
              products={visibleProducts}
              valueSlug=""
              disabled={loading}
              onChangeSlug={setSlug}
            />
          </div>
          <p className="mt-16 text-text-muted">{loading ? "…" : "—"}</p>
        </>
      ) : (
        <>
          <div className="product-sheet">
            <div className="product-visual">
              <ProductGallery images={gallery} productName={name} focus={active.focus} />
            </div>

            <div className="product-copy">
              <ProductDropdown
                products={visibleProducts}
                valueSlug={active.slug}
                disabled={loading}
                onChangeSlug={setSlug}
              />
              <h2>{name}</h2>
              {pills.length ? (
                <ul className="product-pills">
                  {pills.map((pill) => (
                    <li key={pill}>{pill}</li>
                  ))}
                </ul>
              ) : null}
              <p className="product-lead">{desc}</p>
              <section aria-labelledby="spec-title">
                <h3 id="spec-title">{lang === "zh" ? "关键细节" : "Details That Matter"}</h3>
                <dl className="product-specs">
                  <div>
                    <dt>{lang === "zh" ? "产品型号" : "Product Model"}</dt>
                    <dd>CLX1</dd>
                  </div>
                  {active.specs.map((row, index) => (
                    <div key={index}>
                      <dt>{lang === "zh" ? row.key.zh : row.key.en}</dt>
                      <dd>{lang === "zh" ? row.value.zh : row.value.en}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <Button
                variant="primary"
                className="product-buy"
                onClick={() => openPurchase(active, { useChinaStores, i18nLang: i18n.language })}
              >
                {t("hero.buy")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
