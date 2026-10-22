import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { VideoModal } from "../components/VideoModal";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { useTranslation } from "react-i18next";

const detailAngles = [
  {
    src: "/images/listing/detail-lock-body.jpg",
    en: "Lock body",
    zh: "锁体",
    bodyEn: "The fingerprint window and USB-C port sit on the body, with the mechanical keys beside it.",
    bodyZh: "指纹窗和 USB-C 接口在锁体上，机械钥匙放在旁边。",
  },
  {
    src: "/images/listing/detail-coiled-chain.jpg",
    en: "Coiled chain",
    zh: "盘起的链条",
    bodyEn: "The sleeved chain can sit in a coil, with the lock body and the open end in view.",
    bodyZh: "包覆链条可以盘起，锁体和开口端都看得到。",
  },
  {
    src: "/images/listing/detail-two-ends.jpg",
    en: "Two ends",
    zh: "两端",
    bodyEn: "One end is the locking pin. The other is the socket it closes into.",
    bodyZh: "一端是锁销，另一端是它扣入的锁孔。",
  },
  {
    src: "/images/listing/product-clx1-isolated.jpg",
    en: "Closed loop",
    zh: "闭合状态",
    bodyEn: "From above, the chain forms a loop with the lock body along one side.",
    bodyZh: "从上往下看，链条围成一圈，锁体位于一侧。",
  },
  {
    src: "/images/listing/mechanical-key-backup.jpg",
    en: "Mechanical key",
    zh: "机械钥匙",
    bodyEn: "The backup key lines up with the opening on the lock body.",
    bodyZh: "备用钥匙对准锁体上的钥匙孔。",
  },
  {
    src: "/images/listing/bike-locking-closeup.jpg",
    en: "Around a frame",
    zh: "绕在车架上",
    bodyEn: "The chain wraps a bicycle frame and a fixed post, with the lock body still visible.",
    bodyZh: "链条绕过自行车架和固定柱，锁体仍留在视线里。",
  },
];

const carryShots = [
  { src: "/images/listing/product-folds-bottle-size.jpg", en: "Easy to Carry", zh: "便于携带", bodyEn: "Folds down for everyday carrying.", bodyZh: "可折叠收纳，方便日常携带。" },
  { src: "/images/listing/bike-locking-closeup.jpg", en: "On Your Bike", zh: "骑行使用", bodyEn: "A chain lock for securing a bicycle.", bodyZh: "链条锁，可用于固定自行车。" },
  { src: "/images/listing/product-clx1-isolated.jpg", en: "Ready When You Are", zh: "随时可用", bodyEn: "Fingerprint, app, or mechanical key.", bodyZh: "指纹、App 或机械钥匙。" },
];

function useHomeCopy() {
  const { i18n } = useTranslation();
  const { config, loading } = useSiteConfig();
  const { defaultProduct } = useCms();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = (en: string, zh: string) => (lang === "zh" ? zh : en);
  return { config, loading, defaultProduct, lang, copy };
}

type BrandPrinciple = { en: string; zh: string; bodyEn: string; bodyZh: string };

type BrandSlide = {
  id: string;
  image: string;
  position: string;
  altEn: string;
  altZh: string;
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  eyebrowEn?: string;
  eyebrowZh?: string;
  principles?: BrandPrinciple[];
};

const brandSlides: BrandSlide[] = [
  {
    id: "product",
    image: "/images/listing/meet-clx1-hero.png",
    position: "center center",
    altEn: "CLX1 fingerprint smart chain lock",
    altZh: "CLX1 指纹智能链条锁",
    eyebrowEn: "CLX1 / FINGERPRINT SMART CHAIN LOCK",
    eyebrowZh: "CLX1 / 指纹智能链条锁",
    titleEn: "Unlock with\na touch.",
    titleZh: "轻触，\n即开。",
    bodyEn: "Fingerprint access, made for everyday security.",
    bodyZh: "指纹解锁，为日常安全而生。",
  },
  {
    id: "lifestyle",
    image: "/images/listing/ebike-locking-wide.jpg",
    position: "62% center",
    altEn: "CLX1 locked around a bicycle, part of the ride",
    altZh: "CLX1 锁在自行车上，成为骑行的一部分",
    eyebrowEn: "More Than a Lock",
    eyebrowZh: "不只是一把锁",
    titleEn: "Less Complexity. More Possibility.",
    titleZh: "更少复杂。更多可能。",
    bodyEn: "A thoughtful combination of form, function and everyday practicality. Fingerprint, a mechanical key and a 6 mm steel wire, carried through the day.",
    bodyZh: "形态、功能与日常实用的结合。指纹、机械钥匙与 6 mm 钢丝，陪你度过一天。",
    principles: [
      { en: "Simplicity", zh: "简洁", bodyEn: "Clear design. Intuitive experiences. Only what matters.", bodyZh: "清晰的设计，直觉的体验，只留下真正重要的部分。" },
      { en: "Freedom", zh: "自由", bodyEn: "Designed to fit naturally into the rhythms of everyday life.", bodyZh: "顺应日常生活的节奏。" },
      { en: "Thoughtful Design", zh: "细致设计", bodyEn: "Every detail should serve a purpose.", bodyZh: "每一处细节都有其用意。" },
    ],
  },
  {
    id: "manifesto",
    image: "/images/lifestyle/hero-cyclists.jpg",
    position: "72% center",
    altEn: "Two cyclists riding together along the coast",
    altZh: "两位骑行者沿海岸并肩骑行",
    titleEn: "Designed for a More Effortless Life.",
    titleZh: "为更从容的生活而设计。",
    bodyEn: "We believe the best technology feels natural — simplifying everyday moments through thoughtful design.",
    bodyZh: "我们相信，最好的科技是自然的——用细致的设计，让日常时刻更简单。",
  },
];

export function HomeHero() {
  const { loading, config, copy } = useHomeCopy();
  const { hash } = useLocation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = brandSlides.length;

  useEffect(() => {
    if (hash === "#approach") setIndex(0);
  }, [hash]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (loading || !config) return <div className="site-loading">COOLINKEY</div>;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section
      id="approach"
      className="brand-carousel"
      aria-roledescription="carousel"
      aria-label="COOLINKEY"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="brand-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {brandSlides.map((slide, slideIndex) => (
          <article
            key={slide.id}
            className={[
              "brand-slide",
              slide.id === "product" ? "brand-slide-product" : "",
              slide.principles ? "brand-lifestyle" : "",
            ].filter(Boolean).join(" ")}
            aria-hidden={slideIndex !== index}
          >
            <img src={slide.image} alt={copy(slide.altEn, slide.altZh)} style={{ objectPosition: slide.position }} />
            {slideIndex === 0 ? (
              <>
                <div className="brand-product-signature" aria-hidden="true">
                  <img src="/brand/coolinkey-logo.png" alt="" />
                  <span />
                </div>
                <div className="brand-product-copy">
                  <p className="brand-product-kicker">{copy(slide.eyebrowEn ?? "", slide.eyebrowZh ?? "")}</p>
                  <h1>{copy(slide.titleEn, slide.titleZh)}</h1>
                  <p className="brand-product-lead">{copy(slide.bodyEn, slide.bodyZh)}</p>
                  <div className="brand-product-actions">
                    <Link className="brand-product-btn brand-product-btn-primary" to="/#clx1">
                      <span>{copy("Explore CLX1", "探索 CLX1")}</span>
                      <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                    <Link className="brand-product-btn brand-product-btn-secondary" to="/#how-it-works">
                      {copy("How it works", "了解使用方式")}
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="brand-copy">
                {slide.eyebrowEn ? <p className="v2-eyebrow">{copy(slide.eyebrowEn, slide.eyebrowZh ?? "")}</p> : null}
                <h2 id={slide.id === "lifestyle" ? "lifestyle-title" : undefined}>{copy(slide.titleEn, slide.titleZh)}</h2>
                {slide.bodyEn ? <p className="v2-lead">{copy(slide.bodyEn, slide.bodyZh)}</p> : null}
                {slide.principles ? (
                  <ol className="brand-principles">
                    {slide.principles.map((item) => (
                      <li key={item.en}>
                        <strong>{copy(item.en, item.zh)}</strong>
                        <p>{copy(item.bodyEn, item.bodyZh)}</p>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {slide.principles ? (
                  <div className="v2-actions">
                    <Link className="v2-btn v2-btn-secondary" to="/#clx1">{copy("Explore CLX1", "探索 CLX1")}</Link>
                  </div>
                ) : null}
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="brand-controls">
        <button type="button" className="brand-nav" onClick={() => go(index - 1)} aria-label={copy("Previous", "上一张")}>
          <ChevronLeft size={20} />
        </button>
        <div className="brand-dots">
          {brandSlides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={copy(slide.titleEn, slide.titleZh)}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => go(slideIndex)}
            />
          ))}
        </div>
        <button type="button" className="brand-nav" onClick={() => go(index + 1)} aria-label={copy("Next", "下一张")}>
          <ChevronRight size={20} />
        </button>
      </div>
      <p className="sr-only">{copy(brandSlides[index].altEn, brandSlides[index].altZh)}</p>
    </section>
  );
}

export function ProductAngles() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;

  return (
    <div className="v2-home">
      <section className="v2-section" aria-labelledby="detail-angles-title">
        <div className="v2-wrap">
          <header className="v2-section-head">
            <h2 id="detail-angles-title">{copy("Every angle.", "每个角度。")}</h2>
            <p>{copy("Six views of the lock body, the sleeved chain, and the two ends.", "锁体、包覆链条和两端的六个视角。")}</p>
          </header>
          <div className="detail-angles">
            {detailAngles.map((shot) => (
              <figure key={shot.src}>
                <img src={shot.src} alt={copy(shot.en, shot.zh)} />
                <figcaption>
                  <strong>{copy(shot.en, shot.zh)}</strong>
                  <span>{copy(shot.bodyEn, shot.bodyZh)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LifeAndSpecs() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;

  return (
    <div className="v2-home">
      <section className="v2-section" aria-labelledby="carry-title">
        <div className="v2-wrap">
          <header className="v2-section-head">
            <h2 id="carry-title">{copy("Designed for Everyday Life.", "为日常生活而设计。")}</h2>
            <p>{copy("Lightweight, portable and easy to carry wherever your day takes you.", "轻便、可携带，陪你度过一天。")}</p>
          </header>
          <div className="v2-cards">
            {carryShots.map((shot) => (
              <figure key={shot.en}>
                <img src={shot.src} alt={copy(shot.en, shot.zh)} />
                <figcaption>
                  <strong>{copy(shot.en, shot.zh)}</strong>
                  <span>{copy(shot.bodyEn, shot.bodyZh)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function HowItWorks() {
  const { loading, config, defaultProduct, lang, copy } = useHomeCopy();
  const [videoOpen, setVideoOpen] = useState(false);
  if (loading || !config) return null;

  const videoManual = defaultProduct?.manuals?.find((manual) => manual.type === "video");
  const videoSrc = lang === "zh"
    ? (videoManual?.videoUrlZh || videoManual?.videoUrlEn || null)
    : (videoManual?.videoUrlEn || videoManual?.videoUrlZh || null);
  const steps = config.supportPage?.steps ?? [];

  return (
    <div className="v2-home">
      <section className="v2-section v2-section-muted" id="how-it-works" aria-labelledby="access-title">
        <div className="v2-wrap v2-split">
          <button
            type="button"
            className="v2-video"
            onClick={() => videoSrc && setVideoOpen(true)}
            disabled={!videoSrc}
            aria-label={copy("Play CLX1 demonstration", "播放 CLX1 演示")}
          >
            <img src="/images/listing/one-touch-unlock.jpg" alt={copy("CLX1 fingerprint unlock", "CLX1 指纹解锁")} />
            {videoSrc ? <span className="v2-play" aria-hidden="true" /> : null}
          </button>
          <div>
            <h2 id="access-title">{copy("Access, Made Personal.", "开锁，按你的方式。")}</h2>
            <p className="v2-lead">
              {copy(
                "Unlock with your fingerprint, the app, or a mechanical key.",
                "可用指纹、App 或机械钥匙开锁。",
              )}
            </p>
            {steps.length ? (
              <ol className="v2-steps">
                {steps.map((step, index) => (
                  <li key={step.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{pickBilingual(lang, step.title, "")}</strong>
                      {step.hint?.en || step.hint?.zh ? <p>{pickBilingual(lang, step.hint, "")}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      </section>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src={videoSrc} />
    </div>
  );
}
