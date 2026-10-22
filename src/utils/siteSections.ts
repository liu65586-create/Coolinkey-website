export const SITE_SECTION_IDS = ["home", "approach", "clx1", "how-it-works", "safety", "support", "help", "about", "contact"] as const;

export type SiteSectionId = (typeof SITE_SECTION_IDS)[number];

const HASH_IDS = new Set<string>(SITE_SECTION_IDS);

export function sectionIdFromPath(target: string): SiteSectionId | null {
  const hash = target.includes("#") ? target.slice(target.indexOf("#") + 1).split("?")[0] : "";
  if (hash && HASH_IDS.has(hash)) return hash as SiteSectionId;
  if (hash) return null;
  const path = target.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/product" || path.startsWith("/product/")) return "clx1";
  if (path === "/support") return "support";
  if (path === "/about") return "about";
  if (path === "/contact") return "contact";
  return null;
}

export function sectionHash(id: SiteSectionId): string {
  return id === "home" ? "" : `#${id}`;
}

export function scrollToSection(id: SiteSectionId, behavior: ScrollBehavior = "smooth") {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
  let clearance = header;
  if (id === "support") {
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop);
    if (Number.isFinite(margin)) clearance = margin;
  }
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - clearance);
  window.scrollTo({ top, behavior });
}
