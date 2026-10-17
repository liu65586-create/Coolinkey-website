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
          每个槽位与前台页面<strong className="text-white">一一对应</strong>。可直接选择/拖拽上传，也可粘贴 Google Drive 分享链接或其他 HTTPS 外链。
          图片槽位提供尺寸比例预设；预设仅用于展示比例参考，不会压缩或重采样原始文件。默认应优先完整显示图片，避免裁掉产品细节。
        </p>
        <p className="mt-2 text-amber-200/90">
          发布说明：当前“保存到本浏览器”仅供本机预览，不会自动更新所有访客看到的网站。Google Drive 文件需允许访客访问；视频嵌入链接需符合对应播放器格式。
          线上直接上传还需要配置持久化媒体存储（例如对象存储/CDN）及服务端上传接口，不能依赖 Vercel 临时文件系统。
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
