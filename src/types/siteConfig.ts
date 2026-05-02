import type { LocalizedString, ManualType } from "./cms";

/** Same shape as CMS `LocalizedString`; alias avoids cross-file assignability issues under `tsc --strict`. */
export type Bilingual = LocalizedString;

export type FeatureIconKey = "water" | "fingerprint" | "chain";

export type MidSlideMediaKind = "image" | "video";

export type MidSlide = {
  mediaUrl: string;
  mediaKind: MidSlideMediaKind;
  text: Bilingual;
};

export type MidModuleBlock = {
  enabled: boolean;
  /** Section title (optional). Slide body uses each slide's `text`. */
  title: Bilingual;
  slides: MidSlide[];
};

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
  midModules: {
    a: MidModuleBlock;
    b: MidModuleBlock;
    d: MidModuleBlock;
  };
  manualsSection: {
    heading: Bilingual;
    /** Hide manual cards of these types (e.g. hide installation guide). */
    hiddenManualTypes: ManualType[];
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
