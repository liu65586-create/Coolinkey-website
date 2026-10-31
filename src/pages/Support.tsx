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
  {
    src: "/videos/how-to/physical-key.mp4",
    poster: "/images/how-to/physical-key.jpg",
    en: "Use the Mechanical Key",
    zh: "使用机械钥匙",
    noteEn: "The mechanical key recording.",
    noteZh: "机械钥匙的操作录像。",
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
  causeEn?: string;
  causeZh?: string;
  tryEn?: string;
  tryZh?: string;
  confirmEn?: string;
  confirmZh?: string;
  solutionsEn?: string[];
  solutionsZh?: string[];
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
    causeEn: "The backup key is for emergencies. The recording shows how to use it.",
    causeZh: "备用钥匙仅用于应急。录像演示如何使用。",
    tryEn: "Insert the key fully, turn it firmly, then store the key separately from the lock.",
    tryZh: "把钥匙完全插入并用力转动，平时请与锁分开存放。",
    confirmEn: "The key has worked when the lock opens after that turn.",
    confirmZh: "转动后锁打开，即表示钥匙已经生效。",
    videos: ["/videos/how-to/physical-key.mp4"],
  },
  {
    id: "app-timeout",
    en: "The app indicates connection failure or timeout",
    zh: "App 提示连接失败或超时",
    solutionsEn: [
      "Touch the fingerprint identification area and check if the device responds.",
      "If the device responds abnormally or not at all, the battery may be too low or exhausted. Please charge and try again.",
      "If the device responds normally, please ensure that the account logged in the app is consistent with the account used during pairing.",
      "If none of the above issues exist, ensure that the phone and the device are as close as possible, and complete the connection between the mobile phone app and the device within 30 seconds after the device's blue light starts breathing.",
    ],
    solutionsZh: [
      "触摸指纹识别区域，检查设备是否有响应。",
      "若设备响应异常或完全没有响应，可能是电量过低或已耗尽。请充电后再试。",
      "若设备响应正常，请确认 App 登录的账号与配对时使用的账号一致。",
      "若以上情况都不存在，请让手机尽量靠近设备，并在设备蓝灯开始呼吸闪烁后的 30 秒内，完成手机 App 与设备的连接。",
    ],
    videos: [],
  },
  {
    id: "add-print-fail",
    en: "Failed to add a fingerprint",
    zh: "指纹添加失败",
    solutionsEn: [
      "Ensure your fingers are dry and clean, and try using another finger if needed.",
      "It is recommended to add fingerprints when the device has sufficient power. Charge the device and try again if necessary.",
    ],
    solutionsZh: [
      "请确保手指干燥、清洁，必要时换一根手指再试。",
      "建议在设备电量充足时录入指纹。如有需要，请先为设备充电后再试。",
    ],
    videos: [],
  },
  {
    id: "bind-missing",
    en: "Cannot find the device when tapping + during binding",
    zh: "绑定时点击 App「+」找不到设备，无法完成绑定",
    solutionsEn: [
      "Touch the fingerprint identification area to ensure the device is in wake-up state, then perform the binding operation.",
      "Check if the device has already been bound to another account. Note: One device can only be bound to one account.",
      "Try the following steps: First turn off the phone's Bluetooth, exit the app, then re-enable Bluetooth, restart the app, and try again.",
    ],
    solutionsZh: [
      "触摸指纹识别区域，确认设备处于唤醒状态后，再进行绑定。",
      "检查设备是否已经绑定到其他账号。注意：一台设备只能绑定一个账号。",
      "可按以下步骤重试：先关闭手机蓝牙，退出 App，再重新打开蓝牙并重启 App，然后再次尝试。",
    ],
    videos: [],
  },
  {
    id: "auto-lock",
    en: "Auto-lock fails after closing the lock",
    zh: "关锁后无法自动上锁",
    solutionsEn: [
      "Confirm that the Auto-Lock switch is enabled in More Settings of the app.",
      "You can manually trigger locking via the app or by using an incorrect fingerprint to check if the locking function works normally.",
    ],
    solutionsZh: [
      "请确认已在 App 的「更多设置」中打开自动上锁开关。",
      "可通过 App 手动触发上锁，或使用一枚错误指纹，检查上锁功能是否正常。",
    ],
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
        <h2>{copy("Get Started with CLX1", "开始使用 CLX1")}</h2>
        <p>{copy("From the first charge to your first fingerprint unlock", "从第一次充电，到第一次指纹开锁")}</p>
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
          <p>{copy("Five recordings are ready", "目前有 5 段录像")}</p>
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
                <span>{copy(item.en, item.zh)}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              {item.solutionsEn?.length ? (
                <>
                  <p className="desk-solution-label"><strong>{copy("Solution", "解决方法")}</strong></p>
                  <ul className="desk-solution">
                    {(lang === "zh" ? item.solutionsZh : item.solutionsEn)?.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p><strong>{copy("Possible cause. ", "可能原因。")}</strong>{copy(item.causeEn ?? "", item.causeZh ?? "")}</p>
                  <p><strong>{copy("What to try. ", "可以尝试。")}</strong>{copy(item.tryEn ?? "", item.tryZh ?? "")}</p>
                  <p><strong>{copy("How to confirm. ", "如何确认。")}</strong>{copy(item.confirmEn ?? "", item.confirmZh ?? "")}</p>
                </>
              )}
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
