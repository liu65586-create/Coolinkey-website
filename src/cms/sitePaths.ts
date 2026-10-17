export const SITE_PATHS = ["/", "/#clx1", "/#support", "/#about", "/contact", "/privacy", "/cookie-policy"] as const;

export type SitePath = (typeof SITE_PATHS)[number];

export function isSitePath(value: string): value is SitePath {
  return (SITE_PATHS as readonly string[]).includes(value);
}
