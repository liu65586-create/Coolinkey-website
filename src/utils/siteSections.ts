export const SITE_SECTION_IDS = ["home", "clx1", "support", "about"] as const;

export type SiteSectionId = (typeof SITE_SECTION_IDS)[number];

export function sectionIdFromPath(pathname: string): SiteSectionId | null {
  const path = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/product" || path.startsWith("/product/")) return "clx1";
  if (path === "/support") return "support";
  if (path === "/about") return "about";
  return null;
}

export function scrollToSection(id: SiteSectionId, behavior: ScrollBehavior = "smooth") {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior, block: "start" });
}
