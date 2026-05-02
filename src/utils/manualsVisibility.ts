import type { CmsManual, ManualType } from "../types/cms";

export function getVisibleManuals(manuals: CmsManual[], hiddenTypes: ManualType[] | undefined): CmsManual[] {
  if (!hiddenTypes?.length) return manuals;
  const hide = new Set(hiddenTypes);
  return manuals.filter((m) => !hide.has(m.type));
}
