import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { IconClose, IconMenu } from "../icons/Icon";

const navCls = ({ isActive }: { isActive: boolean }) =>
  [
    "relative text-[15px] font-medium tracking-wide transition-colors",
    isActive ? "text-text" : "text-text-muted hover:text-accent",
    isActive
      ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-accent"
      : "",
  ].join(" ");

export function Navbar() {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  const [open, setOpen] = useState(false);

  const logoSrc = config?.brand.logoSrc?.trim();
  const logoAlt = config?.brand.logoAlt ?? "COOLINKEY";
  const logoH = config?.brand.logoMaxHeightPx ?? 30;

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/product", label: t("nav.product"), end: false },
    { to: "/support", label: t("nav.support"), end: false },
    { to: "/about", label: t("nav.about"), end: false },
  ];

  return (
    <header className="sticky top-0 z-[100] h-[80px] border-b border-[var(--color-border)] bg-white">
      <div className="page-wrap flex h-full items-center justify-between">
        <NavLink
          to="/"
          className="flex select-none items-center text-text hover:opacity-90"
          aria-label={logoAlt}
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
              coolinkey
            </span>
          )}
        </NavLink>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navCls} end={item.end}>
              {item.label}
            </NavLink>
          ))}
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
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="rounded-lg px-2 py-2 text-[15px] font-medium text-text-muted hover:bg-black/[0.03] hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
