import { ArrowDownRight, ArrowRight, CirclePlay, Fingerprint, KeyRound, ShieldCheck, Droplets, Smartphone, Ruler } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { VideoModal } from "../components/VideoModal";
import { ResolvedImage } from "../components/ResolvedImage";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useResolvedMediaUrl } from "../hooks/useResolvedMediaUrl";
import type { Lang } from "../utils/siteCopy";
import { pickBilingual } from "../utils/siteCopy";

const defaultScenarios = [
  { id: "everyday", image: "/images/listing/bike-locking-closeup.jpg", label: { en: "Everyday cycling", zh: "日常骑行" } },
  { id: "ebike", image: "/images/listing/ebike-locking.jpg", label: { en: "E-bikes", zh: "电助力自行车" } },
  { id: "glass", image: "/images/listing/glass-door-locking.jpg", label: { en: "Glass doors", zh: "玻璃门" } },
  { id: "gate", image: "/images/listing/metal-gate-locking.jpg", label: { en: "Metal gates", zh: "金属围栏" } },
];

const fallbackFeatures = [
  { id: "fingerprint", icon: "fingerprint" as const, title: { en: "One-touch access", zh: "一触解锁" }, description: { en: "Unlock with your fingerprint.", zh: "通过指纹快速解锁。" } },
  { id: "dual", icon: "dual" as const, title: { en: "Backup key", zh: "机械钥匙备份" }, description: { en: "A physical key for emergencies.", zh: "紧急情况下可使用机械钥匙。" } },
  { id: "share", icon: "share" as const, title: { en: "App control", zh: "App 管理" }, description: { en: "Manage access from your phone.", zh: "通过手机管理访问权限。" } },
  { id: "logs", icon: "logs" as const, title: { en: "Activity history", zh: "活动记录" }, description: { en: "Review lock activity in the app.", zh: "在 App 中查看锁具活动记录。" } },
  { id: "battery", icon: "battery" as const, title: { en: "USB-C power", zh: "USB-C 供电" }, description: { en: "A backup power option when needed.", zh: "需要时可通过 USB-C 应急供电。" } },
  { id: "water", icon: "water" as const, title: { en: "IP67 rated", zh: "IP67 防护" }, description: { en: "Built for outdoor conditions.", zh: "适用于户外使用环境。" } },
];

export function Home() {
  const { i18n } = useTranslation();
  const { config, loading } = useSiteConfig();
  const { defaultProduct } = useCms();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const [videoOpen, setVideoOpen] = useState(false);

  const heroTitle = pickBilingual(lang, config?.hero.title, { en: "Unlock Freedom.\nRide with Confidence.", zh: "解锁自由。\n安心骑行。" });
  const heroSubtitle = pickBilingual(lang, config?.hero.subtitle, { en: "Smart security for every journey. No keys to carry. More freedom to ride.", zh: "为每一次出行提供智能守护。少一点钥匙负担，多一点自由骑行。" });
  const productImage = useResolvedMediaUrl(defaultProduct?.mainImage || "/images/listing/product-clx1-isolated.jpg");
  const heroImage = useResolvedMediaUrl(config?.hero.backgroundImageUrl || "/images/listing/product-clx1-isolated.jpg");
  const videoManual = defaultProduct?.manuals?.find((manual) => manual.type === "video");
  const videoSrc = lang === "zh" ? (videoManual?.videoUrlZh ?? videoManual?.videoUrlEn ?? null) : (videoManual?.videoUrlEn ?? videoManual?.videoUrlZh ?? null);
  const features = config?.features?.length ? config.features : fallbackFeatures;
  const scenarios = config?.scenarios?.items?.length ? config.scenarios.items : defaultScenarios;
  const spotlight = config?.spotlight;
  const appBanner = config?.appBanner;
  const design = config?.homeDesign;
  const appImage = useResolvedMediaUrl(appBanner?.image?.trim() || "/images/listing/app-key-sharing-wide.jpg");

  if (loading || !config) return <div className="site-loading">COOLINKEY</div>;

  return (
    <>
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {pickBilingual(lang, design?.heroEyebrow, { en: "SMART SECURITY, SIMPLIFIED", zh: "智能安防，简单自在" })}</div>
            <h1>{heroTitle}</h1>
            <p className="hero-subtitle">{heroSubtitle}</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/product">
                {pickBilingual(lang, config.hero.discoverLabel, { en: "Discover CLX1", zh: "了解 CLX1" })}
                <ArrowRight size={17} />
              </Link>
              <button className="button button-quiet" type="button" onClick={() => videoSrc ? setVideoOpen(true) : window.location.assign("/support")}>
                <span className="play-ring"><CirclePlay size={17} /></span>
                {pickBilingual(lang, config.hero.watchLabel, { en: "See how it works", zh: "观看产品演示" })}
              </button>
            </div>
            <div className="hero-proof">
              <div><Fingerprint size={18} /><span>{pickBilingual(lang, design?.heroProofFingerprint, { en: "Fingerprint access", zh: "指纹解锁" })}</span></div>
              <div><KeyRound size={18} /><span>{pickBilingual(lang, design?.heroProofBackup, { en: "Mechanical backup key", zh: "机械钥匙备份" })}</span></div>
              <div><Droplets size={18} /><span>{pickBilingual(lang, spotlight?.specIp, { en: "IP67", zh: "IP67" })}</span></div>
            </div>
          </div>
          <div className="hero-product-wrap">
            <div className="hero-product-glow" />
            <div className="hero-product-card">
              <img src={heroImage || productImage} alt={config.brand.logoAlt || "COOLINKEY CLX1 smart chain lock"} />
              <div className="hero-product-caption">
                <span className="caption-dot" />
                <span>{pickBilingual(lang, defaultProduct?.name, { en: "CLX1 SMART CHAIN LOCK", zh: "CLX1 智能链条锁" })}</span>
                <span className="caption-separator" />
                <span>{pickBilingual(lang, design?.heroImageCaption, { en: "Made for everyday rides", zh: "为日常骑行设计" })}</span>
              </div>
            </div>
            <div className="floating-spec floating-spec-top"><ShieldCheck size={17} /><span>{pickBilingual(lang, spotlight?.specIp, { en: "IP67", zh: "IP67" })}</span><small>{pickBilingual(lang, spotlight?.specIpLabel, { en: "Protection", zh: "防护等级" })}</small></div>
            <div className="floating-spec floating-spec-bottom"><Ruler size={17} /><span>{pickBilingual(lang, spotlight?.specLen, { en: "100 cm", zh: "100 cm" })}</span><small>{pickBilingual(lang, spotlight?.specLenLabel, { en: "Chain perimeter", zh: "链条周长" })}</small></div>
          </div>
          <a className="hero-scroll" href="#features"><span>{pickBilingual(lang, spotlight?.learnMore, { en: "Explore CLX1", zh: "探索 CLX1" })}</span><ArrowDownRight size={16} /></a>
        </div>
      </section>

      <section className="feature-strip" id="features">
        <div className="site-container feature-grid">
          {features.slice(0, 6).map((feature, index) => {
            const Icon = [Fingerprint, KeyRound, Smartphone, ShieldCheck, Droplets, Ruler][index % 6];
            return <article className="feature-tile" key={feature.id || `${feature.icon}-${index}`}>
              <div className="feature-icon"><Icon size={20} strokeWidth={1.7} /></div>
              <h3>{pickBilingual(lang, feature.title, feature.title.en)}</h3>
              <p>{pickBilingual(lang, feature.description, feature.description.en)}</p>
            </article>;
          })}
        </div>
      </section>

      <section className="product-story section-space" id="product">
        <div className="site-container story-grid">
          <div className="story-image-panel">
            <div className="story-image-backdrop" />
            <img src={productImage || "/images/listing/product-clx1-isolated.jpg"} alt={pickBilingual(lang, spotlight?.title, { en: "CLX1 smart chain lock", zh: "CLX1 智能链条锁" })} />
            <div className="story-image-label"><span>01</span><span>{lang === "zh" ? "产品设计" : "DESIGNED FOR EVERYDAY"}</span></div>
          </div>
          <div className="story-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {pickBilingual(lang, spotlight?.kicker, { en: "MEET CLX1", zh: "认识 CLX1" })}</div>
            <h2>{pickBilingual(lang, spotlight?.title, { en: "Security that fits your everyday.", zh: "融入日常的安心守护。" })}</h2>
            <p>{pickBilingual(lang, spotlight?.body, { en: "A smart chain lock that combines fingerprint access, app management and a physical backup key in a clean, portable design.", zh: "将指纹解锁、App 管理与机械钥匙备份融入简洁便携的链条锁设计，让日常上锁更轻松。" })}</p>
            <div className="spec-row">
              <div><strong>{pickBilingual(lang, spotlight?.specChain, { en: "6 mm", zh: "6 mm" })}</strong><span>{pickBilingual(lang, spotlight?.specChainLabel, { en: "Steel wire diameter", zh: "钢丝直径" })}</span></div>
              <div><strong>{pickBilingual(lang, spotlight?.specIp, { en: "IP67", zh: "IP67" })}</strong><span>{pickBilingual(lang, spotlight?.specIpLabel, { en: "Dust & water protection", zh: "防尘防水等级" })}</span></div>
              <div><strong>{pickBilingual(lang, spotlight?.specLen, { en: "100 cm", zh: "100 cm" })}</strong><span>{pickBilingual(lang, spotlight?.specLenLabel, { en: "Chain perimeter", zh: "链条周长" })}</span></div>
            </div>
            <Link className="text-link" to="/product">{pickBilingual(lang, spotlight?.learnMore, { en: "Explore the lock", zh: "探索产品详情" })}<ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      {(["a", "b", "d"] as const).map((key) => {
        const module = config.midModules?.[key];
        const sectionId = key === "a" ? "midA" : key === "b" ? "midB" : "midD";
        const sectionSetting = config.homeSections?.find((item) => item.id === sectionId);
        const slides = (module?.slides ?? []).filter((slide) => slide.mediaUrl?.trim());
        if (!module?.enabled || sectionSetting?.enabled === false || slides.length === 0) return null;
        return <section className="mid-module-section section-space" key={key}>
          <div className="site-container">
            {module.title?.en || module.title?.zh ? <h2 className="mid-module-title">{pickBilingual(lang, module.title, "")}</h2> : null}
            <div className="mid-module-grid">
              {slides.map((slide, index) => <article className="mid-module-card" key={slide.id || `${key}-${index}`}>
                {slide.mediaKind === "video" ? <video src={slide.mediaUrl} controls playsInline preload="metadata" /> : <ResolvedImage src={slide.mediaUrl} alt={pickBilingual(lang, slide.text, "COOLINKEY product feature")} className="mid-module-image" fit={slide.imageFit || "contain"} />}
                {slide.text?.en || slide.text?.zh ? <p>{pickBilingual(lang, slide.text, "")}</p> : null}
              </article>)}
            </div>
          </div>
        </section>;
      })}

      <section className="design-section">
        <div className="site-container">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> {pickBilingual(lang, design?.detailEyebrow, { en: "DETAILS THAT MATTER", zh: "每个细节，都为安心而设计" })}</div><h2>{pickBilingual(lang, design?.detailTitle, { en: "Thoughtful details. Everyday confidence.", zh: "每个细节，都为安心而设计" })}</h2></div>
            <p>{pickBilingual(lang, design?.detailIntro, { en: "From easy access to emergency backup, the essentials are designed to feel intuitive in everyday use.", zh: "从便捷解锁到应急备份，重要功能清晰、直观，也更容易融入日常。" })}</p>
          </div>
          <div className="detail-grid">
            {(design?.details?.length ? design.details : [
              { id: "access", image: "/images/listing/one-touch-unlock.jpg", eyebrow: { en: "01 / ACCESS", zh: "01 / 解锁" }, title: { en: "One touch. You're in.", zh: "一触即开" }, body: { en: "Fingerprint access, without reaching for a key.", zh: "指纹识别，让解锁更简单。" } },
              { id: "backup", image: "/images/listing/mechanical-key-backup.jpg", eyebrow: { en: "02 / BACKUP", zh: "02 / 备份" }, title: { en: "A backup when it matters", zh: "关键时刻，有备份" }, body: { en: "A mechanical key is there for emergencies.", zh: "紧急情况下可使用机械钥匙解锁。" } },
              { id: "connect", image: "/images/listing/app-key-sharing.jpg", eyebrow: { en: "03 / CONNECT", zh: "03 / 互联" }, title: { en: "Control from your phone", zh: "掌控在你手中" }, body: { en: "Manage access with the companion app.", zh: "通过 App 管理访问权限。" } }
            ]).slice(0, 3).map((item, index) => (
              <article className={`detail-card ${index === 0 ? "detail-card-large" : ""}`} key={item.id}>
                <ResolvedImage src={item.image} alt={pickBilingual(lang, item.title, "")} loading="lazy" className={`detail-card-image ${index === 0 ? "detail-product-image" : "detail-scene-image"}`} fit={index === 0 ? "contain" : "cover"} />
                <div className="detail-overlay"><span>{pickBilingual(lang, item.eyebrow, "")}</span><h3>{pickBilingual(lang, item.title, "")}</h3><p>{pickBilingual(lang, item.body, "")}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scenarios-section section-space">
        <div className="site-container">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> {pickBilingual(lang, design?.scenarioEyebrow, { en: "ONE LOCK, MANY ROUTINES", zh: "多种日常场景" })}</div><h2>{pickBilingual(lang, config.scenarios?.title, { en: "Made for more than one kind of ride.", zh: "不止适用于一种出行场景。" })}</h2></div>
            <p>{pickBilingual(lang, config.scenarios?.body, { en: "At the bike rack, outside a café, or securing a gate at home—bring smart access into your routine.", zh: "无论停靠在自行车架旁、咖啡店外，还是在家中锁住围栏，都能融入你的日常。" })}</p>
          </div>
          <div className="scenario-grid">
            {scenarios.slice(0, 4).map((item, index) => (
              <article className="scenario-card" key={item.id || index}>
                <div className="scenario-image"><ResolvedImage src={item.image || defaultScenarios[index % defaultScenarios.length].image} alt={pickBilingual(lang, item.label, "")} className="scenario-actual-image" loading="lazy" fit="contain" /></div>
                <div className="scenario-meta"><span>0{index + 1}</span><h3>{pickBilingual(lang, item.label, "")}</h3><ArrowRight size={16} /></div>
              </article>
            ))}
          </div>
          <div className="scenario-bottom"><span>{pickBilingual(lang, design?.scenarioFooter, { en: "Designed for bicycles, e-bikes and everyday securing needs", zh: "为自行车、电助力自行车及日常固定物品设计" })}</span><Link to="/product">{pickBilingual(lang, config.scenarios?.viewAll, { en: "View product details", zh: "查看产品详情" })} <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="app-section">
        <div className="site-container app-panel">
          <div className="app-image">{appImage ? <img src={appImage} alt={lang === "zh" ? "COOLINKEY App 管理功能" : "COOLINKEY app management"} loading="lazy" /> : null}</div>
          <div className="app-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {pickBilingual(lang, design?.appEyebrow, { en: "CONNECTED CONTROL", zh: "智能互联" })}</div>
            <h2>{pickBilingual(lang, appBanner?.title, { en: "Your lock. Your access.", zh: "你的锁，由你掌控。" })}</h2>
            <p>{pickBilingual(lang, appBanner?.body, { en: "Pair with the app to manage access and make everyday locking feel simpler.", zh: "连接 App 管理访问权限，让日常上锁与解锁更简单。" })}</p>
            <div className="app-points"><div><Smartphone size={18} /><span>{pickBilingual(lang, design?.appPointOne, { en: "App management", zh: "手机管理" })}</span></div><div><KeyRound size={18} /><span>{pickBilingual(lang, design?.appPointTwo, { en: "Convenient access sharing", zh: "便捷授权" })}</span></div></div>
            <Link className="button button-dark" to="/support">{pickBilingual(lang, config.nav?.links?.find((link) => link.to === "/support")?.label, { en: "Explore support", zh: "查看支持与指南" })}<ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src={videoSrc} />
    </>
  );
}
