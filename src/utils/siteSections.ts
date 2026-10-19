export const SITE_SECTION_IDS = ["home", "clx1", "support", "about"] as const;

export type SiteSectionId = (typeof SITE_SECTION_IDS)[number];

export function sectionIdFromPath(target: string): SiteSectionId | null {
  const hash = target.includes("#") ? target.slice(target.indexOf("#") + 1).split("?")[0] : "";
  if (hash === "home" || hash === "clx1" || hash === "support" || hash === "about") return hash;
  const path = target.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/product" || path.startsWith("/product/")) return "clx1";
  if (path === "/support") return "support";
  if (path === "/about") return "about";
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
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - header);
  window.scrollTo({ top, behavior });
}
