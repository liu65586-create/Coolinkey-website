import type { MidModuleBlock, SiteConfig } from "../types/siteConfig";

function emptyMid(): MidModuleBlock {
  return { enabled: false, title: { en: "", zh: "" }, slides: [] };
}

/** Fills defaults for optional keys introduced after older `site.config.json` / localStorage snapshots. */
export function normalizeSiteConfig(cfg: SiteConfig): SiteConfig {
  return {
    ...cfg,
    midModules: {
      a: cfg.midModules?.a ?? emptyMid(),
      b: cfg.midModules?.b ?? emptyMid(),
      d: cfg.midModules?.d ?? emptyMid(),
    },
    manualsSection: {
      heading: cfg.manualsSection?.heading ?? { en: "", zh: "" },
      hiddenManualTypes: cfg.manualsSection?.hiddenManualTypes ?? [],
    },
  };
}
