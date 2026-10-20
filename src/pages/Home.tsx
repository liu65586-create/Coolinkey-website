import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { VideoModal } from "../components/VideoModal";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { useTranslation } from "react-i18next";

const designShots = [
  { src: "/images/listing/one-touch-unlock.jpg", en: "Fingerprint Unlock", zh: "指纹解锁" },
  { src: "/images/listing/mechanical-key-backup.jpg", en: "Mechanical Key", zh: "机械钥匙" },
  { src: "/images/listing/heavy-duty-chain.jpg", en: "6 mm Steel Wire", zh: "6 mm 钢丝" },
  { src: "/images/listing/product-folds-bottle-size.jpg", en: "Compact Form", zh: "便携形态" },
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

const brandSlides = [
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
  {
    id: "philosophy",
    image: "/images/listing/bike-locking-wide.jpg",
    position: "center",
    altEn: "CLX1 on a bicycle in daylight outside a house",
    altZh: "日光下，CLX1 锁在住宅外的自行车上",
    titleEn: "Technology Should Feel Natural.",
    titleZh: "科技应当自然而然。",
    bodyEn: "Good design should not make everyday life more complicated. It should remove friction, feel intuitive, and allow people to focus on what matters.",
    bodyZh: "好的设计不该让日常生活更复杂。它应当减少阻力、直觉易用，让人把注意力留给真正重要的事。",
  },
  {
    id: "principles",
    image: "/images/listing/ebike-locking-wide.jpg",
    position: "62% center",
    altEn: "CLX1 locked around an e-bike frame",
    altZh: "CLX1 锁在电动自行车车架上",
    titleEn: "Less Complexity. More Possibility.",
    titleZh: "更少复杂。更多可能。",
    bodyEn: "",
    bodyZh: "",
    principles: [
      { en: "Simplicity", zh: "简洁", bodyEn: "Clear design. Intuitive experiences. Only what matters.", bodyZh: "清晰的设计，直觉的体验，只留下真正重要的部分。" },
      { en: "Freedom", zh: "自由", bodyEn: "Designed to fit naturally into the rhythms of everyday life.", bodyZh: "顺应日常生活的节奏。" },
      { en: "Thoughtful Design", zh: "细致设计", bodyEn: "Every detail should serve a purpose.", bodyZh: "每一处细节都有其用意。" },
    ],
  },
] as const;

export function HomeHero() {
  const { loading, config, copy } = useHomeCopy();
  const { hash } = useLocation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = brandSlides.length;

  useEffect(() => {
    if (hash === "#approach") setIndex(1);
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
          <article key={slide.id} className="brand-slide" aria-hidden={slideIndex !== index}>
            <img src={slide.image} alt="" style={{ objectPosition: slide.position }} />
            <div className="brand-copy">
              {slideIndex === 0 ? <p className="v2-eyebrow">COOLINKEY</p> : null}
              {slideIndex === 0 ? (
                <h1>{copy(slide.titleEn, slide.titleZh)}</h1>
              ) : (
                <h2 id={slide.id === "philosophy" ? "philosophy-title" : "principles-title"}>{copy(slide.titleEn, slide.titleZh)}</h2>
              )}
              {slide.bodyEn ? <p className="v2-lead">{copy(slide.bodyEn, slide.bodyZh)}</p> : null}
              {"principles" in slide ? (
                <ol className="brand-principles">
                  {slide.principles.map((item) => (
                    <li key={item.en}>
                      <strong>{copy(item.en, item.zh)}</strong>
                      <p>{copy(item.bodyEn, item.bodyZh)}</p>
                    </li>
                  ))}
                </ol>
              ) : null}
              {slideIndex === 0 ? (
                <div className="v2-actions">
                  <button type="button" className="v2-btn v2-btn-primary" onClick={() => go(1)}>
                    {copy("Discover Our Approach", "了解我们的方式")}
                  </button>
                  <Link className="v2-btn v2-btn-secondary" to="/#clx1">{copy("Meet CLX1", "认识 CLX1")}</Link>
                </div>
              ) : null}
            </div>
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

export function MeetClx1() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;

  return (
    <div className="v2-home">
      <section className="v2-section v2-meet" aria-labelledby="meet-title">
        <img src="/images/listing/meet-clx1.jpg" alt={copy("CLX1 fingerprint smart chain lock", "CLX1 指纹智能链条锁")} />
        <div className="v2-wrap">
          <div className="v2-meet-copy">
            <h2 id="meet-title">{copy("Meet CLX1.", "认识 CLX1。")}</h2>
            <p className="v2-lead">
              {copy(
                "A fingerprint smart chain lock designed to bring a more intuitive access experience to everyday life.",
                "一款指纹智能链条锁，让日常开锁更直觉。",
              )}
            </p>
            <div className="v2-actions">
              <Link className="v2-btn v2-btn-primary" to="/#clx1">{copy("Explore CLX1", "探索 CLX1")}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductStory() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;

  return (
    <div className="v2-home">
      <section className="v2-section" aria-labelledby="design-title">
        <div className="v2-wrap">
          <div className="v2-design">
            <figure className="v2-design-main">
              <header className="v2-design-copy">
                <h2 id="design-title">{copy("More Than a Lock.", "不只是一把锁。")}</h2>
                <p>{copy("A thoughtful combination of form, function and everyday practicality.", "形态、功能与日常实用的结合。")}</p>
              </header>
              <div className="v2-design-stage">
                <img src="/images/listing/product-clx1-isolated.jpg" alt={copy("CLX1 product, full view", "CLX1 产品全貌")} />
              </div>
            </figure>
            <div className="v2-design-grid">
              {designShots.map((shot) => (
                <figure key={shot.src}>
                  <img src={shot.src} alt={copy(shot.en, shot.zh)} />
                  <figcaption>{copy(shot.en, shot.zh)}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function LifeAndSpecs() {
  const { loading, config, defaultProduct, lang, copy } = useHomeCopy();
  if (loading || !config) return null;
  const specs = defaultProduct?.specs ?? [];

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

      <section className="v2-section v2-section-muted" aria-labelledby="spec-title">
        <div className="v2-wrap v2-split v2-specs">
          <img src="/images/listing/product-clx1-isolated.jpg" alt={copy("CLX1 chain and lock body", "CLX1 链条与锁体")} />
          <div>
            <h2 id="spec-title">{copy("Details That Matter.", "关键细节。")}</h2>
            <p className="v2-lead">{copy("Confirmed CLX1 specifications.", "已确认的 CLX1 规格。")}</p>
            <dl>
              <div><dt>{copy("Product Model", "产品型号")}</dt><dd>CLX1</dd></div>
              {specs.map((row, index) => (
                <div key={index}>
                  <dt>{lang === "zh" ? row.key.zh : row.key.en}</dt>
                  <dd>{lang === "zh" ? row.value.zh : row.value.en}</dd>
                </div>
              ))}
            </dl>
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
            <img src="/images/listing/one-touch-unlock.jpg" alt="" />
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

export function BusinessPaths() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;
  return (
    <div className="v2-home">
      <section className="v2-section" id="business" aria-labelledby="paths-title">
        <div className="v2-wrap v2-paths">
          <p className="v2-eyebrow">{copy("For Business", "面向商务")}</p>
          <h2 id="paths-title">{copy("Let's Explore What's Possible.", "一起看看能合作什么。")}</h2>
          <p>
            {copy(
              "We welcome inquiries from distributors, retailers and businesses interested in working with COOLINKEY.",
              "欢迎分销商、零售商以及其他有意与 COOLINKEY 合作的企业来信咨询。",
            )}
          </p>
          <Link className="v2-btn v2-btn-primary" to="/business">
            {copy("Discuss Business Opportunities", "洽谈合作机会")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
