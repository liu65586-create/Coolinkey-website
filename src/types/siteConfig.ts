import type { LocalizedString, ManualType } from "./cms";

/** Same shape as CMS `LocalizedString`; alias avoids cross-file assignability issues under `tsc --strict`. */
export type Bilingual = LocalizedString;

export type FeatureIconKey = "water" | "fingerprint" | "chain" | "dual" | "share" | "logs" | "battery";

export type MidSlideMediaKind = "image" | "video";

export type ImageFit = "contain" | "cover";

export type MidSlide = {
  id?: string;
  mediaUrl: string;
  mediaKind: MidSlideMediaKind;
  text: Bilingual;
  imageFit?: ImageFit;
  focus?: string;
};

export type HomeSectionId =
  | "hero"
  | "features"
  | "spotlight"
  | "scenarios"
  | "app"
  | "midA"
  | "midB"
  | "midD"
  | "manuals";

export type NavLinkItem = {
  id: string;
  label: Bilingual;
  to: string;
};

export type ScenarioItem = {
  id: string;
  image: string;
  label: Bilingual;
};

export type SupportStep = {
  id: string;
  title: Bilingual;
  hint: Bilingual;
};

export type SupportFaqItem = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
};

export type SeoFields = {
  title: Bilingual;
  description: Bilingual;
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
    displayName?: string;
    faviconSrc?: string;
  };
  nav?: {
    links: NavLinkItem[];
  };
  footer?: {
    tagline: Bilingual;
    privacy: Bilingual;
    cookie: Bilingual;
    icp: Bilingual;
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
    imageFit?: ImageFit;
    focus?: string;
    discoverLabel?: Bilingual;
    watchLabel?: Bilingual;
  };
  features: Array<{
    id?: string;
    icon: FeatureIconKey;
    title: Bilingual;
    description: Bilingual;
  }>;
  homeSections?: Array<{ id: HomeSectionId; enabled: boolean }>;
  spotlight?: {
    kicker: Bilingual;
    title: Bilingual;
    body: Bilingual;
    specChain: Bilingual;
    specChainLabel: Bilingual;
    specIp: Bilingual;
    specIpLabel: Bilingual;
    specLen: Bilingual;
    specLenLabel: Bilingual;
    learnMore: Bilingual;
    imageFit?: ImageFit;
    focus?: string;
  };
  scenarios?: {
    kicker: Bilingual;
    title: Bilingual;
    body: Bilingual;
    viewAll: Bilingual;
    imageFit?: ImageFit;
    focus?: string;
    items: ScenarioItem[];
  };
  appBanner?: {
    kicker: Bilingual;
    title: Bilingual;
    body: Bilingual;
    appStore: Bilingual;
    googlePlay: Bilingual;
    image: string;
    imageFit?: ImageFit;
    focus?: string;
  };
  supportPage?: {
    kicker: Bilingual;
    title: Bilingual;
    subtitle: Bilingual;
    quickStart: Bilingual;
    quickStartHint: Bilingual;
    guides: Bilingual;
    guidesHint: Bilingual;
    videos: Bilingual;
    videosHint: Bilingual;
    troubleshooting: Bilingual;
    troubleshootingHint: Bilingual;
    helpTitle: Bilingual;
    helpBody: Bilingual;
    contactCta: Bilingual;
    steps: SupportStep[];
    faqs: SupportFaqItem[];
  };
  seo?: {
    home: SeoFields;
    product: SeoFields;
    support: SeoFields;
    about: SeoFields;
    contact: SeoFields;
    privacy: SeoFields;
    cookie: SeoFields;
  };
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
    email?: string;
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
