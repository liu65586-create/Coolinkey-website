/** Deep-merge plain objects; arrays and primitives from `patch` replace `base`. */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (patch === null || patch === undefined) return base;
  if (Array.isArray(patch)) return patch as T;
  if (typeof patch !== "object" || typeof base !== "object" || base === null) {
    return patch as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    const cur = (base as Record<string, unknown>)[k];
    out[k] = deepMerge(cur, v);
  }
  return out as T;
}
