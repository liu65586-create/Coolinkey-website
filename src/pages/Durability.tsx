import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Lang } from "../utils/siteCopy";

function text(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

const MANUFACTURING_GIF = "/images/manufacturing/production_process_showcase_640.gif";

type Recording = {
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

function TestCover({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <video
      src={src}
      width={width}
      height={height}
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedMetadata={(event) => {
        const video = event.currentTarget;
        if (video.currentTime < 0.05) video.currentTime = 0.1;
      }}
    />
  );
}

function TestClip({ src, label, width, height }: { src: string; label: string; width: number; height: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const start = video.play();
    if (!start) return;
    start.catch(() => {
      video.muted = true;
      void video.play();
    });
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      aria-label={label}
      width={width}
      height={height}
      controls
      playsInline
      autoPlay
      preload="auto"
    />
  );
}

type TestMedia = {
  src: string;
  altEn: string;
  altZh: string;
  width: number;
  height: number;
};

type TestItem = {
  id: string;
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  media?: TestMedia;
  pendingEn?: string;
  pendingZh?: string;
};

type TestGroup = {
  id: string;
  titleEn: string;
  titleZh: string;
  items: TestItem[];
};

const TEST_GROUPS: TestGroup[] = [
  {
    id: "impact",
    titleEn: "Impact & Cutting",
    titleZh: "冲击与切割",
    items: [
      {
        id: "hammer",
        titleEn: "Hammer Impact Test",
        titleZh: "铁锤锤击测试",
        bodyEn: "Watch CLX1 during a hammer impact test and see the result shown in the footage.",
        bodyZh: "通过锤击测试视频，直观了解 CLX1 在该项测试中的实际表现。",
        media: {
          src: "/videos/testing/hammer-impact.mp4",
          altEn: "CLX1 during a hammer impact test",
          altZh: "锤击测试中的 CLX1",
          width: 3840,
          height: 2160,
        },
      },
      {
        id: "grinder",
        titleEn: "Angle Grinder Test",
        titleZh: "角磨机切割测试",
        bodyEn: "See the attempted cutting process and the outcome shown in the test footage.",
        bodyZh: "观看角磨机切割测试过程，了解视频中实际呈现的结果。",
        media: {
          src: "/videos/testing/angle-grinder.mp4",
          altEn: "CLX1 during an angle grinder cutting test",
          altZh: "角磨机切割测试中的 CLX1",
          width: 3840,
          height: 2160,
        },
      },
    ],
  },
  {
    id: "water",
    titleEn: "Water",
    titleZh: "涉水",
    items: [
      {
        id: "immersion",
        titleEn: "Water Immersion Test",
        titleZh: "浸水测试",
        bodyEn: "The available files do not confirm the water depth.",
        bodyZh: "现有文件未确认水深。",
        media: {
          src: "/videos/testing/water-immersion.mp4",
          altEn: "CLX1 during a water immersion test",
          altZh: "浸水测试中的 CLX1",
          width: 3840,
          height: 2160,
        },
      },
      {
        id: "stream",
        titleEn: "Real-World Stream Test",
        titleZh: "真实溪流环境测试",
        bodyEn: "See CLX1 exposed to a real outdoor stream environment in the recorded test.",
        bodyZh: "通过真实溪流环境测试视频，了解 CLX1 在该场景中的实际表现。",
        media: {
          src: "/videos/testing/stream-test.mp4",
          altEn: "CLX1 in an outdoor stream",
          altZh: "处于户外溪流中的 CLX1",
          width: 960,
          height: 544,
        },
      },
    ],
  },
  {
    id: "pressure",
    titleEn: "Pressure",
    titleZh: "压力",
    items: [
      {
        id: "tire",
        titleEn: "Vehicle Tire Test",
        titleZh: "车轮碾压测试",
        bodyEn: "Watch the recorded vehicle tire test and observe the product's condition as shown.",
        bodyZh: "观看车辆轮胎碾压测试视频，观察测试过程中视频实际呈现的产品状态。",
        media: {
          src: "/videos/testing/tire-test.mp4",
          altEn: "A car tire rolling over CLX1",
          altZh: "汽车轮胎碾过 CLX1",
          width: 3840,
          height: 2160,
        },
      },
    ],
  },
];

function RecordingDialog({
  recording,
  closeLabel,
  onClose,
}: {
  recording: Recording;
  closeLabel: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="assure-dialog-backdrop" onMouseDown={onClose}>
      <div
        className="assure-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="assure-dialog-bar">
          <h2 id={titleId}>{recording.title}</h2>
          <button ref={closeRef} type="button" className="assure-dialog-close" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
        <TestClip src={recording.src} label={recording.alt} width={recording.width} height={recording.height} />
      </div>
    </div>,
    document.body,
  );
}

export function Durability() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = (en: string, zh: string) => text(lang, en, zh);
  const [recording, setRecording] = useState<Recording | null>(null);

  const openTests = () => {
    const target = document.getElementById("safety-tests");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  };

  return (
    <section id="safety" className="assure site-anchor" tabIndex={-1} aria-labelledby="durability-title">
      <div className="assure-hero page-wrap">
        <div className="assure-copy">
          <p className="assure-kicker">{copy("Product assurance", "产品认证与测试")}</p>
          <h2 id="durability-title">{copy("Certificates & Testing", "认证与测试")}</h2>
          <p>
            {copy(
              "Explore CLX1's available product documentation and see how it performs across selected real-world tests.",
              "了解 CLX1 的产品认证与相关文件，并通过真实测试视频，直观了解产品在不同测试条件下的表现。",
            )}
          </p>
          <p className="assure-aside">{copy("Designed with care. Tested in real conditions.", "用心设计。在真实条件下测试。")}</p>
        </div>
        <div className="assure-hero-frame">
          <img
            src="/images/listing/Certificate&Testing.png"
            alt={copy(
              "Annotated CLX1 showing the braided steel cable, TPU lock body, fingerprint module, and woven sleeve",
              "带标注的 CLX1，标出编织钢缆、TPU 锁体、指纹模块和编织护套",
            )}
            width={3840}
            height={2000}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <section className="assure-make page-wrap" aria-labelledby="manufacturing-title">
        <div className="assure-copy">
          <p className="assure-kicker">{copy("Manufacturing Process", "制造过程")}</p>
          <h2 id="manufacturing-title">{copy("Behind Every Detail.", "每个细节的背后。")}</h2>
          <p>
            {copy(
              "From circuit board assembly to final product assembly, every stage plays a part in bringing CLX1 to life.",
              "从电路板装配到成品组装，每一个阶段都参与把 CLX1 做出来。",
            )}
          </p>
          <p>
            {copy(
              "We pay attention to the details behind the product—not just how it looks, but how its electronic components and physical structure come together.",
              "我们留意产品背后的细节：不只是它看起来怎样，也包括电子元件和实体结构如何组合到一起。",
            )}
          </p>
        </div>
        <img
          src={MANUFACTURING_GIF}
          alt={copy("CLX1 production process", "CLX1 生产过程")}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
      </section>

      <section className="assure-docs page-wrap" aria-labelledby="assure-docs-title">
        <div className="assure-copy">
          <p className="assure-kicker">{copy("Documentation", "产品文件")}</p>
          <h2 id="assure-docs-title">{copy("Certificates", "认证文件")}</h2>
          <p>
            {copy(
              "FCC authorization, the IP67 test report, RoHS verification, and the UN38.3 summary for CLX1.",
              "CLX1 的 FCC 授权、IP67 测试报告、RoHS 符合性验证，以及 UN38.3 概要。",
            )}
          </p>
        </div>
        <figure className="assure-sheet">
          <img
            src="/images/listing/clx1-certificates.jpg"
            alt={copy(
              "Four CLX1 certificates: FCC Grant of Equipment Authorization, FCC ID 2BWDZ-CLX; IP67 test report IEC 60529, report 1812C60282113101; RoHS verification AT812C602821128; UN38.3 test summary 1812C60277812701.",
              "四份 CLX1 认证：FCC 设备授权，FCC ID 2BWDZ-CLX；IP67 测试报告 IEC 60529，报告号 1812C60282113101；RoHS 符合性验证 AT812C602821128；UN38.3 测试概要 1812C60277812701。",
            )}
            width={1024}
            height={576}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </section>

      <section className="assure-lab page-wrap" aria-labelledby="assure-lab-title">
        <div className="assure-copy">
          <p className="assure-kicker">{copy("Real-world testing", "真实测试")}</p>
          <h2 id="assure-lab-title">{copy("Put to the Test.", "直观了解，真实呈现")}</h2>
          <p>
            {copy(
              "From impact and cutting attempts to water exposure and vehicle tire pressure, explore the conditions shown in our CLX1 test footage.",
              "从锤击、切割尝试，到浸水和车辆轮胎碾压，通过 CLX1 的测试视频了解各项测试中实际呈现的情况。",
            )}
          </p>
          <button type="button" className="v2-btn v2-btn-secondary" onClick={openTests}>
            {copy("View the five tests", "查看五项测试")}
          </button>
        </div>

        <div id="safety-tests" className="assure-groups" tabIndex={-1}>
          {TEST_GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`assure-group-${group.id}`}>
              <h3 id={`assure-group-${group.id}`}>{copy(group.titleEn, group.titleZh)}</h3>
              <div className="assure-test-grid">
                {group.items.map((item) => {
                  const title = copy(item.titleEn, item.titleZh);
                  const alt = item.media ? copy(item.media.altEn, item.media.altZh) : "";
                  return (
                    <article key={item.id} className="assure-test">
                      <div
                        className="assure-media"
                        style={
                          item.media
                            ? { aspectRatio: `${item.media.width} / ${item.media.height}` }
                            : undefined
                        }
                      >
                        {item.media ? (
                          <>
                            <TestCover src={item.media.src} width={item.media.width} height={item.media.height} />
                            <button
                              type="button"
                              className="v2-btn v2-btn-secondary assure-media-play"
                              aria-label={`${copy("View recording", "查看录像")}, ${title}`}
                              onClick={() =>
                                setRecording({
                                  src: item.media!.src,
                                  title,
                                  alt,
                                  width: item.media!.width,
                                  height: item.media!.height,
                                })
                              }
                            >
                              {copy("View recording", "查看录像")}
                            </button>
                          </>
                        ) : (
                          <p>{copy(item.pendingEn ?? "", item.pendingZh ?? "")}</p>
                        )}
                      </div>
                      <h4>{title}</h4>
                      <p>{copy(item.bodyEn, item.bodyZh)}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="assure-note page-wrap" aria-labelledby="assure-note-title">
        <h2 id="assure-note-title">{copy("Real Tests. Clear Context.", "真实测试，清晰说明")}</h2>
        <p>
          {copy(
            "Each video shows a specific test under the conditions presented. Results apply to the recorded test conditions and should not be interpreted as a guarantee of performance under every possible condition. Refer to the relevant documentation for verified ratings and certifications.",
            "每段视频展示的是特定测试条件下的实际过程。视频结果仅适用于所呈现的测试条件，不应被理解为对所有使用环境下性能的保证。具体防护等级及认证信息，请以相关正式文件为准。",
          )}
        </p>
      </section>

      {recording ? (
        <RecordingDialog
          recording={recording}
          closeLabel={copy("Close", "关闭")}
          onClose={() => setRecording(null)}
        />
      ) : null}
    </section>
  );
}
