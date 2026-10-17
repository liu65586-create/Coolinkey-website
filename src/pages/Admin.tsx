import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminMediaLibrary } from "../admin/AdminMediaLibrary";
import { AdminMediaPanel } from "../admin/AdminMediaPanel";
import { AdminMidModulesSection } from "../admin/AdminMidModulesSection";
import { AdminProductsPanel } from "../admin/AdminProductsPanel";
import { AdminPublishBar } from "../admin/AdminPublishBar";
import { AdminSiteExtras } from "../admin/AdminSiteExtras";
import { BiInput } from "../components/admin/BiInput";
import { MediaUploadField } from "../components/admin/MediaUploadField";
import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";
import { validateContent } from "../utils/contentRefs";
import { buildContentZip, downloadBlob, restoreContentZip } from "../utils/exportBundle";
import { normalizeProducts } from "../utils/normalizeProducts";
import { normalizeSiteConfig } from "../utils/normalizeSiteConfig";
import { fingerprintContent, readReleaseStatus, writeReleaseStatus } from "../utils/releaseStatus";

const SITE_KEY = "coolinkey_site_config_full";
const PRODUCTS_KEY = "coolinkey_products_override";

export function Admin() {
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [products, setProducts] = useState<CmsProduct[]>([]);
  const [productsEpoch, setProductsEpoch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mainTab, setMainTab] = useState<"site" | "products" | "media">("site");
  const [tab, setTab] = useState<"content" | "json">("content");
  const [rawJson, setRawJson] = useState("");
  const [hash, setHash] = useState("");
  const [release, setRelease] = useState(readReleaseStatus);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  const persistDraft = useCallback((site: SiteConfig, nextProducts: CmsProduct[]) => {
    const normalizedSite = normalizeSiteConfig(site);
    const normalizedProducts = normalizeProducts(nextProducts);
    localStorage.setItem(SITE_KEY, JSON.stringify(normalizedSite));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify({ products: normalizedProducts }));
    window.dispatchEvent(new Event("coolinkey-site-config"));
    window.dispatchEvent(new Event("coolinkey-products-config"));
    setHasLocalDraft(true);
    return { normalizedSite, normalizedProducts };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [siteRes, productRes] = await Promise.all([
        fetch("/cms/site.config.json", { cache: "no-store" }),
        fetch("/cms/products.json", { cache: "no-store" }),
      ]);
      if (!siteRes.ok || !productRes.ok) throw new Error("无法读取仓库里的配置文件");
      const repoSite = (await siteRes.json()) as SiteConfig;
      const repoProducts = (await productRes.json()) as { products: CmsProduct[] };
      const localSiteRaw = localStorage.getItem(SITE_KEY);
      const localProductsRaw = localStorage.getItem(PRODUCTS_KEY);
      const site = normalizeSiteConfig(localSiteRaw ? (JSON.parse(localSiteRaw) as SiteConfig) : repoSite);
      const productPayload = localProductsRaw
        ? (JSON.parse(localProductsRaw) as { products: CmsProduct[] })
        : repoProducts;
      const nextProducts = normalizeProducts(productPayload.products ?? []);
      setDraft(site);
      setRawJson(JSON.stringify(site, null, 2));
      setProducts(nextProducts);
      setProductsEpoch((value) => value + 1);
      setHasLocalDraft(Boolean(localSiteRaw || localProductsRaw));
      setHash(await fingerprintContent(site, nextProducts));
      setRelease(readReleaseStatus());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!draft) return;
      const saved = localStorage.getItem(SITE_KEY);
      const current = JSON.stringify(normalizeSiteConfig(draft));
      if (saved !== current) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    const timer = window.setTimeout(() => {
      void fingerprintContent(draft, products).then(setHash);
    }, 250);
    const onMedia = () => {
      void fingerprintContent(draft, products).then(setHash);
    };
    window.addEventListener("coolinkey-media", onMedia);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("coolinkey-media", onMedia);
    };
  }, [draft, products]);

  const status = useMemo(() => {
    if (!hash) return { label: "正在计算", detail: "正在比较草稿和上次导出。", canCommit: false, canDeploy: false };
    if (release.exportHash !== hash) {
      return {
        label: hasLocalDraft ? "有未导出修改" : "与仓库文件一致，尚未导出",
        detail: "本地草稿不会出现在普通访问里。要给访客看，请导出完整变更包，放回仓库并重新部署。",
        canCommit: false,
        canDeploy: false,
      };
    }
    if (release.deployedAt) {
      return {
        label: "已手动确认部署",
        detail: `你在 ${release.deployedAt} 确认线上已更新。如果之后又改了内容，这个状态会取消。`,
        canCommit: true,
        canDeploy: true,
      };
    }
    if (release.committedAt) {
      return {
        label: "已手动确认提交",
        detail: `你在 ${release.committedAt} 确认已经提交 Git。后台没有检查 GitHub。`,
        canCommit: true,
        canDeploy: true,
      };
    }
    return {
      label: "已导出，待提交",
      detail: release.exportedAt ? `完整变更包导出于 ${release.exportedAt}。请按包内说明提交并部署。` : "已导出。",
      canCommit: true,
      canDeploy: false,
    };
  }, [hash, hasLocalDraft, release]);

  const requireDraft = () => {
    if (!draft) throw new Error("配置还没加载完");
    const site = normalizeSiteConfig(draft);
    const nextProducts = normalizeProducts(products);
    const problems = validateContent(site, nextProducts);
    if (problems.length) throw new Error(problems.join("\n"));
    return { site, nextProducts };
  };

  const onSaveDraft = () => {
    if (!draft) return;
    try {
      const { site, nextProducts } = requireDraft();
      persistDraft(site, nextProducts);
      setDraft(site);
      setProducts(nextProducts);
      setNotice("已保存到本机草稿。线上官网没有变化。");
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    }
  };

  const onExport = async (mode: "json" | "full") => {
    setBusy(true);
    setError(null);
    try {
      const { site, nextProducts } = requireDraft();
      persistDraft(site, nextProducts);
      setDraft(site);
      setProducts(nextProducts);
      const blob = await buildContentZip({ site, products: nextProducts, mode });
      downloadBlob(blob, mode === "full" ? "coolinkey-content-bundle.zip" : "coolinkey-config-json.zip");
      if (mode === "full") {
        const exportHash = await fingerprintContent(site, nextProducts);
        const next = { exportHash, exportedAt: new Date().toISOString(), committedAt: null, deployedAt: null };
        writeReleaseStatus(next);
        setRelease(next);
        setHash(exportHash);
        setNotice("已下载完整变更包。这还不是已发布。");
      } else {
        setNotice("已下载配置 JSON。这个包不含新媒体文件。");
      }
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "导出失败");
    } finally {
      setBusy(false);
    }
  };

  const onImportZip = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const restored = await restoreContentZip(file);
      persistDraft(restored.site, restored.products);
      setDraft(restored.site);
      setProducts(restored.products);
      setProductsEpoch((value) => value + 1);
      setRawJson(JSON.stringify(restored.site, null, 2));
      const next = { exportHash: null, exportedAt: null, committedAt: null, deployedAt: null };
      writeReleaseStatus(next);
      setRelease(next);
      setNotice("已从变更包恢复到本机草稿。请再导出一次，确认包和当前内容一致。");
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "恢复失败");
    } finally {
      setBusy(false);
    }
  };

  const mark = (kind: "committed" | "deployed") => {
    if (release.exportHash !== hash) return;
    const next = {
      ...release,
      committedAt: kind === "committed" || kind === "deployed" ? new Date().toISOString() : release.committedAt,
      deployedAt: kind === "deployed" ? new Date().toISOString() : release.deployedAt,
    };
    if (kind === "committed") next.deployedAt = null;
    writeReleaseStatus(next);
    setRelease(next);
    setNotice(kind === "committed" ? "已记下：你确认提交过 Git。后台没有核对远程仓库。" : "已记下：你确认线上已经更新。后台没有核对 Vercel。");
  };

  if (loading || !draft) {
    return (
      <div className="admin-shell px-4 py-16">
        <p className="text-[#cccccc]">{error ?? "Loading…"}</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="border-b border-[rgba(255,255,255,0.1)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[#00b51a]">COOLINKEY</div>
            <div className="text-lg font-bold">静态内容编辑</div>
          </div>
          <Link className="rounded-lg border border-[rgba(255,255,255,0.15)] px-3 py-2 text-sm hover:border-[#00b51a]" to="/">
            查看线上内容
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <AdminPublishBar
          statusLabel={status.label}
          detail={notice ? `${status.detail} ${notice}` : status.detail}
          error={error}
          busy={busy}
          canCommit={status.canCommit}
          canDeploy={status.canDeploy}
          onSaveDraft={onSaveDraft}
          onPreview={() => {
            onSaveDraft();
            window.open("/?draft=1", "_blank", "noopener");
          }}
          onExportJson={() => void onExport("json")}
          onExportFull={() => void onExport("full")}
          onImportZip={(file) => void onImportZip(file)}
          onMarkCommitted={() => mark("committed")}
          onMarkDeployed={() => mark("deployed")}
          onClearDraft={() => {
            if (!confirm("清除本机草稿？未导出的修改会丢失。")) return;
            localStorage.removeItem(SITE_KEY);
            localStorage.removeItem(PRODUCTS_KEY);
            writeReleaseStatus({ exportHash: null, exportedAt: null, committedAt: null, deployedAt: null });
            void load();
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mainTab === "site" ? "bg-[#00e676] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setMainTab("site")}
          >
            站点与文案
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mainTab === "products" ? "bg-[#00e676] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setMainTab("products")}
          >
            产品与说明书
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mainTab === "media" ? "bg-[#00e676] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setMainTab("media")}
          >
            媒体管理
          </button>
        </div>

        {mainTab === "products" ? (
          <AdminProductsPanel key={productsEpoch} products={products} onChange={setProducts} />
        ) : null}

        {mainTab === "media" ? (
          <div className="space-y-8">
            <AdminMediaLibrary site={draft} products={products} />
            <AdminMediaPanel site={draft} products={products} onSite={setDraft} onProducts={setProducts} />
          </div>
        ) : null}

        {mainTab === "site" && draft ? (
          <>
        <AdminSiteExtras draft={draft} setDraft={setDraft} products={products} setProducts={setProducts} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === "content" ? "bg-[#00e676] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setTab("content")}
          >
            Forms
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === "json" ? "bg-[#00e676] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setTab("json")}
          >
            Raw JSON
          </button>
        </div>

        {tab === "content" ? (
          <div className="space-y-10">
            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Branding</h2>
              <MediaUploadField
                slotId="brand-logo"
                label="Logo"
                spec="SVG 或 PNG 透明底"
                kind="image"
                value={draft.brand.logoSrc}
                onChange={(url) => setDraft({ ...draft, brand: { ...draft.brand, logoSrc: url } })}
              />
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Logo alt text</span>
                <input
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                  value={draft.brand.logoAlt}
                  onChange={(e) => setDraft({ ...draft, brand: { ...draft.brand, logoAlt: e.target.value } })}
                />
              </label>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Logo max height (px)</span>
                <input
                  type="number"
                  className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                  value={draft.brand.logoMaxHeightPx}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      brand: { ...draft.brand, logoMaxHeightPx: Number(e.target.value) || 30 },
                    })
                  }
                />
              </label>
            </section>

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Home modules</h2>
              {(
                [
                  ["homeHero", "Hero"],
                  ["homeFeatures", "Feature strip"],
                  ["homeManuals", "Manual cards"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-sm text-[#cccccc]">
                  <input
                    type="checkbox"
                    checked={draft.modules[key]}
                    onChange={(e) =>
                      setDraft({ ...draft, modules: { ...draft.modules, [key]: e.target.checked } })
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </section>

            <AdminMidModulesSection draft={draft} setDraft={setDraft} />

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Hero</h2>
              <BiInput label="Title" value={draft.hero.title} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, title: v } })} />
              <BiInput label="Subtitle" value={draft.hero.subtitle} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: v } })} />
              <MediaUploadField
                slotId="hero-background"
                label="Hero 背景图 / 动图"
                spec="2400×1350 或 1920×1080；GIF/WebP 动图可用"
                kind="image"
                value={draft.hero.backgroundImageUrl}
                onChange={(url) => setDraft({ ...draft, hero: { ...draft.hero, backgroundImageUrl: url } })}
              />
              <label className="flex items-center gap-3 text-sm text-[#cccccc]">
                <input
                  type="checkbox"
                  checked={draft.hero.overlayUsesProductImage}
                  onChange={(e) =>
                    setDraft({ ...draft, hero: { ...draft.hero, overlayUsesProductImage: e.target.checked } })
                  }
                />
                <span>Use default product image as overlay when background URL is empty</span>
              </label>
            </section>

            <section className="space-y-6 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Feature strip</h2>
              {draft.features.map((f, idx) => (
                <div key={idx} className="space-y-3 border-t border-[rgba(255,255,255,0.08)] pt-4 first:border-t-0 first:pt-0">
                  <label className="block text-sm text-[#cccccc]">
                    <span className="mb-1 block text-xs font-semibold text-white/80">Icon</span>
                    <select
                      className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
                      value={f.icon}
                      onChange={(e) => {
                        const next = [...draft.features];
                        next[idx] = { ...f, icon: e.target.value as SiteConfig["features"][number]["icon"] };
                        setDraft({ ...draft, features: next });
                      }}
                    >
                      <option value="water">water</option>
                      <option value="fingerprint">fingerprint</option>
                      <option value="chain">chain</option>
                      <option value="dual">dual</option>
                      <option value="share">share</option>
                      <option value="logs">logs</option>
                      <option value="battery">battery</option>
                    </select>
                  </label>
                  <BiInput
                    label={`Feature ${idx + 1} title`}
                    value={f.title}
                    onChange={(v) => {
                      const next = [...draft.features];
                      next[idx] = { ...f, title: v };
                      setDraft({ ...draft, features: next });
                    }}
                  />
                  <BiInput
                    label={`Feature ${idx + 1} description`}
                    value={f.description}
                    onChange={(v) => {
                      const next = [...draft.features];
                      next[idx] = { ...f, description: v };
                      setDraft({ ...draft, features: next });
                    }}
                  />
                </div>
              ))}
            </section>

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Manuals section heading</h2>
              <BiInput
                label="Home manuals heading"
                value={draft.manualsSection.heading}
                onChange={(v) =>
                  setDraft({ ...draft, manualsSection: { ...draft.manualsSection, heading: v } })
                }
              />
              <BiInput
                label="Product page manuals heading"
                value={draft.productPage.manualsHeading}
                onChange={(v) => setDraft({ ...draft, productPage: { manualsHeading: v } })}
              />
            </section>

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">About / Contact</h2>
              <BiInput label="About title" value={draft.about.title} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, title: v } })} />
              <BiInput label="About body" value={draft.about.body} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, body: v } })} />
              <BiInput
                label="Contact title"
                value={draft.contact.title}
                onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, title: v } })}
              />
              <BiInput
                label="Contact body"
                value={draft.contact.body}
                onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, body: v } })}
              />
            </section>

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Legal pages</h2>
              <BiInput
                label="Privacy title"
                value={draft.legal.privacyTitle}
                onChange={(v) => setDraft({ ...draft, legal: { ...draft.legal, privacyTitle: v } })}
              />
              <BiInput
                label="Privacy body"
                value={draft.legal.privacyBody}
                onChange={(v) => setDraft({ ...draft, legal: { ...draft.legal, privacyBody: v } })}
              />
              <BiInput
                label="Cookie policy title"
                value={draft.legal.cookieTitle}
                onChange={(v) => setDraft({ ...draft, legal: { ...draft.legal, cookieTitle: v } })}
              />
              <BiInput
                label="Cookie policy body"
                value={draft.legal.cookieBody}
                onChange={(v) => setDraft({ ...draft, legal: { ...draft.legal, cookieBody: v } })}
              />
            </section>

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
              <h2 className="text-lg font-semibold">Cookie banner (EU/US)</h2>
              <BiInput
                label="Message"
                value={draft.cookieBanner.message}
                onChange={(v) => setDraft({ ...draft, cookieBanner: { ...draft.cookieBanner, message: v } })}
              />
              <BiInput
                label="Accept button"
                value={draft.cookieBanner.accept}
                onChange={(v) => setDraft({ ...draft, cookieBanner: { ...draft.cookieBanner, accept: v } })}
              />
              <BiInput
                label="Learn more link text"
                value={draft.cookieBanner.learnMore}
                onChange={(v) => setDraft({ ...draft, cookieBanner: { ...draft.cookieBanner, learnMore: v } })}
              />
            </section>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              className="min-h-[420px] w-full rounded-xl border border-[rgba(255,255,255,0.12)] bg-black p-4 font-mono text-xs text-white outline-none focus:border-[#00e676]"
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
            />
            <button
              type="button"
              className="rounded-lg border border-[#00e676] px-4 py-2 text-sm font-semibold text-[#00e676] hover:bg-[rgba(0,230,118,0.1)]"
              onClick={() => {
                try {
                  const parsed = normalizeSiteConfig(JSON.parse(rawJson) as SiteConfig);
                  setDraft(parsed);
                  setRawJson(JSON.stringify(parsed, null, 2));
                } catch {
                  alert("Invalid JSON");
                }
              }}
            >
              Apply JSON to form state
            </button>
          </div>
        )}

          </>
        ) : null}
      </div>
    </div>
  );
}
