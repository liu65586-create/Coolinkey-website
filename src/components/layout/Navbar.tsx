import { useEffect, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { IconClose, IconMenu } from "../icons/Icon";
import type { Lang } from "../../utils/siteCopy";
import { pickBilingual } from "../../utils/siteCopy";
import { useResolvedMediaUrl } from "../../hooks/useResolvedMediaUrl";
import { scrollToSection, sectionIdFromPath, SITE_SECTION_IDS, type SiteSectionId } from "../../utils/siteSections";

const navCls = (isActive: boolean) =>
  [
    "relative text-[15px] font-medium tracking-wide transition-colors",
    isActive ? "text-text" : "text-text-muted hover:text-accent",
    isActive
      ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-accent"
      : "",
  ].join(" ");

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { config } = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SiteSectionId | "">("home");
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";

  const logoSrc = useResolvedMediaUrl(config?.brand.logoSrc?.trim() || "");
  const logoAlt = config?.brand.logoAlt ?? "COOLINKEY";
  const logoH = config?.brand.logoMaxHeightPx ?? 30;
  const brandName = config?.brand.displayName?.trim() || "coolinkey";

  const links = (config?.nav?.links?.length
    ? config.nav.links
    : [
        { id: "home", to: "/", label: { en: t("nav.home"), zh: t("nav.home") } },
        { id: "product", to: "/product", label: { en: t("nav.product"), zh: t("nav.product") } },
        { id: "support", to: "/support", label: { en: t("nav.support"), zh: t("nav.support") } },
        { id: "about", to: "/about", label: { en: t("nav.about"), zh: t("nav.about") } },
      ]
  ).map((item) => ({
    id: item.id,
    to: item.to,
    label: pickBilingual(lang, item.label, t("nav.home")),
  }));

  useEffect(() => {
    const onSite = sectionIdFromPath(pathname) !== null;
    if (!onSite) {
      setActiveSection("");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.scrollY + 96;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let next: SiteSectionId = "home";
      if (atBottom) {
        for (let index = SITE_SECTION_IDS.length - 1; index >= 0; index -= 1) {
          const id = SITE_SECTION_IDS[index];
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 96) {
            next = id;
            break;
          }
        }
      } else {
        for (const id of SITE_SECTION_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= marker) next = id;
        }
      }
      setActiveSection(next);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    setOpen(false);
    const id = sectionIdFromPath(to);
    if (!id || sectionIdFromPath(pathname) !== id) return;
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-[100] h-[80px] border-b border-[var(--color-border)] bg-white">
      <div className="page-wrap flex h-full items-center justify-between">
        <Link
          to="/"
          className="flex select-none items-center text-text hover:opacity-90"
          aria-label={logoAlt}
          onClick={(event) => onNavigate(event, "/")}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              className="w-auto max-w-[200px] object-contain"
              style={{ maxHeight: logoH }}
              decoding="async"
            />
          ) : (
            <span className="font-display text-[22px] font-semibold tracking-tight sm:text-[24px]">
              {brandName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((item) => {
            const section = sectionIdFromPath(item.to);
            const isActive = section !== null && activeSection === section;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={navCls(isActive)}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => onNavigate(event, item.to)}
              >
                {item.label}
              </Link>
            );
          })}
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:bg-black/[0.04] hover:text-accent"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t("nav.closeMenu") : t("nav.openMenu")}</span>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-b border-[var(--color-border)] bg-white md:hidden">
          <div className="page-wrap flex flex-col gap-1 py-4">
            {links.map((item) => {
              const section = sectionIdFromPath(item.to);
              const isActive = section !== null && activeSection === section;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "rounded-lg px-2 py-2 text-[15px] font-medium",
                    isActive ? "text-text" : "text-text-muted hover:bg-black/[0.03] hover:text-accent",
                  ].join(" ")}
                  onClick={(event) => onNavigate(event, item.to)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
