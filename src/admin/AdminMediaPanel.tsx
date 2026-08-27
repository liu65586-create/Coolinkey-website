import { useEffect, useMemo, useState } from "react";
import { MediaUploadField } from "../components/admin/MediaUploadField";
import { useCms } from "../context/CmsContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { normalizeSiteConfig } from "../utils/normalizeSiteConfig";
import { buildMediaSlots } from "./mediaSlots";

export function AdminMediaPanel() {
  const { config, saveLocalOverride, loading: siteLoading } = useSiteConfig();
  const { products, saveLocalProducts, loading: cmsLoading } = useCms();

  const [siteDraft, setSiteDraft] = useState<SiteConfig | null>(null);
  const [productsDraft, setProductsDraft] = useState<CmsProduct[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (config) setSiteDraft(normalizeSiteConfig(structuredClone(config)));
  }, [config]);

  useEffect(() => {
    setProductsDraft(structuredClone(products));
  }, [products]);

  const siteDirty = useMemo(
    () => siteDraft && config && JSON.stringify(siteDraft) !== JSON.stringify(config),
    [siteDraft, config]
  );
  const productsDirty = useMemo(
    () => JSON.stringify({ products: productsDraft }) !== JSON.stringify({ products }),
    [productsDraft, products]
  );

  if (siteLoading || cmsLoading || !siteDraft) {
    return <p className="text-[#cccccc]">加载媒体配置…</p>;
  }

  const slots = buildMediaSlots(
    siteDraft,
    productsDraft,
    (next) => setSiteDraft(normalizeSiteConfig(next)),
    setProductsDraft
  );

  const groups = [...new Set(slots.map((s) => s.group))];
  const q = filter.trim().toLowerCase();

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/12 bg-[#252a33] p-4 text-sm text-[#cccccc]">
        <p>
          每个槽位与前台页面<strong className="text-white">一一对应</strong>。拖拽或选择文件上传后，路径会自动写入配置。
          本地开发（<code className="text-[#00e676]">npm run dev</code>）会同时写入{" "}
          <code className="text-[#00e676]">public/uploads/</code>；线上 Admin 需将文件放入{" "}
          <code className="text-[#00e676]">public/</code> 并推送，或使用 https 外链。
          保存到浏览器后可立即预览。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
          placeholder="搜索槽位名称…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-[#00e676] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00c853] disabled:opacity-50"
          disabled={!siteDirty && !productsDirty}
          onClick={() => {
            if (siteDirty) saveLocalOverride(normalizeSiteConfig(siteDraft));
            if (productsDirty) saveLocalProducts({ products: productsDraft });
          }}
        >
          保存到本浏览器（站点 + 产品）
        </button>
      </div>

      {groups.map((group) => {
        const groupSlots = slots.filter(
          (s) => s.group === group && (!q || s.label.toLowerCase().includes(q) || group.toLowerCase().includes(q))
        );
        if (!groupSlots.length) return null;
        return (
          <section key={group} className="space-y-4">
            <h2 className="text-base font-semibold text-white">{group}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {groupSlots.map((slot) => (
                <MediaUploadField
                  key={slot.id}
                  slotId={slot.id}
                  label={slot.label}
                  spec={slot.spec}
                  kind={slot.kind}
                  value={slot.getValue()}
                  onChange={slot.setValue}
                />
              ))}
            </div>
          </section>
        );
      })}

      {q && groups.every((g) => !slots.some((s) => s.group === g && (s.label.toLowerCase().includes(q) || g.toLowerCase().includes(q)))) ? (
        <p className="text-sm text-[#888]">无匹配槽位</p>
      ) : null}
    </div>
  );
}
