import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { VideoModal } from "../components/VideoModal";
import type { Lang } from "../utils/siteCopy";

function text(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

export function Durability() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = (en: string, zh: string) => text(lang, en, zh);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section id="safety" className="durability site-anchor" tabIndex={-1} aria-labelledby="durability-title">
      <div className="durability-hero page-wrap">
        <div>
          <p className="durability-kicker">{copy("Engineered for everyday use", "为日常使用而设计")}</p>
          <h2 id="durability-title" className="durability-title">{copy("Built to Face the Unexpected.", "为意外情况而打造。")}</h2>
          <p>
            {copy(
              "Real-world testing. Thoughtful engineering. A closer look at how CLX1 is designed and tested for everyday use.",
              "真实场景测试，细致的工程设计。近距离看看 CLX1 如何为日常使用而设计、而测试。",
            )}
          </p>
        </div>
        <figure className="durability-film">
          <div className="durability-stage">
            <img
              src="/images/listing/product-clx1-isolated.jpg"
              alt={copy(
                "CLX1 product photograph standing in for the missing tire-test video",
                "CLX1 产品照片，用于代替尚未放入项目的轮胎测试视频",
              )}
            />
            <p>
              {copy(
                "Tire-test video not in this project. This frame is reserved for the car-tire recording. It is not test footage.",
                "轮胎碾压测试视频尚未放入本项目。此区域为该录像预留，不是测试画面。",
              )}
            </p>
          </div>
          <figcaption>
            {copy(
              "The Pressure Test. No load, pass count, or certification is published here.",
              "压力测试。这里不公布载荷、通过次数或认证。",
            )}
          </figcaption>
        </figure>
      </div>

      <section className="durability-block page-wrap" aria-labelledby="pressure-title">
        <h2 id="pressure-title" className="sr-only">{copy("The Pressure Test.", "压力测试。")}</h2>
        <div className="durability-points">
          <article>
            <div className="durability-point-media">
              <p>{copy("Recording pending", "录像待补充")}</p>
            </div>
            <h3 id="pressure-card">{copy("Real-World Pressure Testing", "真实受压测试")}</h3>
            <p>
              {copy(
                "The frame above is kept for the car-tire recording. It is not a durability or security certification.",
                "上方画面为汽车轮胎碾压录像预留。它不是耐久性或安全认证。",
              )}
            </p>
          </article>
          <article>
            <img
              src="/images/listing/detail-two-ends.jpg"
              alt={copy("CLX1 lock body, sleeved chain, and both ends", "CLX1 锁体、带护套的链条与两端")}
            />
            <h3>{copy("Built Around the Details", "着眼于细节")}</h3>
            <p>
              {copy(
                "All-stainless-steel lock body, a 6 mm steel wire, and the two ends that close the chain.",
                "纯不锈钢锁体、6 mm 钢丝，以及扣合链条的两端。",
              )}
            </p>
          </article>
          <article>
            <button type="button" className="durability-point-media durability-point-play" onClick={() => setVideoOpen(true)}>
              <p>{copy("Setup video", "设置视频")}</p>
            </button>
            <h3>{copy("Everyday Access, Put to the Test", "日常开锁")}</h3>
            <p>
              {copy(
                "Fingerprint registration is in the setup videos. Repeat-rate, battery, and environment results are not shown.",
                "设置视频里有指纹录入。这里不展示重复识别、续航或环境测试结果。",
              )}
            </p>
          </article>
        </div>
      </section>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src="/videos/how-to/fingerprint-register.mp4" />

      <section className="durability-cta page-wrap" aria-labelledby="confidence-title">
        <img src="/images/listing/detail-stainless-body.jpg" alt={copy("CLX1 stainless-steel lock body", "CLX1 不锈钢锁体")} />
        <div>
          <h2 id="confidence-title">{copy("Designed for Everyday Confidence.", "为日常使用中的信心而设计。")}</h2>
          <p>{copy("Explore the design and smart features behind CLX1.", "了解 CLX1 的设计与智能功能。")}</p>
          <Button variant="primary" href="/#clx1">
            {copy("Discover CLX1", "了解 CLX1")}
          </Button>
        </div>
      </section>
    </section>
  );
}
