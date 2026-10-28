import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { VideoModal } from "../components/VideoModal";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";
import { useTranslation } from "react-i18next";

type AngleCard = {
  src: string;
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  altEn: string;
  altZh: string;
  lead?: boolean;
  position?: string;
  fit?: "contain";
};

type AngleGroup = {
  titleEn: string;
  titleZh: string;
  leadEn: string;
  leadZh: string;
  cards: AngleCard[];
};

const angleGroups: AngleGroup[] = [
  {
    titleEn: "Thoughtful Design",
    titleZh: "细致设计",
    leadEn: "Considered details for everyday use.",
    leadZh: "为日常使用想过的细节。",
    cards: [
      {
        src: "/images/listing/angle-compact.jpg",
        titleEn: "Compact to Carry. Easy to Take Along.",
        titleZh: "小巧便携，轻松带走。",
        bodyEn: "The flexible, sleeved chain coils neatly alongside the lock body for easier storage and transport.",
        bodyZh: "柔软、带护套的链条整齐地盘在锁体旁，收纳和携带都更方便。",
        altEn: "Folded CLX1 with the sleeved chain coiled beside the lock body",
        altZh: "收拢的 CLX1，带护套的链条盘在锁体旁",
      },
      {
        src: "/images/listing/angle-cutter-v2.jpg",
        titleEn: "6 mm Stainless Steel Chain.",
        titleZh: "6 mm 不锈钢链条。",
        bodyEn: "Built for everyday security, with a protective sleeve around the chain.",
        bodyZh: "为日常安防而做，链条外有一层防护套。",
        altEn: "Cutter jaws closed on a stainless steel chain link",
        altZh: "剪钳钳口夹在不锈钢链条的链节上",
        position: "center",
      },
      {
        src: "/images/listing/angle-coil.jpg",
        titleEn: "Flexible by Design.",
        titleZh: "柔韧，源于设计。",
        bodyEn: "The flexible chain coils neatly alongside the lock body.",
        bodyZh: "柔韧的链条可以整齐地盘在锁体旁。",
        altEn: "Flexible CLX1 chain coiled beside the lock body",
        altZh: "柔韧的 CLX1 链条盘在锁体旁",
      },
      {
        src: "/images/listing/angle-body.jpg",
        titleEn: "Precision in Every Detail.",
        titleZh: "精密，见于每一处细节。",
        bodyEn: "A streamlined stainless steel lock body houses the fingerprint sensor and USB-C charging port.",
        bodyZh: "流线的不锈钢锁体上，集成了指纹传感器和 USB-C 充电口。",
        altEn: "Stainless steel CLX1 lock body with the fingerprint sensor and USB-C port",
        altZh: "CLX1 不锈钢锁体，可见指纹传感器和 USB-C 接口",
        position: "center 46%",
      },
    ],
  },
  {
    titleEn: "Smart Access",
    titleZh: "智能开锁",
    leadEn: "Flexible access, designed around the way you use your lock.",
    leadZh: "开锁方式灵活，顺着你使用这把锁的习惯来设计。",
    cards: [
      {
        src: "/images/listing/clx1-lock-detail.jpg",
        titleEn: "Your Fingerprint. Instant Access.",
        titleZh: "你的指纹，即刻解锁。",
        bodyEn: "Fast, reliable fingerprint recognition unlocks CLX1. You can register up to 60 fingerprints, including for family members.",
        bodyZh: "指纹识别快速可靠，可打开 CLX1。最多可录入 60 枚指纹，也可以为家人添加。",
        altEn: "Close view of the CLX1 fingerprint sensor",
        altZh: "CLX1 指纹传感器近景",
        lead: true,
      },
      {
        src: "/images/listing/angle-key.jpg",
        titleEn: "More Than One Way to Unlock.",
        titleZh: "开锁，不止一种方式。",
        bodyEn: "Unlock CLX1 with your fingerprint, the app, or the physical key.",
        bodyZh: "可用指纹、App 或机械钥匙打开 CLX1。",
        altEn: "Mechanical key inserted into the CLX1 lock",
        altZh: "机械钥匙插入 CLX1",
        position: "72% center",
      },
      {
        src: "/images/listing/usb-c-emergency-power.jpg",
        titleEn: "Out of Battery? Stay in Control.",
        titleZh: "没电了？仍然可以开锁。",
        bodyEn: "If the battery runs out, connect a power bank to the Type-C port to supply power to CLX1 and regain access.",
        bodyZh: "如果电量耗尽，把充电宝接到 Type-C 口，为 CLX1 供电并重新开锁。",
        altEn: "Type-C cable connected to the CLX1 port for emergency power",
        altZh: "Type-C 线接入 CLX1 接口，用于应急供电",
        fit: "contain",
      },
      {
        src: "/images/listing/angle-ends.jpg",
        titleEn: "Share Access. Not Just Keys.",
        titleZh: "分享的是权限，不只是钥匙。",
        bodyEn: "Share access from the app on your phone.",
        bodyZh: "通过手机上的 App 分享访问权限。",
        altEn: "Hands holding the two ends of the CLX1 lock",
        altZh: "双手握住 CLX1 的两端",
      },
    ],
  },
];

const lifeHero = {
  src: "/images/listing/-3.jpg",
  en: "For Your Bike",
  zh: "用于自行车",
  bodyEn: "Make a quick stop. Stay in your flow.",
  bodyZh: "短暂停留，节奏不断。",
  altEn: "A rider paused with a bicycle outside a street café",
  altZh: "骑行者在街边咖啡馆外把自行车停下",
};

const lifeCards = [
  {
    src: "/images/listing/life-ebike-frame.jpg",
    en: "For Your E-Bike",
    zh: "用于电动自行车",
    bodyEn: "A practical fit for your everyday ride.",
    bodyZh: "贴合每天的骑行。",
    altEn: "CLX1 fastened around the frame of a purple e-bike",
    altZh: "CLX1 锁在一辆紫色电动自行车的车架上",
  },
  {
    src: "/images/listing/life-handlebar-bag.jpg",
    en: "Ready to Go",
    zh: "便于带走",
    bodyEn: "Compact to carry. Ready when you need it.",
    bodyZh: "小巧便携，需要时就在手边。",
    altEn: "Folded CLX1 placed into a bicycle handlebar bag",
    altZh: "收拢的 CLX1 放进自行车车把包",
  },
  {
    src: "/images/listing/life-metal-gate.jpg",
    en: "Beyond the Bike",
    zh: "不只是自行车",
    bodyEn: "Flexible chain access for compatible everyday locking needs.",
    bodyZh: "链条可以配合已经适配的日常上锁需求。",
    altEn: "CLX1 fastened across the bars of an ornate metal gate",
    altZh: "CLX1 横锁在一扇铁艺门的栏杆上",
  },
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
    image: "/images/listing/slide-1.jpg",
    altEn: "Hands holding the two ends of the CLX1 lock",
    altZh: "双手握住 CLX1 锁的两端",
    eyebrowEn: "CLX1 / FINGERPRINT SMART CHAIN LOCK",
    eyebrowZh: "CLX1 / 指纹智能链条锁",
    titleEn: "Unlock with\na touch.",
    titleZh: "轻触，\n即开。",
    bodyEn: "Fingerprint access, made for everyday security.",
    bodyZh: "指纹解锁，为日常安全而生。",
  },
  {
    id: "lifestyle",
    image: "/images/listing/slide-2.jpg",
    altEn: "Close view of the CLX1 lock body and fingerprint sensor",
    altZh: "CLX1 锁体与指纹传感器的近景",
    eyebrowEn: "More Than a Lock",
    eyebrowZh: "不只是一把锁",
    titleEn: "Less Complexity.\nMore Possibility.",
    titleZh: "更少复杂。\n更多可能。",
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
    altEn: "Two cyclists riding together along the coast",
    altZh: "两位骑行者沿海岸并肩骑行",
    titleEn: "Designed for a\nMore Effortless Life.",
    titleZh: "为更从容的生活\n而设计。",
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
            className={
              slide.id === "product"
                ? "brand-slide brand-slide-product"
                : slide.id === "manifesto"
                  ? "brand-slide brand-slide-manifesto"
                  : "brand-slide brand-slide-lifestyle"
            }
            aria-hidden={slideIndex !== index}
          >
            <img src={slide.image} alt={copy(slide.altEn, slide.altZh)} />
            <div className="brand-product-copy">
              {slide.eyebrowEn ? <p className="brand-product-kicker">{copy(slide.eyebrowEn, slide.eyebrowZh ?? "")}</p> : null}
              {slideIndex === 0 ? (
                <h1>{copy(slide.titleEn, slide.titleZh)}</h1>
              ) : (
                <h2 id={slide.id === "lifestyle" ? "lifestyle-title" : undefined}>{copy(slide.titleEn, slide.titleZh)}</h2>
              )}
              {slide.bodyEn ? <p className="brand-product-lead">{copy(slide.bodyEn, slide.bodyZh)}</p> : null}
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
              {slideIndex === 0 ? (
                <div className="brand-product-actions">
                  <Link className="brand-product-btn brand-product-btn-primary" to="/#clx1">
                    <span>{copy("Explore CLX1", "探索 CLX1")}</span>
                    <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
                  </Link>
                  <Link className="brand-product-btn brand-product-btn-secondary" to="/#how-it-works">
                    {copy("How it works", "了解使用方式")}
                  </Link>
                </div>
              ) : slide.principles ? (
                <div className="brand-product-actions">
                  <Link className="brand-product-btn brand-product-btn-primary" to="/#clx1">
                    <span>{copy("Explore CLX1", "探索 CLX1")}</span>
                    <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
                  </Link>
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

export function ProductAngles() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;

  return (
    <div className="v2-home">
      <section className="v2-section" aria-labelledby="detail-angles-title">
        <div className="v2-wrap">
          <header className="v2-section-head">
            <h2 id="detail-angles-title">{copy("Every angle.", "每个角度。")}</h2>
            <p>{copy("A closer look at the details designed around you.", "把为你设计的细节，再看近一些。")}</p>
          </header>
          <div className="angle-groups">
            {angleGroups.map((group) => (
              <section key={group.titleEn} className="angle-group" aria-label={copy(group.titleEn, group.titleZh)}>
                <header className="angle-group-head">
                  <h3>{copy(group.titleEn, group.titleZh)}</h3>
                  <p>{copy(group.leadEn, group.leadZh)}</p>
                </header>
                <ul className="angle-cards">
                  {group.cards.map((card) => (
                    <li key={card.src} className={card.lead ? "angle-card angle-card-lead" : "angle-card"}>
                      <figure>
                        <img
                          src={card.src}
                          alt={copy(card.altEn, card.altZh)}
                          className={card.fit === "contain" ? "angle-card-contain" : undefined}
                          style={card.position ? { objectPosition: card.position } : undefined}
                        />
                      </figure>
                      <div className="angle-card-copy">
                        <h4>{copy(card.titleEn, card.titleZh)}</h4>
                        <p>{copy(card.bodyEn, card.bodyZh)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
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
            <p>{copy("Thoughtful security that fits the way you move through your day.", "贴合日常节奏的细致防护。")}</p>
          </header>
          <div className="life-stage">
            <figure className="life-hero">
              <img src={lifeHero.src} alt={copy(lifeHero.altEn, lifeHero.altZh)} />
              <figcaption>
                <strong>{copy(lifeHero.en, lifeHero.zh)}</strong>
                <p>{copy(lifeHero.bodyEn, lifeHero.bodyZh)}</p>
              </figcaption>
            </figure>
            <ul className="life-aside">
              {lifeCards.map((shot) => (
                <li key={shot.en}>
                  <figure>
                    <img src={shot.src} alt={copy(shot.altEn, shot.altZh)} />
                    <figcaption>
                      <strong>{copy(shot.en, shot.zh)}</strong>
                      <p>{copy(shot.bodyEn, shot.bodyZh)}</p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="life-note">
              {copy(
                "For compatible locking points. Always consider fit, attachment strength, and your security needs.",
                "适用于能够配合的固定点。请自行判断是否贴合、固定是否牢靠，以及是否符合你的安全需求。",
              )}
            </p>
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
            <img src="/images/how-to/access-poster.jpg" alt={copy("CLX1 fingerprint unlock", "CLX1 指纹解锁")} />
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
