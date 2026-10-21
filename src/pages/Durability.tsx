import { Box, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import type { Lang } from "../utils/siteCopy";

function text(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

export function Durability() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = (en: string, zh: string) => text(lang, en, zh);

  return (
    <article className="durability">
      <section className="durability-hero page-wrap">
        <div>
          <p className="durability-kicker">{copy("Engineered for everyday use", "为日常使用而设计")}</p>
          <h1>{copy("Built to Face the Unexpected.", "为意外情况而打造。")}</h1>
          <p>
            {copy(
              "Real-world testing. A closer look at how CLX1 responds to pressure.",
              "真实场景测试。近距离看看 CLX1 在受压时的表现。",
            )}
          </p>
        </div>
        <img
          src="/images/listing/bike-locking-closeup.jpg"
          alt={copy("CLX1 chain and lock body fastened to a bicycle", "固定在自行车上的 CLX1 链条与锁体")}
        />
      </section>

      <section className="durability-block page-wrap" aria-labelledby="pressure-title">
        <p className="durability-kicker">{copy("01 / Featured test", "01 / 重点测试")}</p>
        <h2 id="pressure-title">{copy("The Pressure Test.", "压力测试。")}</h2>
        <p>
          {copy(
            "See CLX1 in a real-world tire-pressure demonstration.",
            "观看 CLX1 的真实轮胎碾压演示。",
          )}
        </p>
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
              "Test conditions and post-test observations should be documented accurately.",
              "测试条件与测试后的观察应如实记录。",
            )}
          </figcaption>
        </figure>
      </section>

      <section className="durability-block page-wrap" aria-labelledby="evaluate-title">
        <p className="durability-kicker">{copy("02 / What we evaluate", "02 / 我们关注什么")}</p>
        <h2 id="evaluate-title">{copy("More Than What Meets the Eye.", "不止眼前所见。")}</h2>
        <p className="durability-note">
          {copy(
            "These describe what an inspection looks at. They are not completed test results.",
            "以下是检查时关注的方面，不是已确认的测试结果。",
          )}
        </p>
        <div className="durability-eval">
          <article>
            <Box aria-hidden="true" size={22} strokeWidth={1.5} />
            <h3>{copy("Structural Integrity", "结构完整性")}</h3>
            <p>{copy("Inspect the product for visible structural damage.", "检查产品是否有可见的结构损伤。")}</p>
          </article>
          <article>
            <Search aria-hidden="true" size={22} strokeWidth={1.5} />
            <h3>{copy("Post-Test Inspection", "测试后检查")}</h3>
            <p>
              {copy(
                "Document actual condition and functionality after testing.",
                "记录测试后的实际状态与功能。",
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="durability-cta page-wrap" aria-labelledby="confidence-title">
        <img src="/images/listing/product-clx1-isolated.jpg" alt={copy("CLX1 smart chain lock", "CLX1 智能链条锁")} />
        <div>
          <h2 id="confidence-title">{copy("Designed for Everyday Confidence.", "为日常使用中的信心而设计。")}</h2>
          <p>{copy("Explore the design and smart features behind CLX1.", "了解 CLX1 的设计与智能功能。")}</p>
          <Button variant="primary" href="/#clx1">
            {copy("Discover CLX1", "了解 CLX1")}
          </Button>
        </div>
      </section>
    </article>
  );
}
