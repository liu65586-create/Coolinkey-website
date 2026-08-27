import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSiteConfig } from "../../context/SiteConfigContext";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { IconClose, IconMenu } from "../icons/Icon";

const navCls = ({ isActive }: { isActive: boolean }) =>
  [
    "text-[15px] font-medium tracking-wide transition-colors",
    isActive ? "text-accent" : "text-text-muted hover:text-accent",
  ].join(" ");

export function Navbar() {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  const [open, setOpen] = useState(false);

  const logoSrc = config?.brand.logoSrc;
  const logoAlt = config?.brand.logoAlt ?? "COOLINKEY";
  const logoH = config?.brand.logoMaxHeightPx ?? 30;

  return (
    <header className="sticky top-0 z-[100] h-[80px] border-b border-[var(--color-border)] bg-page/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
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
            <span className="font-display text-[22px] font-bold tracking-tight sm:text-[24px]">
              coolinkey
            </span>
          )}
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navCls} end>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/product" className={navCls}>
            {t("nav.product")}
          </NavLink>
          <NavLink to="/about" className={navCls}>
            {t("nav.about")}
          </NavLink>
          <NavLink to="/contact" className={navCls}>
            {t("nav.contact")}
          </NavLink>
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
        <div id="mobile-nav" className="border-b border-[var(--color-border)] bg-page md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            <NavLink to="/" end className={`${navCls({ isActive: false })} rounded-lg px-2 py-2`} onClick={() => setOpen(false)}>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/product" className={`${navCls({ isActive: false })} rounded-lg px-2 py-2`} onClick={() => setOpen(false)}>
              {t("nav.product")}
            </NavLink>
            <NavLink to="/about" className={`${navCls({ isActive: false })} rounded-lg px-2 py-2`} onClick={() => setOpen(false)}>
              {t("nav.about")}
            </NavLink>
            <NavLink to="/contact" className={`${navCls({ isActive: false })} rounded-lg px-2 py-2`} onClick={() => setOpen(false)}>
              {t("nav.contact")}
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
