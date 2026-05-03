import { useEffect, useMemo, useState } from "react";
import { BiInput } from "../components/admin/BiInput";
import { useCms } from "../context/CmsContext";
import type { CmsManual, CmsPayload, CmsProduct, ManualType } from "../types/cms";

const manualTypes: ManualType[] = ["installation", "user_manual", "faq", "video"];

function emptyProduct(): CmsProduct {
  return {
    slug: "new-product",
    name: { en: "", zh: "" },
    shortDescription: { en: "", zh: "" },
    mainImage: "",
    galleryImages: [],
    specs: [],
    purchaseLinkEn: "https://www.amazon.com/",
    purchaseLinkZh: "https://www.jd.com/",
    manuals: [],
  };
}

function emptyManual(): CmsManual {
  return {
    id: "manual",
    title: { en: "", zh: "" },
    type: "user_manual",
    pdfFileEn: null,
    pdfFileZh: null,
    videoUrlEn: "",
    videoUrlZh: "",
  };
}

function emptySpec() {
  return {
    key: { en: "", zh: "" },
    value: { en: "", zh: "" },
  };
}

export function AdminProductsPanel() {
  const { products, loading, error, saveLocalProducts, resetProductsToRepoFile } = useCms();
  const [draft, setDraft] = useState<CmsProduct[]>([]);
  const [idx, setIdx] = useState(0);
  const [rawJson, setRawJson] = useState("");

  useEffect(() => {
    setDraft(structuredClone(products));
    setRawJson(JSON.stringify({ products }, null, 2));
  }, [products]);

  const dirty = useMemo(
    () => JSON.stringify({ products: draft }) !== JSON.stringify({ products }),
    [draft, products]
  );

  const p = draft[idx];

  const setProduct = (next: CmsProduct) => {
    setDraft((list) => list.map((x, i) => (i === idx ? next : x)));
  };

  const validate = (): string | null => {
    const slugs = new Set<string>();
    for (const pr of draft) {
      const s = pr.slug.trim();
      if (!s) return "Each product needs a non-empty slug.";
      if (slugs.has(s)) return `Duplicate slug: ${s}`;
      slugs.add(s);
    }
    return null;
  };

  const onSaveLocal = () => {
    const msg = validate();
    if (msg) {
      alert(msg);
      return;
    }
    saveLocalProducts({ products: draft });
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify({ products: draft }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as CmsPayload;
    if (!parsed.products || !Array.isArray(parsed.products)) {
      alert("Invalid products.json: missing products array");
      return;
    }
    setDraft(structuredClone(parsed.products));
    setIdx(0);
    setRawJson(JSON.stringify(parsed, null, 2));
  };

  const applyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJson) as CmsPayload;
      if (!parsed.products || !Array.isArray(parsed.products)) throw new Error("bad");
      setDraft(structuredClone(parsed.products));
      setIdx(0);
    } catch {
      alert("Invalid JSON");
    }
  };

  if (loading && draft.length === 0) {
    return <p className="text-[#cccccc]">{error ?? "Loading products…"}</p>;
  }

  if (!p) {
    return (
      <div className="space-y-4">
        <p className="text-[#cccccc]">No products in catalog. Add one below.</p>
        <button
          type="button"
          className="rounded-lg bg-[#00e676] px-4 py-2 font-semibold text-white"
          onClick={() => setDraft([emptyProduct()])}
        >
          Add first product
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-4 text-sm text-[#cccccc]">
        <p>
          编辑 <code className="text-[#00e676]">public/cms/products.json</code> 的等价数据：主图/轮播、多语言名称与描述、规格表、购买链接、说明书（PDF 与视频均可填<strong className="text-white">完整 https 链接</strong>
          ，无需上传到 GitHub；也可继续用 <code className="text-[#00e676]">/manuals/…</code> 相对路径指向仓库内文件）。保存到浏览器后仅本机预览；<strong className="text-white">Export</strong> 下载的文件请覆盖仓库中的{" "}
          <code className="text-[#00e676]">products.json</code> 并推送以更新线上。
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">选择产品</span>
          <select
            className="min-w-[220px] rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
          >
            {draft.map((pr, i) => (
              <option key={i} value={i}>
                {pr.slug} — {pr.name.zh || pr.name.en || "(untitled)"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded-lg border border-[#00e676] px-3 py-2 text-sm font-semibold text-[#00e676] hover:bg-[rgba(0,230,118,0.1)]"
          onClick={() => {
            setDraft((list) => {
              const next = [...list, emptyProduct()];
              setTimeout(() => setIdx(next.length - 1), 0);
              return next;
            });
          }}
        >
          新增产品
        </button>
        <button
          type="button"
          className="rounded-lg border border-[rgba(255,255,255,0.15)] px-3 py-2 text-sm text-[#cccccc] hover:border-red-400 hover:text-red-300"
          onClick={() => {
            if (!confirm("Delete this product from the draft?")) return;
            setDraft((list) => {
              const next = list.filter((_, i) => i !== idx);
              setIdx(Math.min(idx, Math.max(0, next.length - 1)));
              return next;
            });
          }}
          disabled={draft.length <= 1}
        >
          删除当前产品
        </button>
      </div>

      <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <h3 className="text-base font-semibold text-white">基础信息</h3>
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">Slug（URL 段，唯一）</span>
          <input
            className="w-full max-w-md rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
            value={p.slug}
            onChange={(e) => setProduct({ ...p, slug: e.target.value })}
          />
        </label>
        <BiInput label="产品名称" value={p.name} onChange={(v) => setProduct({ ...p, name: v })} />
        <BiInput label="简短描述" value={p.shortDescription} onChange={(v) => setProduct({ ...p, shortDescription: v })} />
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">主图 URL（https 外链或 / 开头的站内路径）</span>
          <input
            className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
            value={p.mainImage}
            placeholder="https://cdn.example.com/hero.jpg"
            onChange={(e) => setProduct({ ...p, mainImage: e.target.value })}
          />
        </label>
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">购买链接 · 海外（Amazon 等）</span>
          <input
            className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
            value={p.purchaseLinkEn}
            onChange={(e) => setProduct({ ...p, purchaseLinkEn: e.target.value })}
          />
        </label>
        <label className="block text-sm text-[#cccccc]">
          <span className="mb-1 block text-xs font-semibold text-white/80">购买链接 · 中国（京东/天猫等）</span>
          <input
            className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
            value={p.purchaseLinkZh}
            onChange={(e) => setProduct({ ...p, purchaseLinkZh: e.target.value })}
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">轮播图 URL 列表</h3>
          <button
            type="button"
            className="rounded-lg border border-[#00e676] px-3 py-1.5 text-xs font-semibold text-[#00e676]"
            onClick={() => setProduct({ ...p, galleryImages: [...p.galleryImages, ""] })}
          >
            添加一张
          </button>
        </div>
        {p.galleryImages.length === 0 ? (
          <p className="text-sm text-[#888888]">暂无轮播图（可只使用主图）</p>
        ) : (
          <div className="space-y-2">
            {p.galleryImages.map((url, gi) => (
              <div key={gi} className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                  value={url}
                  placeholder="https://... or /images/foo.jpg"
                  onChange={(e) => {
                    const next = [...p.galleryImages];
                    next[gi] = e.target.value;
                    setProduct({ ...p, galleryImages: next });
                  }}
                />
                <button
                  type="button"
                  className="rounded-lg border border-[rgba(255,255,255,0.15)] px-2 text-sm hover:border-red-400"
                  onClick={() => {
                    const next = p.galleryImages.filter((_, i) => i !== gi);
                    setProduct({ ...p, galleryImages: next });
                  }}
                >
                  删
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">技术规格</h3>
          <button
            type="button"
            className="rounded-lg border border-[#00e676] px-3 py-1.5 text-xs font-semibold text-[#00e676]"
            onClick={() => setProduct({ ...p, specs: [...p.specs, emptySpec()] })}
          >
            添加一行
          </button>
        </div>
        {p.specs.length === 0 ? (
          <p className="text-sm text-[#888888]">暂无规格</p>
        ) : (
          <div className="space-y-6">
            {p.specs.map((row, si) => (
              <div key={si} className="space-y-3 border-t border-[rgba(255,255,255,0.08)] pt-4 first:border-t-0 first:pt-0">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-red-300 hover:underline"
                    onClick={() => setProduct({ ...p, specs: p.specs.filter((_, i) => i !== si) })}
                  >
                    删除此行
                  </button>
                </div>
                <BiInput label="规格项名称" value={row.key} onChange={(v) => {
                  const next = [...p.specs];
                  next[si] = { ...row, key: v };
                  setProduct({ ...p, specs: next });
                }} />
                <BiInput label="规格项值" value={row.value} onChange={(v) => {
                  const next = [...p.specs];
                  next[si] = { ...row, value: v };
                  setProduct({ ...p, specs: next });
                }} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">说明书与视频</h3>
          <button
            type="button"
            className="rounded-lg border border-[#00e676] px-3 py-1.5 text-xs font-semibold text-[#00e676]"
            onClick={() => setProduct({ ...p, manuals: [...p.manuals, emptyManual()] })}
          >
            添加一条手册/视频
          </button>
        </div>
        {p.manuals.length === 0 ? (
          <p className="text-sm text-[#888888]">暂无说明书条目</p>
        ) : (
          p.manuals.map((m, mi) => (
            <div key={mi} className="space-y-3 rounded-lg border border-[rgba(255,255,255,0.08)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#00e676]">条目 {mi + 1}</span>
                <button
                  type="button"
                  className="text-xs text-red-300 hover:underline"
                  onClick={() => setProduct({ ...p, manuals: p.manuals.filter((_, i) => i !== mi) })}
                >
                  删除
                </button>
              </div>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">内部 ID（唯一键）</span>
                <input
                  className="w-full max-w-md rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                  value={m.id}
                  onChange={(e) => {
                    const next = [...p.manuals];
                    next[mi] = { ...m, id: e.target.value };
                    setProduct({ ...p, manuals: next });
                  }}
                />
              </label>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">类型</span>
                <select
                  className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                  value={m.type}
                  onChange={(e) => {
                    const next = [...p.manuals];
                    next[mi] = { ...m, type: e.target.value as ManualType };
                    setProduct({ ...p, manuals: next });
                  }}
                >
                  {manualTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <BiInput
                label="标题（卡片上显示）"
                value={m.title}
                onChange={(v) => {
                  const next = [...p.manuals];
                  next[mi] = { ...m, title: v };
                  setProduct({ ...p, manuals: next });
                }}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-[#cccccc]">
                  <span className="mb-1 block text-xs font-semibold text-white/80">PDF · EN（https 外链或 /manuals/…）</span>
                  <input
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                    value={m.pdfFileEn ?? ""}
                    placeholder="https://…/manual-en.pdf"
                    onChange={(e) => {
                      const next = [...p.manuals];
                      const v = e.target.value.trim();
                      next[mi] = { ...m, pdfFileEn: v ? v : null };
                      setProduct({ ...p, manuals: next });
                    }}
                  />
                </label>
                <label className="block text-sm text-[#cccccc]">
                  <span className="mb-1 block text-xs font-semibold text-white/80">PDF · 中文（https 外链或 /manuals/…）</span>
                  <input
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                    value={m.pdfFileZh ?? ""}
                    placeholder="https://…/manual-zh.pdf"
                    onChange={(e) => {
                      const next = [...p.manuals];
                      const v = e.target.value.trim();
                      next[mi] = { ...m, pdfFileZh: v ? v : null };
                      setProduct({ ...p, manuals: next });
                    }}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-[#cccccc]">
                  <span className="mb-1 block text-xs font-semibold text-white/80">视频嵌入 URL · EN（YouTube embed 等）</span>
                  <input
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                    value={m.videoUrlEn ?? ""}
                    onChange={(e) => {
                      const next = [...p.manuals];
                      next[mi] = { ...m, videoUrlEn: e.target.value };
                      setProduct({ ...p, manuals: next });
                    }}
                  />
                </label>
                <label className="block text-sm text-[#cccccc]">
                  <span className="mb-1 block text-xs font-semibold text-white/80">视频嵌入 URL · 中文（B站 embed 等）</span>
                  <input
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                    value={m.videoUrlZh ?? ""}
                    onChange={(e) => {
                      const next = [...p.manuals];
                      next[mi] = { ...m, videoUrlZh: e.target.value };
                      setProduct({ ...p, manuals: next });
                    }}
                  />
                </label>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
        <h3 className="text-base font-semibold text-white">Raw JSON（整块 products）</h3>
        <textarea
          className="min-h-[280px] w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black p-3 font-mono text-xs text-white outline-none focus:border-[#00e676]"
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg border border-[#00e676] px-3 py-2 text-sm font-semibold text-[#00e676] hover:bg-[rgba(0,230,118,0.1)]"
          onClick={applyRawJson}
        >
          应用 JSON 到表单
        </button>
      </section>

      <div className="flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.1)] pt-6">
        <button
          type="button"
          className="rounded-lg bg-[#00e676] px-4 py-2 font-semibold text-white hover:bg-[#00c853] disabled:opacity-50"
          disabled={!dirty}
          onClick={onSaveLocal}
        >
          保存到本浏览器
        </button>
        <button type="button" className="rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm" onClick={onExport}>
          Export products.json
        </button>
        <label className="cursor-pointer rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm hover:border-[#00e676]">
          Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={(e) => void onImportFile(e.target.files?.[0] ?? null)} />
        </label>
        <button
          type="button"
          className="rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm"
          onClick={() => void resetProductsToRepoFile()}
        >
          重置为仓库文件（清除浏览器覆盖）
        </button>
      </div>
    </div>
  );
}
