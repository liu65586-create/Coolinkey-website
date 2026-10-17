import { useEffect, useMemo, useState } from "react";
import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { collectReferences } from "../utils/contentRefs";
import { deleteMediaBlob, listMediaMeta, saveMediaMeta, type MediaMeta } from "../utils/mediaStore";
import { importMediaFile } from "../utils/mediaUpload";

export function AdminMediaLibrary({ site, products }: { site: SiteConfig | null; products: CmsProduct[] }) {
  const [rows, setRows] = useState<MediaMeta[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const reload = () => {
    void listMediaMeta().then(setRows);
  };

  useEffect(() => {
    reload();
    const onMedia = () => reload();
    window.addEventListener("coolinkey-media", onMedia);
    return () => window.removeEventListener("coolinkey-media", onMedia);
  }, []);

  const refs = useMemo(() => (site ? collectReferences(site, products) : new Map<string, string[]>()), [site, products]);
  const visible = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return row.path.toLowerCase().includes(q) || row.name.toLowerCase().includes(q) || row.altZh.includes(q) || row.altEn.toLowerCase().includes(q);
  });

  return (
    <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
      <div>
        <h2 className="text-lg font-semibold">本机媒体库</h2>
        <p className="mt-1 text-sm text-[#cccccc]">这里的文件只在当前浏览器里。完整导出包会带上原始文件。仓库里原有的图片不会出现在这个列表，除非你重新导入。</p>
      </div>
      <input
        className="w-full rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
        placeholder="搜索路径、文件名或 alt"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {message ? <p className="text-sm text-[#f0d48a]">{message}</p> : null}
      {visible.length === 0 ? <p className="text-sm text-[#888]">媒体库是空的。</p> : null}
      <div className="space-y-4">
        {visible.map((row) => {
          const used = refs.get(row.path) ?? [];
          return (
            <article key={row.path} className="space-y-3 rounded-lg border border-white/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-white">{row.path}</p>
                  <p className="mt-1 text-xs text-[#888]">
                    {row.mime || "未知类型"} · {Math.ceil(row.size / 1024)} KB
                    {row.width ? ` · ${row.width}×${row.height}` : ""}
                    {row.duration ? ` · ${Math.round(row.duration)}s` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs text-[#9fd]"
                  onClick={() => void navigator.clipboard.writeText(row.path)}
                >
                  复制路径
                </button>
              </div>
              <p className="text-xs text-[#cccccc]">{used.length ? `引用：${used.join("、")}` : "当前草稿未引用"}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white"
                  value={row.altEn}
                  placeholder="alt · EN"
                  onChange={(e) => {
                    const next = { ...row, altEn: e.target.value };
                    setRows((list) => list.map((item) => (item.path === row.path ? next : item)));
                    void saveMediaMeta(next);
                  }}
                />
                <input
                  className="rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white"
                  value={row.altZh}
                  placeholder="alt · 中文"
                  onChange={(e) => {
                    const next = { ...row, altZh: e.target.value };
                    setRows((list) => list.map((item) => (item.path === row.path ? next : item)));
                    void saveMediaMeta(next);
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-xs">
                  替换原文件（路径不变）
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void importMediaFile(file, row.path)
                        .then(() => setMessage(`已替换 ${row.path}。请重新导出变更包。`))
                        .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "替换失败"));
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-red-200"
                  onClick={() => {
                    if (used.length) {
                      setMessage(`不能删除，仍被引用：${used.join("、")}`);
                      return;
                    }
                    if (!confirm(`删除本机文件 ${row.path}？`)) return;
                    void deleteMediaBlob(row.path).then(() => {
                      setMessage(`已从本机媒体库删除 ${row.path}`);
                      reload();
                    });
                  }}
                >
                  删除未引用文件
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
