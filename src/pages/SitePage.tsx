import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Durability } from "./Durability";
import { HomeHero, HowItWorks, LifeAndSpecs, ProductAngles } from "./Home";
import { Product } from "./Product";
import { Support } from "./Support";
import { SupportDesk } from "./SupportDesk";
import { scrollToSection, sectionIdFromPath } from "../utils/siteSections";

export function SitePage() {
  const { hash } = useLocation();
  const instant = useRef(true);

  useEffect(() => {
    if (hash === "#support-message") {
      const behavior: ScrollBehavior = instant.current ? "auto" : "smooth";
      instant.current = false;
      document.getElementById("support-message")?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    const id = sectionIdFromPath(hash || "/");
    if (!id) return;
    const behavior: ScrollBehavior = instant.current ? "auto" : "smooth";
    instant.current = false;
    scrollToSection(id, behavior);
    if (behavior !== "auto" || id === "home") return;

    const home = document.getElementById("home");
    let followLayout = true;
    const observer = new ResizeObserver(() => {
      if (followLayout) scrollToSection(id, "auto");
    });
    if (home) observer.observe(home);
    const timer = window.setTimeout(() => {
      followLayout = false;
      observer.disconnect();
    }, 1500);
    return () => {
      followLayout = false;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [hash]);

  return (
    <div className="home-page">
      <div id="home">
        <HomeHero />
      </div>
      <section id="clx1" className="site-anchor" tabIndex={-1}>
        <Product />
      </section>
      <HowItWorks />
      <ProductAngles />
      <LifeAndSpecs />
      <Durability />
      <section id="support" className="site-anchor" tabIndex={-1}>
        <Support />
      </section>
      <SupportDesk />
    </div>
  );
}
