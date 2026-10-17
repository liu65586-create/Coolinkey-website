import { SITE_PATHS } from "../cms/sitePaths";
import { BiInput } from "../components/admin/BiInput";
import { FitFocusFields } from "../components/admin/FitFocusFields";
import { MediaUploadField } from "../components/admin/MediaUploadField";
import type { HomeSectionId, SiteConfig } from "../types/siteConfig";
import type { CmsProduct } from "../types/cms";

const SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: "首屏",
  features: "功能卖点",
  spotlight: "产品展示",
  scenarios: "场景",
  app: "App 横幅",
  midA: "中部模块 A",
  midB: "中部模块 B",
  midD: "中部模块 D",
  manuals: "首页说明书",
};

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export type ContentSection = "settings" | "home" | "support";

export function AdminSiteExtras({ draft, setDraft, products = [], setProducts, section }: { draft: SiteConfig; setDraft: (next: SiteConfig) => void; products?: CmsProduct[]; setProducts?: (next: CmsProduct[]) => void; section: ContentSection }) {
  const sections = draft.homeSections ?? [];
  const show = (name: ContentSection) => section === name;
  const support = draft.supportPage;
  return (
    <div className="space-y-10">
      {show("settings") ? <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">导航</h2>
        <p className="text-sm text-[#cccccc]">可以改中英文名称。首页、CLX1、支持和关于停在同一页的对应位置，其余项仍是独立页面。</p>
        {(draft.nav?.links ?? []).map((link, index) => (
          <div key={link.id} className="space-y-3 border-t border-white/10 pt-4">
            <BiInput
              label={link.id}
              value={link.label}
              onChange={(label) => {
                const links = [...(draft.nav?.links ?? [])];
                links[index] = { ...link, label };
                setDraft({ ...draft, nav: { links } });
              }}
            />
            <label className="block text-sm text-[#cccccc]">
              <span className="mb-1 block text-xs font-semibold text-white/80">路径</span>
              <select
                className="w-full max-w-xs rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white"
                value={link.to}
                onChange={(e) => {
                  const links = [...(draft.nav?.links ?? [])];
                  links[index] = { ...link, to: e.target.value };
                  setDraft({ ...draft, nav: { links } });
                }}
              >
                {SITE_PATHS.map((path) => (
                  <option key={path} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </section> : null}

      {show("home") ? <><section className="space-y-3 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">首页模块顺序</h2>
        {sections.map((section, index) => (
          <div key={section.id} className="flex flex-wrap items-center gap-3">
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={(e) => {
                const homeSections = sections.map((item) => (item.id === section.id ? { ...item, enabled: e.target.checked } : item));
                setDraft({ ...draft, homeSections });
              }}
            />
            <span className="min-w-28 text-sm">{SECTION_LABELS[section.id]}</span>
            <button type="button" className="text-xs text-[#ccc]" onClick={() => setDraft({ ...draft, homeSections: move(sections, index, -1) })}>
              上移
            </button>
            <button type="button" className="text-xs text-[#ccc]" onClick={() => setDraft({ ...draft, homeSections: move(sections, index, 1) })}>
              下移
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">首屏展示</h2>
        <FitFocusFields
          fit={draft.hero.imageFit === "contain" ? "contain" : "cover"}
          focus={draft.hero.focus || "50% 50%"}
          onChange={(next) => setDraft({ ...draft, hero: { ...draft.hero, imageFit: next.fit, focus: next.focus } })}
        />
        <BiInput label="了解按钮" value={draft.hero.discoverLabel ?? { en: "", zh: "" }} onChange={(discoverLabel) => setDraft({ ...draft, hero: { ...draft.hero, discoverLabel } })} />
        <BiInput label="视频按钮" value={draft.hero.watchLabel ?? { en: "", zh: "" }} onChange={(watchLabel) => setDraft({ ...draft, hero: { ...draft.hero, watchLabel } })} />
      </section>

      <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">产品展示与场景</h2>
        <BiInput label="展示标题" value={draft.spotlight?.title ?? { en: "", zh: "" }} onChange={(title) => setDraft({ ...draft, spotlight: { ...draft.spotlight!, title } })} />
        <BiInput label="展示正文" value={draft.spotlight?.body ?? { en: "", zh: "" }} onChange={(body) => setDraft({ ...draft, spotlight: { ...draft.spotlight!, body } })} />
        <FitFocusFields
          fit={draft.spotlight?.imageFit === "cover" ? "cover" : "contain"}
          focus={draft.spotlight?.focus || "50% 50%"}
          onChange={(next) => setDraft({ ...draft, spotlight: { ...draft.spotlight!, imageFit: next.fit, focus: next.focus } })}
        />
        <BiInput label="场景标题" value={draft.scenarios?.title ?? { en: "", zh: "" }} onChange={(title) => setDraft({ ...draft, scenarios: { ...draft.scenarios!, title } })} />
        <FitFocusFields
          fit={draft.scenarios?.imageFit === "contain" ? "contain" : "cover"}
          focus={draft.scenarios?.focus || "50% 50%"}
          onChange={(next) => setDraft({ ...draft, scenarios: { ...draft.scenarios!, imageFit: next.fit, focus: next.focus } })}
        />
        {(draft.scenarios?.items ?? []).map((item, index) => (
          <div key={item.id} className="space-y-2 border-t border-white/10 pt-3">
            <BiInput
              label={`场景 ${index + 1}`}
              value={item.label}
              onChange={(label) => {
                const items = [...(draft.scenarios?.items ?? [])];
                items[index] = { ...item, label };
                setDraft({ ...draft, scenarios: { ...draft.scenarios!, items } });
              }}
            />
            <MediaUploadField
              slotId={item.id}
              label="场景图"
              kind="image"
              compact
              value={item.image}
              onChange={(image) => {
                const items = [...(draft.scenarios?.items ?? [])];
                items[index] = { ...item, image };
                setDraft({ ...draft, scenarios: { ...draft.scenarios!, items } });
              }}
            />
          </div>
        ))}
      </section>

      {draft.homeDesign ? (
        <section className="space-y-5 rounded-xl border border-white/12 bg-[#252a33] p-5">
          <div>
            <h2 className="text-lg font-semibold">首页视觉模块与全部文案</h2>
            <p className="mt-1 text-sm text-[#cccccc]">这里控制新版首页的眉题、功能卡片、场景补充文字和底部 CTA；每个模块支持中英文。图片替换后，点「提交并发布」会一起提交。</p>
          </div>
          <BiInput label="首屏眉题" value={draft.homeDesign.heroEyebrow} onChange={(heroEyebrow) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, heroEyebrow } })} />
          <BiInput label="首屏卖点：指纹" value={draft.homeDesign.heroProofFingerprint} onChange={(heroProofFingerprint) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, heroProofFingerprint } })} />
          <BiInput label="首屏卖点：备用钥匙" value={draft.homeDesign.heroProofBackup} onChange={(heroProofBackup) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, heroProofBackup } })} />
          <BiInput label="首屏产品图说明" value={draft.homeDesign.heroImageCaption} onChange={(heroImageCaption) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, heroImageCaption } })} />
          <div className="grid gap-4 md:grid-cols-2">
            <BiInput label="功能模块眉题" value={draft.homeDesign.detailEyebrow} onChange={(detailEyebrow) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, detailEyebrow } })} />
            <BiInput label="功能模块标题" value={draft.homeDesign.detailTitle} onChange={(detailTitle) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, detailTitle } })} />
          </div>
          <BiInput label="功能模块说明" value={draft.homeDesign.detailIntro} onChange={(detailIntro) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, detailIntro } })} />
          {(draft.homeDesign.details ?? []).map((item, index) => (
            <div key={item.id} className="space-y-3 rounded-xl border border-white/10 p-4">
              <h3 className="font-semibold">功能卡片 {index + 1}</h3>
              <MediaUploadField
                slotId={`home-detail-${item.id}`}
                label="卡片图片"
                kind="image"
                value={item.image}
                onChange={(image) => {
                  const details = [...draft.homeDesign!.details];
                  details[index] = { ...item, image };
                  setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, details } });
                }}
              />
              <BiInput label="卡片眉题" value={item.eyebrow} onChange={(eyebrow) => {
                const details = [...draft.homeDesign!.details]; details[index] = { ...item, eyebrow };
                setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, details } });
              }} />
              <BiInput label="卡片标题" value={item.title} onChange={(title) => {
                const details = [...draft.homeDesign!.details]; details[index] = { ...item, title };
                setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, details } });
              }} />
              <BiInput label="卡片说明" value={item.body} onChange={(body) => {
                const details = [...draft.homeDesign!.details]; details[index] = { ...item, body };
                setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, details } });
              }} />
            </div>
          ))}
          <BiInput label="场景模块眉题" value={draft.homeDesign.scenarioEyebrow} onChange={(scenarioEyebrow) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, scenarioEyebrow } })} />
          <BiInput label="场景模块底部说明" value={draft.homeDesign.scenarioFooter} onChange={(scenarioFooter) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, scenarioFooter } })} />
          <BiInput label="App 模块眉题" value={draft.homeDesign.appEyebrow} onChange={(appEyebrow) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, appEyebrow } })} />
          <BiInput label="App 卖点一" value={draft.homeDesign.appPointOne} onChange={(appPointOne) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, appPointOne } })} />
          <BiInput label="App 卖点二" value={draft.homeDesign.appPointTwo} onChange={(appPointTwo) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, appPointTwo } })} />
          <BiInput label="底部 CTA 眉题" value={draft.homeDesign.closingEyebrow} onChange={(closingEyebrow) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, closingEyebrow } })} />
          <BiInput label="底部 CTA 标题" value={draft.homeDesign.closingTitle} onChange={(closingTitle) => setDraft({ ...draft, homeDesign: { ...draft.homeDesign!, closingTitle } })} />
        </section>
      ) : null}
      </> : null}

      {show("support") && support ? (
        <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
          <h2 className="text-lg font-semibold">Support 页面文案</h2>
          <p className="text-sm text-[#cccccc]">这里是页面上的故障问答。PDF 和视频在下面的资料管理里按类型维护。</p>
          <BiInput label="标题" value={support.title} onChange={(title) => setDraft({ ...draft, supportPage: { ...support, title } })} />
          <BiInput label="副标题" value={support.subtitle} onChange={(subtitle) => setDraft({ ...draft, supportPage: { ...support, subtitle } })} />
          <BiInput label="Quick Start 标题" value={support.quickStart} onChange={(quickStart) => setDraft({ ...draft, supportPage: { ...support, quickStart } })} />
          <BiInput label="Quick Start 说明" value={support.quickStartHint} onChange={(quickStartHint) => setDraft({ ...draft, supportPage: { ...support, quickStartHint } })} />
          <BiInput label="User Guides 标题" value={support.guides} onChange={(guides) => setDraft({ ...draft, supportPage: { ...support, guides } })} />
          <BiInput label="User Guides 说明" value={support.guidesHint} onChange={(guidesHint) => setDraft({ ...draft, supportPage: { ...support, guidesHint } })} />
          <BiInput label="Videos 标题" value={support.videos} onChange={(videos) => setDraft({ ...draft, supportPage: { ...support, videos } })} />
          <BiInput label="Videos 说明" value={support.videosHint} onChange={(videosHint) => setDraft({ ...draft, supportPage: { ...support, videosHint } })} />
          <BiInput label="Troubleshooting 标题" value={support.troubleshooting} onChange={(troubleshooting) => setDraft({ ...draft, supportPage: { ...support, troubleshooting } })} />
          <BiInput label="Troubleshooting 说明" value={support.troubleshootingHint} onChange={(troubleshootingHint) => setDraft({ ...draft, supportPage: { ...support, troubleshootingHint } })} />
          <div className="space-y-3 rounded-lg border border-white/10 p-3">
            <h3 className="font-semibold">Quick Start 步骤</h3>
            {support.steps.map((step, index) => <div key={step.id} className="space-y-2 border-t border-white/10 pt-3">
              <div className="flex justify-end"><button type="button" className="text-xs text-red-300" onClick={() => setDraft({ ...draft, supportPage: { ...support, steps: support.steps.filter((item) => item.id !== step.id) } })}>删除步骤</button></div>
              <BiInput label={`步骤 ${index + 1} 标题`} value={step.title} onChange={(title) => setDraft({ ...draft, supportPage: { ...support, steps: support.steps.map((item) => item.id === step.id ? { ...item, title } : item) } })} />
              <BiInput label="步骤说明" value={step.hint} onChange={(hint) => setDraft({ ...draft, supportPage: { ...support, steps: support.steps.map((item) => item.id === step.id ? { ...item, hint } : item) } })} />
            </div>)}
            <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm" onClick={() => setDraft({ ...draft, supportPage: { ...support, steps: [...support.steps, { id: `support-step-${Date.now()}`, title: { en: "", zh: "" }, hint: { en: "", zh: "" } }] } })}>新增 Quick Start 步骤</button>
          </div>
          <div className="space-y-3 rounded-lg border border-white/10 p-3">
            <h3 className="font-semibold">Support 资料管理 · 产品说明书与视频</h3>
            <p className="text-xs text-white/60">在这里直接管理 Support 页面会读取的资料。文件先存在这台浏览器，提交并发布时会写入仓库。</p>
            {products.map((product, productIndex) => <div key={product.slug} className="space-y-3 border-t border-white/10 pt-3">
              <h4 className="text-sm font-semibold">{product.name.en || product.slug}</h4>
              {product.manuals.map((manual, manualIndex) => <div key={manual.id} className="space-y-2 rounded-lg bg-black/20 p-3">
                <BiInput label="资料名称" value={manual.title} onChange={(title) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, title }; next[productIndex] = { ...product, manuals }; setProducts(next); }} />
                <label className="block text-xs text-white/70">资料类型
                  <select className="mt-1 block w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white" value={manual.type} onChange={(e) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, type: e.target.value as typeof manual.type }; next[productIndex] = { ...product, manuals }; setProducts(next); }}>
                    <option value="installation">Quick Start / Installation PDF</option><option value="user_manual">User Guide PDF</option><option value="faq">FAQ PDF</option><option value="video">Video</option>
                  </select>
                </label>
                {manual.type === "video" ? <>
                  <MediaUploadField slotId={`support-${product.slug}-${manual.id}-video-en`} label="English video (MP4/WebM or video URL)" spec="MP4/WebM，单个不超过 48MB；提交并发布时写入仓库" kind="video" value={manual.videoUrlEn ?? ""} onChange={(url) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, videoUrlEn: url || null }; next[productIndex] = { ...product, manuals }; setProducts(next); }} />
                  <MediaUploadField slotId={`support-${product.slug}-${manual.id}-video-zh`} label="中文视频 (MP4/WebM 或视频链接)" spec="MP4/WebM，单个不超过 48MB；提交并发布时写入仓库" kind="video" value={manual.videoUrlZh ?? ""} onChange={(url) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, videoUrlZh: url || null }; next[productIndex] = { ...product, manuals }; setProducts(next); }} />
                </> : <>
                  <MediaUploadField slotId={`support-${product.slug}-${manual.id}-en`} label="English PDF" spec="PDF 文件，单个不超过 48MB；提交并发布时写入仓库" kind="pdf" value={manual.pdfFileEn ?? ""} onChange={(url) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, pdfFileEn: url || null }; next[productIndex] = { ...product, manuals }; setProducts(next); }} />
                  <MediaUploadField slotId={`support-${product.slug}-${manual.id}-zh`} label="中文 PDF" spec="PDF 文件，单个不超过 48MB；提交并发布时写入仓库" kind="pdf" value={manual.pdfFileZh ?? ""} onChange={(url) => { if (!setProducts) return; const next = [...products]; const manuals = [...product.manuals]; manuals[manualIndex] = { ...manual, pdfFileZh: url || null }; next[productIndex] = { ...product, manuals }; setProducts(next); }} />
                </>}
                <button type="button" className="text-xs text-red-300" onClick={() => { if (!setProducts) return; const next = [...products]; next[productIndex] = { ...product, manuals: product.manuals.filter((item) => item.id !== manual.id) }; setProducts(next); }}>删除此资料</button>
              </div>)}
              <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-xs" onClick={() => { if (!setProducts) return; const next = [...products]; next[productIndex] = { ...product, manuals: [...product.manuals, { id: `support-resource-${Date.now()}`, title: { en: "", zh: "" }, type: "user_manual", pdfFileEn: null, pdfFileZh: null }] }; setProducts(next); }}>新增资料</button>
            </div>)}
          </div>
          {support.faqs.map((faq, index) => (
            <div key={faq.id} className="space-y-2 border-t border-white/10 pt-3">
              <div className="flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const faqs = move(support.faqs, index, -1);
                    setDraft({ ...draft, supportPage: { ...support, faqs } });
                  }}
                >
                  上移
                </button>
                <button
                  type="button"
                  className="text-red-300"
                  onClick={() => setDraft({ ...draft, supportPage: { ...support, faqs: support.faqs.filter((item) => item.id !== faq.id) } })}
                >
                  删除
                </button>
              </div>
              <BiInput
                label="问题"
                value={faq.question}
                onChange={(question) => {
                  const faqs = support.faqs.map((item) => (item.id === faq.id ? { ...item, question } : item));
                  setDraft({ ...draft, supportPage: { ...support, faqs } });
                }}
              />
              <BiInput
                label="回答"
                value={faq.answer}
                onChange={(answer) => {
                  const faqs = support.faqs.map((item) => (item.id === faq.id ? { ...item, answer } : item));
                  setDraft({ ...draft, supportPage: { ...support, faqs } });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-white/15 px-3 py-2 text-sm"
            onClick={() =>
              setDraft({
                ...draft,
                supportPage: {
                  ...support,
                  faqs: [...support.faqs, { id: `support-faq-${Date.now()}`, question: { en: "", zh: "" }, answer: { en: "", zh: "" } }],
                },
              })
            }
          >
            新增一条问答
          </button>
        </section>
      ) : null}

      {show("settings") ? <><section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">页脚与联系邮箱</h2>
        <BiInput label="页脚标语" value={draft.footer?.tagline ?? { en: "", zh: "" }} onChange={(tagline) => setDraft({ ...draft, footer: { ...draft.footer!, tagline } })} />
        <BiInput label="隐私链接文字" value={draft.footer?.privacy ?? { en: "", zh: "" }} onChange={(privacy) => setDraft({ ...draft, footer: { ...draft.footer!, privacy } })} />
        <BiInput label="Cookie 链接文字" value={draft.footer?.cookie ?? { en: "", zh: "" }} onChange={(cookie) => setDraft({ ...draft, footer: { ...draft.footer!, cookie } })} />
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">联系邮箱</span>
          <input
            className="w-full max-w-md rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white"
            value={draft.contact.email ?? ""}
            onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })}
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">浏览器标题</h2>
        <p className="text-sm text-[#cccccc]">这里只更新打开页面后的浏览器标题和 description。这个静态站点没有按路由预渲染，社交平台抓取时仍会看到首页那一条标签。</p>
        <BiInput label="首页标题" value={draft.seo?.home.title ?? { en: "", zh: "" }} onChange={(title) => setDraft({ ...draft, seo: { ...draft.seo!, home: { ...draft.seo!.home, title } } })} />
        <BiInput
          label="首页描述"
          value={draft.seo?.home.description ?? { en: "", zh: "" }}
          onChange={(description) => setDraft({ ...draft, seo: { ...draft.seo!, home: { ...draft.seo!.home, description } } })}
        />
        <MediaUploadField
          slotId="favicon"
          label="Favicon"
          kind="image"
          spec="沿用 /favicon.svg，除非你在这里替换"
          value={draft.brand.faviconSrc ?? ""}
          onChange={(faviconSrc) => setDraft({ ...draft, brand: { ...draft.brand, faviconSrc } })}
        />
      </section></> : null}
    </div>
  );
}
