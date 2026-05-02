import type { ManualType } from "../types/cms";
import type { MidModuleBlock, SiteConfig } from "../types/siteConfig";

/** These manual cards always stay visible if present in CMS; not configurable via hiddenManualTypes. */
const NON_HIDABLE_MANUAL_TYPES: ManualType[] = ["installation", "user_manual"];

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
      hiddenManualTypes: (cfg.manualsSection?.hiddenManualTypes ?? []).filter(
        (t) => !NON_HIDABLE_MANUAL_TYPES.includes(t)
      ),
    },
  };
}
