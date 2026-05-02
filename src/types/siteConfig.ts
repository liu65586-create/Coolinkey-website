export type Bilingual = { en: string; zh: string };

export type FeatureIconKey = "water" | "fingerprint" | "chain";

export type SiteConfig = {
  version: number;
  brand: {
    logoSrc: string;
    logoAlt: string;
    logoMaxHeightPx: number;
  };
  modules: {
    homeHero: boolean;
    homeFeatures: boolean;
    homeManuals: boolean;
  };
  hero: {
    title: Bilingual;
    subtitle: Bilingual;
    /** Absolute path or full URL; empty = none unless overlayUsesProductImage */
    backgroundImageUrl: string;
    overlayUsesProductImage: boolean;
  };
  features: Array<{
    icon: FeatureIconKey;
    title: Bilingual;
    description: Bilingual;
  }>;
  manualsSection: {
    heading: Bilingual;
  };
  productPage: {
    manualsHeading: Bilingual;
  };
  about: {
    title: Bilingual;
    body: Bilingual;
  };
  contact: {
    title: Bilingual;
    body: Bilingual;
  };
  legal: {
    privacyTitle: Bilingual;
    privacyBody: Bilingual;
    cookieTitle: Bilingual;
    cookieBody: Bilingual;
  };
  cookieBanner: {
    message: Bilingual;
    accept: Bilingual;
    learnMore: Bilingual;
  };
};
