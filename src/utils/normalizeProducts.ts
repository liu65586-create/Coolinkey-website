import type { CmsManual, CmsProduct, ManualType } from "../types/cms";
import type { ImageFit } from "../types/siteConfig";

const MANUAL_TYPES: ManualType[] = ["installation", "user_manual", "faq", "video"];

function fit(value: string | undefined, fallback: ImageFit): ImageFit {
  return value === "cover" || value === "contain" ? value : fallback;
}

function focus(value: string | undefined): string {
  const allowed = new Set(["50% 50%", "50% 0%", "50% 100%", "0% 50%", "100% 50%"]);
  return value && allowed.has(value) ? value : "50% 50%";
}

function normalizeManual(manual: CmsManual, index: number, productId: string): CmsManual {
  const type = MANUAL_TYPES.includes(manual.type) ? manual.type : "user_manual";
  return {
    ...manual,
    id: manual.id?.trim() || `${productId}-manual-${index + 1}`,
    type,
    title: manual.title ?? { en: "", zh: "" },
    pdfFileEn: manual.pdfFileEn ?? null,
    pdfFileZh: manual.pdfFileZh ?? null,
    videoUrlEn: manual.videoUrlEn ?? "",
    videoUrlZh: manual.videoUrlZh ?? "",
  };
}

export function normalizeProducts(products: CmsProduct[]): CmsProduct[] {
  const used = new Set<string>();
  return products.map((product, index) => {
    let id = product.id?.trim() || product.slug?.trim() || `product-${index + 1}`;
    if (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);
    return {
      ...product,
      id,
      slug: product.slug?.trim() || id,
      enabled: product.enabled !== false,
      imageFit: fit(product.imageFit, "contain"),
      focus: focus(product.focus),
      name: product.name ?? { en: "", zh: "" },
      shortDescription: product.shortDescription ?? { en: "", zh: "" },
      mainImage: product.mainImage ?? "",
      galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages : [],
      specs: Array.isArray(product.specs) ? product.specs : [],
      purchaseLinkEn: product.purchaseLinkEn ?? "",
      purchaseLinkZh: product.purchaseLinkZh ?? "",
      manuals: (product.manuals ?? []).map((manual, manualIndex) => normalizeManual(manual, manualIndex, id)),
    };
  });
}
