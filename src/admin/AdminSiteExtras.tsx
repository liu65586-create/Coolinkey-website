import { SITE_PATHS } from "../cms/sitePaths";
import { BiInput } from "../components/admin/BiInput";
import { FitFocusFields } from "../components/admin/FitFocusFields";
import { MediaUploadField } from "../components/admin/MediaUploadField";
import type { HomeSectionId, SiteConfig } from "../types/siteConfig";

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

export function AdminSiteExtras({ draft, setDraft }: { draft: SiteConfig; setDraft: (next: SiteConfig) => void }) {
  const sections = draft.homeSections ?? [];
  const support = draft.supportPage;
  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
        <h2 className="text-lg font-semibold">导航</h2>
        <p className="text-sm text-[#cccccc]">可以改中英文名称。路径只能选现有页面，避免把导航指到不存在的地址。</p>
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
      </section>

      <section className="space-y-3 rounded-xl border border-white/12 bg-[#252a33] p-5">
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

      {support ? (
        <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
          <h2 className="text-lg font-semibold">Support 页面文案</h2>
          <p className="text-sm text-[#cccccc]">这里是页面上的故障问答。PDF 形式的 FAQ 说明书在「产品与说明书」里按类型管理，两者不是同一份数据。</p>
          <BiInput label="标题" value={support.title} onChange={(title) => setDraft({ ...draft, supportPage: { ...support, title } })} />
          <BiInput label="副标题" value={support.subtitle} onChange={(subtitle) => setDraft({ ...draft, supportPage: { ...support, subtitle } })} />
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

      <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
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
        <p className="text-xs text-[#888]">微信图标保持占位，不能加链接。</p>
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
      </section>
    </div>
  );
}
