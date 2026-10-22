import { ChevronDown, CirclePlay } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoModal } from "../components/VideoModal";

const ManualModal = lazy(() => import("../components/ManualModal").then((mod) => ({ default: mod.ManualModal })));
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { CmsManual } from "../types/cms";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { pickBilingual, type Lang } from "../utils/siteCopy";

const stepVideos = [
  { src: "/videos/how-to/Binding.mp4", en: "Bind the lock", zh: "绑定" },
  { src: "/videos/how-to/fingerprint-register.mp4", en: "Register a fingerprint", zh: "录入指纹" },
  { src: "/videos/how-to/ble-unlock.mp4", en: "Unlock with Bluetooth", zh: "蓝牙开锁" },
  { src: "/videos/how-to/delete-fingerprint.mp4", en: "Delete a fingerprint", zh: "删除指纹" },
];

export function Support() {
  const { t, i18n } = useTranslation();
  const { defaultProduct } = useCms();
  const { config } = useSiteConfig();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const page = config?.supportPage;
  const copy = (en: string, zh: string) => (lang === "zh" ? zh : en);
  const text = (field: Parameters<typeof pickBilingual>[1], key: string) => pickBilingual(lang, field, t(key));
  const [active, setActive] = useState<CmsManual | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const manual = useMemo(() => {
    const manuals = getVisibleManuals(defaultProduct?.manuals ?? [], config?.manualsSection?.hiddenManualTypes);
    return manuals.find((item) => item.type === "user_manual") ?? manuals.find((item) => item.type !== "video") ?? null;
  }, [defaultProduct, config]);

  const steps = (page?.steps?.length ? page.steps : []).map((step, index) => ({
    n: String(index + 1).padStart(2, "0"),
    title: pickBilingual(lang, step.title, ""),
    hint: pickBilingual(lang, step.hint, ""),
    id: step.id,
  }));

  const faqs = (page?.faqs?.length ? page.faqs : []).map((item) => ({
    id: item.id,
    q: pickBilingual(lang, item.question, ""),
    a: pickBilingual(lang, item.answer, ""),
  }));

  return (
    <div className="use-guide">
      <header className="v2-section-head">
        <p className="v2-eyebrow">{copy("How to Use", "如何使用")}</p>
        <h2>{copy("The whole setup is four steps.", "整个流程是四步。")}</h2>
        <p>{copy("From the first charge to a touch unlock.", "从先充电，到触摸开锁。")}</p>
      </header>

      <ol className="use-steps">
        {steps.map((step) => (
          <li key={step.id}>
            <span>{step.n}</span>
            <strong>{step.title}</strong>
            {step.hint ? <p>{step.hint}</p> : null}
          </li>
        ))}
      </ol>

      <div className="use-library">
        <article className="use-manual">
          <p className="use-kicker">{copy("Manual", "说明书")}</p>
          <h3>{manual ? (lang === "zh" ? manual.title.zh : manual.title.en) : copy("User Manual", "用户手册")}</h3>
          <p>{copy("The CLX1 manual for setup and everyday use.", "CLX1 的设置与日常使用说明。")}</p>
          {manual ? (
            <button type="button" className="v2-btn v2-btn-primary" onClick={() => setActive(manual)}>
              {t("manualsSection.preview")}
            </button>
          ) : null}
        </article>

        <section className="use-videos" aria-labelledby="use-videos-title">
          <div>
            <p className="use-kicker">{copy("Videos", "视频")}</p>
            <h3 id="use-videos-title">{copy("Step videos", "分步视频")}</h3>
            <p>{copy("Four guides are ready.", "目前先提供 4 段。")}</p>
          </div>
          <ul>
            {stepVideos.map((video) => (
              <li key={video.src}>
                <button type="button" onClick={() => setVideoSrc(video.src)}>
                  <span className="use-play" aria-hidden="true">
                    <CirclePlay size={28} />
                  </span>
                  <strong>{copy(video.en, video.zh)}</strong>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="desk-split use-trouble">
        <div className="desk-copy">
          <p className="desk-kicker">{copy("How to Use", "如何使用")}</p>
          <h2>{text(page?.troubleshooting, "supportPage.troubleshooting")}</h2>
          <p>{text(page?.troubleshootingHint, "supportPage.troubleshootingHint")}</p>
        </div>
        <div className="desk-panel">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary>
                {item.q}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <VideoModal open={Boolean(videoSrc)} onClose={() => setVideoSrc(null)} src={videoSrc} />
      {active ? (
        <Suspense fallback={null}>
          <ManualModal open onClose={() => setActive(null)} manual={active} lang={lang} />
        </Suspense>
      ) : null}
    </div>
  );
}
