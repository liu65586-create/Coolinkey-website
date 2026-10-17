import { useState } from "react";
import { MediaUploadField } from "../components/admin/MediaUploadField";
import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { buildMediaSlots } from "./mediaSlots";

export function AdminMediaPanel({
  site,
  products,
  onSite,
  onProducts,
}: {
  site: SiteConfig | null;
  products: CmsProduct[];
  onSite: (next: SiteConfig) => void;
  onProducts: (next: CmsProduct[]) => void;
}) {
  const [filter, setFilter] = useState("");
  if (!site) return <p className="text-[#cccccc]">加载媒体配置…</p>;

  const slots = buildMediaSlots(site, products, onSite, onProducts);
  const groups = [...new Set(slots.map((slot) => slot.group))];
  const q = filter.trim().toLowerCase();

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/12 bg-[#252a33] p-4 text-sm text-[#cccccc]">
        <p>
          槽位和前台引用的是同一份草稿。选择文件会放进本机媒体库，并写成仓库相对路径。线上更新请用「提交并发布」。
        </p>
      </div>

      <input
        className="w-full rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
        placeholder="搜索槽位名称…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {groups.map((group) => {
        const groupSlots = slots.filter(
          (slot) => slot.group === group && (!q || slot.label.toLowerCase().includes(q) || group.toLowerCase().includes(q))
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
    </div>
  );
}
