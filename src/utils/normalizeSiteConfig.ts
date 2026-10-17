import { copyDefaults } from "../cms/copyDefaults";
import type { Bilingual, HomeSectionId, ImageFit, MidModuleBlock, MidSlide, SiteConfig } from "../types/siteConfig";

function emptyMid(): MidModuleBlock {
  return { enabled: false, title: { en: "", zh: "" }, slides: [] };
}

function keepBi(field: Bilingual | undefined, fallback: Bilingual): Bilingual {
  return { en: field?.en ?? fallback.en, zh: field?.zh ?? fallback.zh };
}

function fit(value: string | undefined, fallback: ImageFit): ImageFit {
  return value === "cover" || value === "contain" ? value : fallback;
}

function focus(value: string | undefined): string {
  const allowed = new Set(["50% 50%", "50% 0%", "50% 100%", "0% 50%", "100% 50%"]);
  return value && allowed.has(value) ? value : "50% 50%";
}

const SECTION_IDS: HomeSectionId[] = [
  "hero",
  "features",
  "spotlight",
  "scenarios",
  "app",
  "midA",
  "midB",
  "midD",
  "manuals",
];

function defaultEnabled(id: HomeSectionId, cfg: SiteConfig): boolean {
  if (id === "hero") return cfg.modules?.homeHero !== false;
  if (id === "features") return cfg.modules?.homeFeatures !== false;
  if (id === "manuals") return cfg.modules?.homeManuals === true;
  if (id === "midA") return cfg.midModules?.a?.enabled === true;
  if (id === "midB") return cfg.midModules?.b?.enabled === true;
  if (id === "midD") return cfg.midModules?.d?.enabled === true;
  return true;
}

function normalizeSlide(slide: MidSlide, index: number, moduleKey: string): MidSlide {
  return {
    ...slide,
    id: slide.id?.trim() || `mid-${moduleKey}-${index + 1}`,
    imageFit: fit(slide.imageFit, "cover"),
    focus: focus(slide.focus),
    text: slide.text ?? { en: "", zh: "" },
  };
}

/** Fills defaults for optional keys. Empty strings stay empty so i18n can still fall back. */
export function normalizeSiteConfig(cfg: SiteConfig): SiteConfig {
  const midA = cfg.midModules?.a ?? emptyMid();
  const midB = cfg.midModules?.b ?? emptyMid();
  const midD = cfg.midModules?.d ?? emptyMid();
  const sections = SECTION_IDS.map((id) => {
    const found = cfg.homeSections?.find((item) => item.id === id);
    return { id, enabled: found ? found.enabled : defaultEnabled(id, cfg) };
  });
  const enabled = (id: HomeSectionId) => sections.find((item) => item.id === id)?.enabled === true;
  const emptySeo = { title: { en: "", zh: "" }, description: { en: "", zh: "" } };

  return {
    ...cfg,
    version: cfg.version || 1,
    brand: {
      logoSrc: cfg.brand?.logoSrc ?? "",
      logoAlt: cfg.brand?.logoAlt ?? "coolinkey",
      logoMaxHeightPx: cfg.brand?.logoMaxHeightPx || 30,
      displayName: cfg.brand?.displayName ?? "coolinkey",
      faviconSrc: cfg.brand?.faviconSrc ?? "",
    },
    nav: {
      links: (cfg.nav?.links?.length ? cfg.nav.links : copyDefaults.nav).map((link, index) => ({
        id: link.id?.trim() || `nav-${index + 1}`,
        label: keepBi(link.label, copyDefaults.nav[index]?.label ?? { en: "", zh: "" }),
        to: link.to || copyDefaults.nav[index]?.to || "/",
      })),
    },
    footer: {
      tagline: keepBi(cfg.footer?.tagline, copyDefaults.footer.tagline),
      privacy: keepBi(cfg.footer?.privacy, copyDefaults.footer.privacy),
      cookie: keepBi(cfg.footer?.cookie, copyDefaults.footer.cookie),
      icp: keepBi(cfg.footer?.icp, copyDefaults.footer.icp),
    },
    modules: {
      homeHero: enabled("hero"),
      homeFeatures: enabled("features"),
      homeManuals: enabled("manuals"),
    },
    homeSections: sections,
    hero: {
      title: cfg.hero?.title ?? { en: "", zh: "" },
      subtitle: cfg.hero?.subtitle ?? { en: "", zh: "" },
      backgroundImageUrl: cfg.hero?.backgroundImageUrl ?? "",
      overlayUsesProductImage: cfg.hero?.overlayUsesProductImage === true,
      imageFit: fit(cfg.hero?.imageFit, "cover"),
      focus: focus(cfg.hero?.focus),
      discoverLabel: keepBi(cfg.hero?.discoverLabel, copyDefaults.heroButtons.discover),
      watchLabel: keepBi(cfg.hero?.watchLabel, copyDefaults.heroButtons.watch),
    },
    features: (cfg.features ?? []).map((feature, index) => ({
      ...feature,
      id: feature.id?.trim() || `feature-${feature.icon}-${index + 1}`,
    })),
    spotlight: {
      kicker: keepBi(cfg.spotlight?.kicker, copyDefaults.spotlight.kicker),
      title: keepBi(cfg.spotlight?.title, copyDefaults.spotlight.title),
      body: keepBi(cfg.spotlight?.body, copyDefaults.spotlight.body),
      specChain: keepBi(cfg.spotlight?.specChain, copyDefaults.spotlight.specChain),
      specChainLabel: keepBi(cfg.spotlight?.specChainLabel, copyDefaults.spotlight.specChainLabel),
      specIp: keepBi(cfg.spotlight?.specIp, copyDefaults.spotlight.specIp),
      specIpLabel: keepBi(cfg.spotlight?.specIpLabel, copyDefaults.spotlight.specIpLabel),
      specLen: keepBi(cfg.spotlight?.specLen, copyDefaults.spotlight.specLen),
      specLenLabel: keepBi(cfg.spotlight?.specLenLabel, copyDefaults.spotlight.specLenLabel),
      learnMore: keepBi(cfg.spotlight?.learnMore, copyDefaults.spotlight.learnMore),
      imageFit: fit(cfg.spotlight?.imageFit, "contain"),
      focus: focus(cfg.spotlight?.focus),
    },
    scenarios: {
      kicker: keepBi(cfg.scenarios?.kicker, copyDefaults.scenarios.kicker),
      title: keepBi(cfg.scenarios?.title, copyDefaults.scenarios.title),
      body: keepBi(cfg.scenarios?.body, copyDefaults.scenarios.body),
      viewAll: keepBi(cfg.scenarios?.viewAll, copyDefaults.scenarios.viewAll),
      imageFit: fit(cfg.scenarios?.imageFit, "cover"),
      focus: focus(cfg.scenarios?.focus),
      items: (cfg.scenarios?.items?.length ? cfg.scenarios.items : copyDefaults.scenarios.items).map((item, index) => ({
        id: item.id?.trim() || `scenario-${index + 1}`,
        image: item.image || "",
        label: keepBi(item.label, copyDefaults.scenarios.items[index]?.label ?? { en: "", zh: "" }),
      })),
    },
    appBanner: {
      kicker: keepBi(cfg.appBanner?.kicker, copyDefaults.appBanner.kicker),
      title: keepBi(cfg.appBanner?.title, copyDefaults.appBanner.title),
      body: keepBi(cfg.appBanner?.body, copyDefaults.appBanner.body),
      appStore: keepBi(cfg.appBanner?.appStore, copyDefaults.appBanner.appStore),
      googlePlay: keepBi(cfg.appBanner?.googlePlay, copyDefaults.appBanner.googlePlay),
      image: cfg.appBanner?.image || copyDefaults.appBanner.image,
      imageFit: fit(cfg.appBanner?.imageFit, "cover"),
      focus: focus(cfg.appBanner?.focus),
    },
    supportPage: {
      kicker: keepBi(cfg.supportPage?.kicker, copyDefaults.support.kicker),
      title: keepBi(cfg.supportPage?.title, copyDefaults.support.title),
      subtitle: keepBi(cfg.supportPage?.subtitle, copyDefaults.support.subtitle),
      quickStart: keepBi(cfg.supportPage?.quickStart, copyDefaults.support.quickStart),
      quickStartHint: keepBi(cfg.supportPage?.quickStartHint, copyDefaults.support.quickStartHint),
      guides: keepBi(cfg.supportPage?.guides, copyDefaults.support.guides),
      guidesHint: keepBi(cfg.supportPage?.guidesHint, copyDefaults.support.guidesHint),
      videos: keepBi(cfg.supportPage?.videos, copyDefaults.support.videos),
      videosHint: keepBi(cfg.supportPage?.videosHint, copyDefaults.support.videosHint),
      troubleshooting: keepBi(cfg.supportPage?.troubleshooting, copyDefaults.support.troubleshooting),
      troubleshootingHint: keepBi(cfg.supportPage?.troubleshootingHint, copyDefaults.support.troubleshootingHint),
      helpTitle: keepBi(cfg.supportPage?.helpTitle, copyDefaults.support.helpTitle),
      helpBody: keepBi(cfg.supportPage?.helpBody, copyDefaults.support.helpBody),
      contactCta: keepBi(cfg.supportPage?.contactCta, copyDefaults.support.contactCta),
      steps: (cfg.supportPage?.steps?.length ? cfg.supportPage.steps : copyDefaults.support.steps).map((step, index) => ({
        id: step.id?.trim() || `support-step-${index + 1}`,
        title: keepBi(step.title, { en: "", zh: "" }),
        hint: keepBi(step.hint, { en: "", zh: "" }),
      })),
      faqs: (cfg.supportPage?.faqs?.length ? cfg.supportPage.faqs : copyDefaults.support.faqs).map((faq, index) => ({
        id: faq.id?.trim() || `support-faq-${index + 1}`,
        question: keepBi(faq.question, { en: "", zh: "" }),
        answer: keepBi(faq.answer, { en: "", zh: "" }),
      })),
    },
    seo: {
      home: cfg.seo?.home ?? emptySeo,
      product: cfg.seo?.product ?? emptySeo,
      support: cfg.seo?.support ?? emptySeo,
      about: cfg.seo?.about ?? emptySeo,
      contact: cfg.seo?.contact ?? emptySeo,
      privacy: cfg.seo?.privacy ?? emptySeo,
      cookie: cfg.seo?.cookie ?? emptySeo,
    },
    midModules: {
      a: { ...midA, enabled: enabled("midA"), slides: (midA.slides ?? []).map((slide, index) => normalizeSlide(slide, index, "a")) },
      b: { ...midB, enabled: enabled("midB"), slides: (midB.slides ?? []).map((slide, index) => normalizeSlide(slide, index, "b")) },
      d: { ...midD, enabled: enabled("midD"), slides: (midD.slides ?? []).map((slide, index) => normalizeSlide(slide, index, "d")) },
    },
    manualsSection: {
      heading: cfg.manualsSection?.heading ?? { en: "", zh: "" },
      hiddenManualTypes: cfg.manualsSection?.hiddenManualTypes ?? [],
    },
    contact: {
      title: cfg.contact?.title ?? { en: "", zh: "" },
      body: cfg.contact?.body ?? { en: "", zh: "" },
      email: cfg.contact?.email?.trim() || "support@coolinkey.com",
    },
  };
}
