import type { CmsManual, ManualType } from "../types/cms";

/** installation / user_manual are always shown when present in products.json. */
const ALWAYS_VISIBLE_TYPES: ManualType[] = ["installation", "user_manual"];

export function getVisibleManuals(manuals: CmsManual[], hiddenTypes: ManualType[] | undefined): CmsManual[] {
  if (!hiddenTypes?.length) return manuals;
  const hide = new Set(hiddenTypes.filter((t) => !ALWAYS_VISIBLE_TYPES.includes(t)));
  return manuals.filter((m) => ALWAYS_VISIBLE_TYPES.includes(m.type) || !hide.has(m.type));
}
