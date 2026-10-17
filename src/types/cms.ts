export type ManualType = "installation" | "user_manual" | "faq" | "video";

export type LocalizedString = { en: string; zh: string };

export type CmsManual = {
  id: string;
  title: LocalizedString;
  type: ManualType;
  pdfFileEn: string | null;
  pdfFileZh: string | null;
  videoUrlEn?: string | null;
  videoUrlZh?: string | null;
};

export type CmsProduct = {
  /** Stable identity. Slug can change without breaking this id. */
  id?: string;
  slug: string;
  enabled?: boolean;
  /** CSS object-fit. Does not crop the file. */
  imageFit?: "contain" | "cover";
  /** CSS object-position, for example `50% 50%`. */
  focus?: string;
  name: LocalizedString;
  shortDescription: LocalizedString;
  mainImage: string;
  galleryImages: string[];
  specs: { key: LocalizedString; value: LocalizedString }[];
  purchaseLinkEn: string;
  purchaseLinkZh: string;
  manuals: CmsManual[];
};

export type CmsPayload = {
  products: CmsProduct[];
};
