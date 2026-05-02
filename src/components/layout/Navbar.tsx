import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { LanguageSwitcher } from "../LanguageSwitcher";

const navCls = ({ isActive }: { isActive: boolean }) =>
  [
    "text-[15px] font-semibold tracking-wide transition-colors",
    isActive ? "text-[#00b51a]" : "text-white hover:text-[#00b51a]",
  ].join(" ");

export function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] h-[80px] border-b border-[rgba(255,255,255,0.1)] bg-black">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="select-none font-['Sora','Inter',sans-serif] text-[22px] font-bold tracking-tight text-white hover:text-[#00b51a] sm:text-[24px]">
          coolinkey
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[rgba(255,255,255,0.15)] text-white hover:text-[#00b51a]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t("nav.closeMenu") : t("nav.openMenu")}</span>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-b border-[rgba(255,255,255,0.1)] bg-black md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            <NavLink to="/" end className={navCls} onClick={() => setOpen(false)}>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/product" className={navCls} onClick={() => setOpen(false)}>
              {t("nav.product")}
            </NavLink>
            <NavLink to="/about" className={navCls} onClick={() => setOpen(false)}>
              {t("nav.about")}
            </NavLink>
            <NavLink to="/contact" className={navCls} onClick={() => setOpen(false)}>
              {t("nav.contact")}
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
