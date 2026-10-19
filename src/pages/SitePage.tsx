import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { About } from "./About";
import { BrandPhilosophy, BusinessPaths, HomeHero, HowItWorks, ProductStory } from "./Home";
import { Product } from "./Product";
import { Support } from "./Support";
import { scrollToSection, sectionIdFromPath } from "../utils/siteSections";

export function SitePage() {
  const { hash } = useLocation();
  const instant = useRef(true);

  useEffect(() => {
    const id = sectionIdFromPath(hash || "/") ?? "home";
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
    <main className="home-page">
      <div id="home">
        <HomeHero />
      </div>
      <section id="clx1" className="site-anchor" tabIndex={-1}>
        <Product />
        <ProductStory />
      </section>
      <HowItWorks />
      <section id="support" className="site-anchor" tabIndex={-1}>
        <Support />
      </section>
      <BusinessPaths />
      <BrandPhilosophy />
      <section id="about" className="site-anchor" tabIndex={-1}>
        <About />
      </section>
    </main>
  );
}
