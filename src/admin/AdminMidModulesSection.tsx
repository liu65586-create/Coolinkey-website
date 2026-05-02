import { BiInput } from "../components/admin/BiInput";
import type { ManualType } from "../types/cms";
import type { MidModuleBlock, MidSlide, MidSlideMediaKind, SiteConfig } from "../types/siteConfig";
import { normalizeSiteConfig } from "../utils/normalizeSiteConfig";

/** installation / user_manual always show when present in products.json; only these may be hidden. */
const manualTypeOptions: ManualType[] = ["faq", "video"];

function emptySlide(): MidSlide {
  return { mediaUrl: "", mediaKind: "image", text: { en: "", zh: "" } };
}

export function AdminMidModulesSection({
  draft,
  setDraft,
}: {
  draft: SiteConfig;
  setDraft: (next: SiteConfig) => void;
}) {
  const d = normalizeSiteConfig(draft);

  const patchMid = (key: "a" | "b" | "d", next: MidModuleBlock) => {
    setDraft(
      normalizeSiteConfig({
        ...d,
        midModules: { ...d.midModules, [key]: next },
      })
    );
  };

  const hidden = d.manualsSection.hiddenManualTypes ?? [];

  const toggleHiddenType = (t: ManualType) => {
    const has = hidden.includes(t);
    const next = has ? hidden.filter((x) => x !== t) : [...hidden, t];
    setDraft(
      normalizeSiteConfig({
        ...d,
        manualsSection: { ...d.manualsSection, hiddenManualTypes: next },
      })
    );
  };

  const block = (key: "a" | "b" | "d", label: string) => {
    const m = d.midModules[key];
    return (
      <section key={key} className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <h2 className="text-lg font-semibold text-white">{label}</h2>
        <label className="flex items-center gap-2 text-sm text-[#cccccc]">
          <input
            type="checkbox"
            checked={m.enabled}
            onChange={(e) => patchMid(key, { ...m, enabled: e.target.checked })}
          />
          <span>启用模块（需至少 1 张有效幻灯片：媒体 URL 非空）</span>
        </label>
        <BiInput label="模块标题（可选）" value={m.title} onChange={(v) => patchMid(key, { ...m, title: v })} />
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-white/80">幻灯片</div>
          <button
            type="button"
            className="rounded-lg border border-[#00b51a] px-3 py-1.5 text-xs font-semibold text-[#00b51a]"
            onClick={() => patchMid(key, { ...m, slides: [...m.slides, emptySlide()] })}
          >
            添加幻灯片
          </button>
        </div>
        {m.slides.length === 0 ? (
          <p className="text-sm text-[#888888]">暂无幻灯片，点击「添加幻灯片」。</p>
        ) : null}
        {m.slides.map((s, idx) => (
          <div key={idx} className="space-y-3 rounded-lg border border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-red-300 hover:underline"
                onClick={() => patchMid(key, { ...m, slides: m.slides.filter((_, i) => i !== idx) })}
              >
                删除此幻灯片
              </button>
            </div>
            <label className="block text-sm text-[#cccccc]">
              <span className="mb-1 block text-xs font-semibold text-white/80">媒体 URL（图片 / GIF / mp4）</span>
              <input
                className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
                value={s.mediaUrl}
                onChange={(e) => {
                  const slides = [...m.slides];
                  slides[idx] = { ...s, mediaUrl: e.target.value };
                  patchMid(key, { ...m, slides });
                }}
              />
            </label>
            <label className="block text-sm text-[#cccccc]">
              <span className="mb-1 block text-xs font-semibold text-white/80">媒体类型</span>
              <select
                className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
                value={s.mediaKind}
                onChange={(e) => {
                  const slides = [...m.slides];
                  slides[idx] = { ...s, mediaKind: e.target.value as MidSlideMediaKind };
                  patchMid(key, { ...m, slides });
                }}
              >
                <option value="image">image（含 GIF）</option>
                <option value="video">video（mp4/webm）</option>
              </select>
            </label>
            <BiInput
              label="文案（当前幻灯片）"
              value={s.text}
              onChange={(v) => {
                const slides = [...m.slides];
                slides[idx] = { ...s, text: v };
                patchMid(key, { ...m, slides });
              }}
            />
          </div>
        ))}
      </section>
    );
  };

  return (
    <div className="space-y-10">
      <section className="space-y-3 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <h2 className="text-lg font-semibold text-white">Resources & Manuals · 可隐藏类型</h2>
        <p className="text-sm text-[#cccccc]">
          安装指南（installation）与用户手册（user_manual）若有数据则始终显示，不可在此隐藏。仅可隐藏 FAQ / 视频教程卡片；勾选后首页与产品页将不显示对应类型，其余卡片自动重排。若使用「仅本浏览器保存」，其他访客需导出 JSON 并更新仓库中的{" "}
          <code className="text-[#00b51a]">public/cms/site.config.json</code> 后部署才会生效。
        </p>
        <div className="flex flex-wrap gap-4">
          {manualTypeOptions.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-[#cccccc]">
              <input type="checkbox" checked={hidden.includes(t)} onChange={() => toggleHiddenType(t)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </section>

      {block("a", "Module A · 应用场景（左图右文）")}
      {block("b", "Module B · 测试结果（左文右图）")}
      {block("d", "Module D · 生产实拍（左图右文）")}
    </div>
  );
}
