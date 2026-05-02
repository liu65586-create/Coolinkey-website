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
  slug: string;
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
