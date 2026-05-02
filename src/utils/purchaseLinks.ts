import type { CmsProduct } from "../types/cms";

export function buildPurchaseUrl(
  product: CmsProduct,
  opts: { useChinaStores: boolean; i18nLang: string }
): string {
  const base = opts.useChinaStores ? product.purchaseLinkZh : product.purchaseLinkEn;
  try {
    const u = new URL(base);
    u.searchParams.set("source", "coolinkey_website");
    u.searchParams.set("lang", opts.i18nLang);
    return u.toString();
  } catch {
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}source=coolinkey_website&lang=${encodeURIComponent(opts.i18nLang)}`;
  }
}

export function openPurchase(product: CmsProduct, opts: { useChinaStores: boolean; i18nLang: string }) {
  const url = buildPurchaseUrl(product, opts);
  window.open(url, "_blank", "noopener,noreferrer");
}
