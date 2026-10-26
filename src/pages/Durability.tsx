import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { Lang } from "../utils/siteCopy";

function text(lang: Lang, en: string, zh: string) {
  return lang === "zh" ? zh : en;
}

function FileLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="v2-btn v2-btn-secondary" href={href} target="_blank" rel="noopener">
      {label}
    </a>
  );
}

function DocumentCard({
  href,
  previewSrc,
  previewAlt,
  accent,
  children,
}: {
  href: string;
  previewSrc: string;
  previewAlt: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={accent ? "assure-doc assure-doc-ip" : "assure-doc"}>
      <a className="assure-doc-thumb" href={href} target="_blank" rel="noopener">
        <img src={previewSrc} alt={previewAlt} width={640} height={906} loading="lazy" decoding="async" />
      </a>
      <div className="assure-doc-main">{children}</div>
    </article>
  );
}

type Recording = {
  src: string;
  title: string;
  alt: string;
};

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
        pendingEn: "This recording is not published on this page.",
        pendingZh: "这段录像尚未在本页发布。",
      },
      {
        id: "grinder",
        titleEn: "Angle Grinder Test",
        titleZh: "角磨机切割测试",
        bodyEn: "See the attempted cutting process and the outcome shown in the test footage.",
        bodyZh: "观看角磨机切割测试过程，了解视频中实际呈现的结果。",
        pendingEn: "This recording is not published on this page.",
        pendingZh: "这段录像尚未在本页发布。",
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
        bodyEn: "No immersion recording is published on this page, and the available files do not confirm the water depth.",
        bodyZh: "本页尚未发布浸水录像，现有文件也未确认水深。",
        pendingEn: "This recording is not published on this page.",
        pendingZh: "这段录像尚未在本页发布。",
      },
      {
        id: "stream",
        titleEn: "Real-World Stream Test",
        titleZh: "真实溪流环境测试",
        bodyEn: "See CLX1 exposed to a real outdoor stream environment in the recorded test.",
        bodyZh: "通过真实溪流环境测试视频，了解 CLX1 在该场景中的实际表现。",
        media: {
          src: "/images/listing/lock_in_stream.gif",
          altEn: "CLX1 in an outdoor stream",
          altZh: "处于户外溪流中的 CLX1",
          width: 1112,
          height: 834,
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
          src: "/images/listing/car-press.gif",
          altEn: "A car tire rolling over CLX1",
          altZh: "汽车轮胎碾过 CLX1",
          width: 480,
          height: 270,
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
        <img src={recording.src} alt={recording.alt} />
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

      <section className="assure-docs page-wrap" aria-labelledby="assure-docs-title">
        <div className="assure-copy">
          <p className="assure-kicker">{copy("Documentation", "产品文件")}</p>
          <h2 id="assure-docs-title">{copy("Verified Details. Clear Documentation.", "以文件为依据，清晰呈现产品信息")}</h2>
          <p>
            {copy(
              "Explore the available compliance documents, test reports, battery transport documentation, and intellectual property records associated with CLX1.",
              "查看 CLX1 相关的产品合规文件、测试报告、电池运输资料及知识产权文件。",
            )}
          </p>
        </div>

        <div className="assure-doc-groups">
          <section aria-labelledby="assure-compliance-title">
            <h3 id="assure-compliance-title">{copy("Product Compliance & Testing", "产品合规与测试")}</h3>
            <p>{copy("Compliance and protection records for CLX1, where a file is published.", "已发布的 CLX1 合规与防护文件。")}</p>
            <div className="assure-doc-grid">
              <DocumentCard
                href="/documents/clx1-ip67-test.pdf"
                previewSrc="/documents/previews/clx1-ip67-test.webp"
                previewAlt={copy("First page of the IP67 Protection document", "IP67 防护认证文件首页")}
                accent
              >
                <div className="assure-doc-top">
                  <p className="assure-kicker">{copy("Product compliance", "产品合规")}</p>
                  <p className="assure-chip">{copy("IP67 Certified", "IP67 认证")}</p>
                </div>
                <h4>{copy("IP67 Protection", "IP67 防护认证")}</h4>
                <p>
                  {copy(
                    "CLX1 has obtained IP67 certification. Refer to the relevant documentation for the applicable protection rating and test conditions.",
                    "CLX1 已取得 IP67 认证。具体防护等级及适用条件以相关认证文件为准。",
                  )}
                </p>
                <FileLink href="/documents/clx1-ip67-test.pdf" label={copy("View file", "查看文件")} />
              </DocumentCard>
              <DocumentCard
                href="/documents/clx1-fcc.pdf"
                previewSrc="/documents/previews/clx1-fcc.webp"
                previewAlt={copy("First page of the FCC Test Report", "FCC 测试报告首页")}
              >
                <div className="assure-doc-top">
                  <p className="assure-kicker">{copy("Product compliance", "产品合规")}</p>
                </div>
                <h4>{copy("FCC Test Report", "FCC 测试报告")}</h4>
                <p>
                  {copy(
                    "FCC test report for the CLX1 smart chain lock. The stated scope and conditions are those in the document.",
                    "CLX1 智能链条锁的 FCC 测试报告。报告所述范围与条件以该文件为准。",
                  )}
                </p>
                <FileLink href="/documents/clx1-fcc.pdf" label={copy("View file", "查看文件")} />
              </DocumentCard>
              <DocumentCard
                href="/documents/clx1-rohs.pdf"
                previewSrc="/documents/previews/clx1-rohs.webp"
                previewAlt={copy("First page of the RoHS Report", "RoHS 报告首页")}
              >
                <div className="assure-doc-top">
                  <p className="assure-kicker">{copy("Product compliance", "产品合规")}</p>
                </div>
                <h4>{copy("RoHS Report", "RoHS 报告")}</h4>
                <p>
                  {copy(
                    "RoHS verification of conformity for the tested CLX1 sample. The stated scope and conditions are those in the document.",
                    "针对所测 CLX1 样品的 RoHS 符合性验证。报告所述范围与条件以该文件为准。",
                  )}
                </p>
                <FileLink href="/documents/clx1-rohs.pdf" label={copy("View file", "查看文件")} />
              </DocumentCard>
            </div>
          </section>

          <section aria-labelledby="assure-battery-title">
            <h3 id="assure-battery-title">{copy("Battery & Transportation", "电池与运输")}</h3>
            <p>
              {copy(
                "Battery-related documentation and transportation records, where applicable.",
                "电池相关文件及运输资料，具体以实际提供的文件为准。",
              )}
            </p>
            <div className="assure-doc-grid">
              <DocumentCard
                href="/documents/clx1-transport-air.pdf"
                previewSrc="/documents/previews/clx1-transport-air.webp"
                previewAlt={copy("First page of the Air Transport Report", "航空运输报告首页")}
              >
                <div className="assure-doc-top">
                  <p className="assure-kicker">{copy("Transportation", "运输文件")}</p>
                </div>
                <h4>{copy("Air Transport Report", "航空运输报告")}</h4>
                <p>
                  {copy(
                    "Identification and classification report for air transport of the goods named in the file. The stated scope and conditions are those in the document.",
                    "文件所载物品的航空运输危险性鉴别报告。报告所述范围与条件以该文件为准。",
                  )}
                </p>
                <FileLink href="/documents/clx1-transport-air.pdf" label={copy("View file", "查看文件")} />
              </DocumentCard>
              <DocumentCard
                href="/documents/clx1-transport-sea.pdf"
                previewSrc="/documents/previews/clx1-transport-sea.webp"
                previewAlt={copy("First page of the Sea Transport Report", "海运运输报告首页")}
              >
                <div className="assure-doc-top">
                  <p className="assure-kicker">{copy("Transportation", "运输文件")}</p>
                </div>
                <h4>{copy("Sea Transport Report", "海运运输报告")}</h4>
                <p>
                  {copy(
                    "Identification and classification report marked for transport by sea. The stated scope and conditions are those in the document.",
                    "标明海运的运输危险性鉴别报告。报告所述范围与条件以该文件为准。",
                  )}
                </p>
                <FileLink href="/documents/clx1-transport-sea.pdf" label={copy("View file", "查看文件")} />
              </DocumentCard>
            </div>
            <p className="assure-pending">
              {copy(
                "No UN 38.3 report or SDS is published on this page.",
                "本页尚未发布 UN 38.3 报告或 SDS。",
              )}
            </p>
          </section>

          <section aria-labelledby="assure-ip-title">
            <h3 id="assure-ip-title">{copy("Intellectual Property", "知识产权")}</h3>
            <p>
              {copy(
                "Intellectual property documentation associated with the product and its design.",
                "与产品设计及相关技术有关的知识产权文件。",
              )}
            </p>
            <p className="assure-pending">{copy("No patent document is published on this page.", "本页尚未发布专利文件。")}</p>
          </section>
        </div>
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
                      <div className="assure-media">
                        {item.media ? (
                          <img
                            src={item.media.src}
                            alt={alt}
                            width={item.media.width}
                            height={item.media.height}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <p>{copy(item.pendingEn ?? "", item.pendingZh ?? "")}</p>
                        )}
                      </div>
                      <h4>{title}</h4>
                      <p>{copy(item.bodyEn, item.bodyZh)}</p>
                      {item.media ? (
                        <button
                          type="button"
                          className="v2-btn v2-btn-secondary"
                          onClick={() => setRecording({ src: item.media!.src, title, alt })}
                        >
                          {copy("View recording", "查看录像")}
                        </button>
                      ) : null}
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
