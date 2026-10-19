import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { About } from "./About";
import { Contact } from "./Contact";
import { BrandPhilosophy, BusinessPaths, DesignPrinciples, HomeHero, HowItWorks, LifeAndSpecs, MeetClx1, ProductStory } from "./Home";
import { Product } from "./Product";
import { Support } from "./Support";
import { scrollToSection, sectionIdFromPath } from "../utils/siteSections";

export function SitePage() {
  const { hash } = useLocation();
  const instant = useRef(true);

  useEffect(() => {
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
    <main className="home-page">
      <div id="home">
        <HomeHero />
      </div>
      <BrandPhilosophy />
      <DesignPrinciples />
      <section id="clx1" className="site-anchor" tabIndex={-1}>
        <MeetClx1 />
        <Product />
        <ProductStory />
      </section>
      <HowItWorks />
      <LifeAndSpecs />
      <section id="support" className="site-anchor" tabIndex={-1}>
        <Support />
      </section>
      <BusinessPaths />
      <section id="contact" className="site-anchor" tabIndex={-1} aria-labelledby="contact-title">
        <Contact />
      </section>
      <section id="about" className="site-anchor" tabIndex={-1}>
        <About />
      </section>
    </main>
  );
}
