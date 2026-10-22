import { ChevronDown, CirclePlay } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoModal } from "../components/VideoModal";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { CmsManual } from "../types/cms";
import { getVisibleManuals } from "../utils/manualsVisibility";
import { pickBilingual, type Lang } from "../utils/siteCopy";

const ManualModal = lazy(() => import("../components/ManualModal").then((mod) => ({ default: mod.ManualModal })));

const stepVideos = [
  {
    src: "/videos/how-to/Binding.mp4",
    poster: "/images/how-to/pair-clx1.jpg",
    en: "Pair Your CLX1",
    zh: "配对 CLX1",
    noteEn: "The pairing recording for the app.",
    noteZh: "App 配对的操作录像。",
  },
  {
    src: "/videos/how-to/fingerprint-register.mp4",
    poster: "/images/how-to/add-fingerprint.jpg",
    en: "Add a Fingerprint",
    zh: "录入指纹",
    noteEn: "The fingerprint registration recording.",
    noteZh: "指纹录入的操作录像。",
  },
  {
    src: "/videos/how-to/ble-unlock.mp4",
    poster: "/images/how-to/unlock-app.jpg",
    en: "Unlock with the App",
    zh: "用 App 开锁",
    noteEn: "The Bluetooth unlock recording.",
    noteZh: "蓝牙开锁的操作录像。",
  },
  {
    src: "/videos/how-to/delete-fingerprint.mp4",
    poster: "/images/how-to/remove-fingerprint.jpg",
    en: "Remove a Fingerprint",
    zh: "删除指纹",
    noteEn: "The fingerprint removal recording.",
    noteZh: "删除指纹的操作录像。",
  },
];

const quickSteps = [
  {
    id: "charge",
    n: "01",
    en: "Charge Your CLX1",
    zh: "为 CLX1 充电",
    bodyEn: "Learn how to charge the lock before setup.",
    bodyZh: "了解设置前如何给锁充电。",
  },
  {
    id: "pair",
    n: "02",
    en: "Connect the App",
    zh: "连接 App",
    bodyEn: "Follow the steps to pair your lock.",
    bodyZh: "按步骤完成锁具配对。",
  },
  {
    id: "print",
    n: "03",
    en: "Register a Fingerprint",
    zh: "录入指纹",
    bodyEn: "Learn how to add and manage fingerprints.",
    bodyZh: "了解如何添加和管理指纹。",
  },
  {
    id: "unlock",
    n: "04",
    en: "Try Your First Unlock",
    zh: "试第一次开锁",
    bodyEn: "Test fingerprint access and learn the backup method.",
    bodyZh: "试一次指纹开锁，并了解备用方式。",
  },
];

type Faq = {
  id: string;
  en: string;
  zh: string;
  causeEn: string;
  causeZh: string;
  tryEn: string;
  tryZh: string;
  confirmEn: string;
  confirmZh: string;
  videos: string[];
};

const faqs: Faq[] = [
  {
    id: "print-fail",
    en: "Fingerprint recognition fails",
    zh: "指纹识别失败",
    causeEn: "Moisture, a dirty sensor, uneven pressure, or heavy gloves can stop a print from being read. Other causes are not listed here.",
    causeZh: "潮湿、传感器不干净、按压不均匀或厚手套，都可能让指纹读不到。这里没有列出其他原因。",
    tryEn: "Dry or clean the sensor, then re-enrol the print with even pressure.",
    tryZh: "擦干并清洁传感器，再以均匀力度重新录入。",
    confirmEn: "After the new print is saved, try a touch unlock.",
    confirmZh: "新指纹保存后，再试一次触摸开锁。",
    videos: ["/videos/how-to/fingerprint-register.mp4"],
  },
  {
    id: "app-connect",
    en: "The app cannot connect",
    zh: "App 无法连接",
    causeEn: "This page does not list connection causes beyond the published pairing step.",
    causeZh: "除了已公布的配对步骤，这里不列出其他连接原因。",
    tryEn: "Pair the lock in the app. The pairing recording shows that step.",
    tryZh: "在 App 中配对锁具。配对录像演示的就是这一步。",
    confirmEn: "Pairing is complete when the flow in the recording finishes.",
    confirmZh: "录像中的流程完成后，配对即完成。",
    videos: ["/videos/how-to/Binding.mp4"],
  },
  {
    id: "wont-unlock",
    en: "The lock will not unlock",
    zh: "锁无法打开",
    causeEn: "The published ways to open CLX1 are fingerprint, the app, the mechanical key, and Type-C power if the battery is fully drained.",
    causeZh: "已公布的开锁方式是指纹、App、机械钥匙，以及电量耗尽时用 Type-C 供电。",
    tryEn: "Try fingerprint access. Then use the app unlock in the recording. Then insert the mechanical key fully and turn it firmly. If the lock is fully drained, connect a power bank to the Type-C port, then charge fully.",
    tryZh: "先试指纹。再用录像中的 App 开锁。然后把机械钥匙完全插入并用力转动。若电量耗尽，用充电宝连接 Type-C 口，再完整充电。",
    confirmEn: "The lock is open when one of these published methods releases it.",
    confirmZh: "以上任一已公布方式让锁打开，即表示已经解开。",
    videos: ["/videos/how-to/ble-unlock.mp4"],
  },
  {
    id: "power",
    en: "Charging or power issues",
    zh: "充电或供电问题",
    causeEn: "The published power notes cover the USB-C cable and a fully drained battery. Charge time and indicator behaviour are not listed here.",
    causeZh: "已公布的供电说明只包括 USB-C 线和电量耗尽。这里不写充电时长或指示灯状态。",
    tryEn: "Use a USB-C cable. If the lock is fully drained, connect a power bank to the Type-C port to unlock, then charge fully.",
    tryZh: "请使用 USB-C 线。若电量耗尽，可用充电宝连接 Type-C 口应急开锁，再完整充电。",
    confirmEn: "After charging, try fingerprint or app unlock again.",
    confirmZh: "充电后，再试一次指纹或 App 开锁。",
    videos: [],
  },
  {
    id: "manage-prints",
    en: "Adding or removing fingerprints",
    zh: "添加或删除指纹",
    causeEn: "This page does not add causes beyond the two recordings.",
    causeZh: "除了这两段录像，这里不补充其他原因。",
    tryEn: "Follow the registration recording to add a print, and the removal recording to delete one.",
    tryZh: "按录入录像添加指纹，按删除录像移除指纹。",
    confirmEn: "The change is done when the flow in the recording finishes.",
    confirmZh: "录像中的流程完成后，更改即完成。",
    videos: ["/videos/how-to/fingerprint-register.mp4", "/videos/how-to/delete-fingerprint.mp4"],
  },
  {
    id: "key",
    en: "Using the mechanical key",
    zh: "使用机械钥匙",
    causeEn: "The backup key is for emergencies. No separate key video is in this project.",
    causeZh: "备用钥匙仅用于应急。本项目没有单独的钥匙录像。",
    tryEn: "Insert the key fully, turn it firmly, then store the key separately from the lock.",
    tryZh: "把钥匙完全插入并用力转动，平时请与锁分开存放。",
    confirmEn: "The key has worked when the lock opens after that turn.",
    confirmZh: "转动后锁打开，即表示钥匙已经生效。",
    videos: [],
  },
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
  const email = config?.contact?.email?.trim() || "support@coolinkey.com";

  const manual = useMemo(() => {
    const manuals = getVisibleManuals(defaultProduct?.manuals ?? [], config?.manualsSection?.hiddenManualTypes);
    return manuals.find((item) => item.type === "user_manual") ?? manuals.find((item) => item.type !== "video") ?? null;
  }, [defaultProduct, config]);

  const videoTitle = (src: string) => {
    const video = stepVideos.find((item) => item.src === src);
    return video ? copy(video.en, video.zh) : copy("Play video", "播放视频");
  };

  return (
    <div className="use-guide">
      <header className="v2-section-head">
        <p className="v2-eyebrow">{text(page?.quickStart, "supportPage.quickStart")}</p>
        <h2>{copy("Get Started with CLX1.", "开始使用 CLX1。")}</h2>
        <p>{copy("From the first charge to your first fingerprint unlock.", "从第一次充电，到第一次指纹开锁。")}</p>
      </header>

      <div className="use-start">
        <ol className="use-steps">
          {quickSteps.map((step) => (
            <li key={step.id}>
              <div className="use-step">
                <span>{step.n}</span>
                <strong>{copy(step.en, step.zh)}</strong>
                <p>{copy(step.bodyEn, step.bodyZh)}</p>
              </div>
            </li>
          ))}
        </ol>
        {manual ? (
          <button type="button" className="v2-btn v2-btn-primary" onClick={() => setActive(manual)}>
            {copy("User Manual", "用户手册")}
          </button>
        ) : null}
      </div>

      <section className="use-videos" aria-labelledby="use-videos-title">
        <div>
          <p className="use-kicker">{text(page?.videos, "supportPage.videos")}</p>
          <h3 id="use-videos-title">{copy("Video Tutorials", "视频教程")}</h3>
          <p>{copy("Four recordings are ready.", "目前有 4 段录像。")}</p>
        </div>
        <ul>
          {stepVideos.map((video) => (
            <li key={video.src}>
              <button type="button" onClick={() => setVideoSrc(video.src)}>
                <span className="use-video-still">
                  <img src={video.poster} alt="" />
                  <span className="use-play" aria-hidden="true">
                    <CirclePlay size={28} />
                  </span>
                </span>
                <strong>{copy(video.en, video.zh)}</strong>
                <span className="use-video-note">{copy(video.noteEn, video.noteZh)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div id="troubleshooting" className="desk-split use-trouble" tabIndex={-1}>
        <div className="desk-copy">
          <p className="desk-kicker">{copy("How to Use", "如何使用")}</p>
          <h2>{text(page?.troubleshooting, "supportPage.troubleshooting")}</h2>
          <p>{text(page?.troubleshootingHint, "supportPage.troubleshootingHint")}</p>
        </div>
        <div className="desk-panel">
          {faqs.map((item) => (
            <details key={item.id}>
              <summary>
                {copy(item.en, item.zh)}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <p><strong>{copy("Possible cause. ", "可能原因。")}</strong>{copy(item.causeEn, item.causeZh)}</p>
              <p><strong>{copy("What to try. ", "可以尝试。")}</strong>{copy(item.tryEn, item.tryZh)}</p>
              <p><strong>{copy("How to confirm. ", "如何确认。")}</strong>{copy(item.confirmEn, item.confirmZh)}</p>
              {item.videos.map((src) => (
                <button key={src} type="button" onClick={() => setVideoSrc(src)}>
                  {copy("Watch", "观看")} {videoTitle(src)}
                </button>
              ))}
              <p>
                <a href={`mailto:${email}`}>{copy("Email support", "发邮件给支持")}</a>
              </p>
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
