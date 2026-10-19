import { Bluetooth, Fingerprint, KeyRound, Smartphone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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

export function HomeHero() {
  const { loading, config, defaultProduct, copy } = useHomeCopy();
  if (loading || !config) return <div className="site-loading">COOLINKEY</div>;
  const heroImage = defaultProduct?.mainImage || "/images/listing/product-clx1-isolated.jpg";

  return (
    <div className="v2-home">
      <section className="v2-hero">
        <div className="v2-wrap v2-hero-grid">
          <div className="v2-hero-copy">
            <p className="v2-eyebrow">COOLINKEY CLX1</p>
            <h1>{copy("Your Finger.\nYour Key.", "你的指纹。\n你的钥匙。")}</h1>
            <p className="v2-lead">
              {copy(
                "Meet CLX1 — a fingerprint smart chain lock designed to make everyday access simpler.",
                "认识 CLX1 —— 一款指纹智能链条锁，让日常开锁更简单。",
              )}
            </p>
            <div className="v2-actions">
              <Link className="v2-btn v2-btn-primary" to="/#clx1">{copy("Explore CLX1", "了解 CLX1")}</Link>
              <Link className="v2-btn v2-btn-secondary" to="/#how-it-works">{copy("See How It Works", "查看如何使用")}</Link>
            </div>
          </div>
          <div className="v2-hero-media">
            <img src={heroImage} alt={copy("CLX1 fingerprint smart chain lock", "CLX1 指纹智能链条锁")} />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductStory() {
  const { loading, config, defaultProduct, lang, copy } = useHomeCopy();
  if (loading || !config) return null;
  const specs = defaultProduct?.specs ?? [];

  return (
    <div className="v2-home">
      <section className="v2-section" aria-labelledby="design-title">
        <div className="v2-wrap">
          <header className="v2-section-head">
            <h2 id="design-title">{copy("More Than a Lock.", "不只是一把锁。")}</h2>
            <p>{copy("A thoughtful combination of form, function and everyday practicality.", "形态、功能与日常实用的结合。")}</p>
          </header>
          <div className="v2-design">
            <figure className="v2-design-main">
              <img src="/images/listing/product-clx1-isolated.jpg" alt={copy("CLX1 product, full view", "CLX1 产品全貌")} />
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
            <ul className="v2-features">
              <li><Fingerprint size={18} aria-hidden="true" /><span>{copy("Fingerprint Unlock", "指纹解锁")}</span></li>
              <li><Smartphone size={18} aria-hidden="true" /><span>{copy("App Control", "App 管理")}</span></li>
              <li><Bluetooth size={18} aria-hidden="true" /><span>{copy("Bluetooth Pairing", "蓝牙配对")}</span></li>
              <li><KeyRound size={18} aria-hidden="true" /><span>{copy("Mechanical Key", "机械钥匙")}</span></li>
            </ul>
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

export function BrandPhilosophy() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;
  return (
    <div className="v2-home">
      <section className="v2-philosophy" aria-labelledby="philosophy-title">
        <img src="/images/listing/brand-lifestyle-story.jpg" alt="" />
        <div className="v2-wrap">
          <h2 id="philosophy-title">{copy("Rethinking Everyday Security.", "重新思考日常安防。")}</h2>
          <p>{copy("We believe everyday security should feel intuitive, thoughtful and easy to use.", "我们希望日常安防直观、细致，并且容易使用。")}</p>
        </div>
      </section>
    </div>
  );
}

export function BusinessPaths() {
  const { loading, config, copy } = useHomeCopy();
  if (loading || !config) return null;
  return (
    <div className="v2-home">
      <section className="v2-section" id="business" aria-labelledby="paths-title">
        <div className="v2-wrap">
          <h2 id="paths-title" className="sr-only">{copy("For consumers and business", "面向个人与商务")}</h2>
          <div className="v2-paths">
            <article>
              <p className="v2-eyebrow">{copy("For Consumers", "面向个人")}</p>
              <ul>
                <li><Link to="/#clx1">{copy("Explore CLX1", "了解 CLX1")}</Link></li>
                <li><Link to="/#how-it-works">{copy("How It Works", "如何使用")}</Link></li>
                <li><Link to="/#support">{copy("Support & FAQ", "支持与常见问题")}</Link></li>
              </ul>
              <Link className="v2-btn v2-btn-primary" to="/#clx1">{copy("Explore Now", "立即了解")}</Link>
            </article>
            <article>
              <p className="v2-eyebrow">{copy("For Business", "面向商务")}</p>
              <ul>
                <li><Link to="/contact">{copy("Business Inquiries", "商务咨询")}</Link></li>
                <li><Link to="/#clx1">{copy("Product Information", "产品信息")}</Link></li>
                <li><Link to="/contact">{copy("Contact Our Team", "联系团队")}</Link></li>
              </ul>
              <Link className="v2-btn v2-btn-primary" to="/contact">{copy("Get in Touch", "取得联系")}</Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
