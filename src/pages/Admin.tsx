import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminMediaLibrary } from "../admin/AdminMediaLibrary";
import { AdminMediaPanel } from "../admin/AdminMediaPanel";
import { AdminMidModulesSection } from "../admin/AdminMidModulesSection";
import { AdminProductsPanel } from "../admin/AdminProductsPanel";
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
import { fetchSession, loginAdmin, logoutAdmin, publishContent, type PublishSession } from "../utils/publishRelease";

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
  const [page, setPage] = useState<"settings" | "home" | "clx1" | "support" | "about">("home");
  const [tab, setTab] = useState<"content" | "json">("content");
  const [session, setSession] = useState<PublishSession | null>(null);
  const [password, setPassword] = useState("");
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
    void fetchSession()
      .then(setSession)
      .catch(() => setSession({ ok: false, authenticated: false, publishReady: false, missing: ["ADMIN_PASSWORD", "GITHUB_TOKEN"] }));
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
    if (!hash) return { label: "正在计算", detail: "正在读取当前内容。", canCommit: false, canDeploy: false };
    if (release.exportHash !== hash) {
      return {
        label: hasLocalDraft ? "有未发布修改" : "内容尚未发布",
        detail: "保存草稿只留在这台浏览器。点「提交并发布」后，内容会提交到 GitHub，并由 Vercel 自动部署。",
        canCommit: false,
        canDeploy: false,
      };
    }
    if (release.deployedAt) {
      return {
        label: "已发布",
        detail: `已于 ${release.deployedAt} 确认线上更新。如果之后又改了内容，这个状态会取消。`,
        canCommit: true,
        canDeploy: true,
      };
    }
    if (release.committedAt) {
      return {
        label: "已提交",
        detail: `已于 ${release.committedAt} 提交到 GitHub。Vercel 会按这次提交部署。`,
        canCommit: true,
        canDeploy: true,
      };
    }
    return {
      label: "已导出，待发布",
      detail: "当前内容和上次导出一致。要更新官网，请点「提交并发布」。",
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

  const onPublish = async () => {
    setBusy(true);
    setError(null);
    try {
      const { site, nextProducts } = requireDraft();
      persistDraft(site, nextProducts);
      setDraft(site);
      setProducts(nextProducts);
      const result = await publishContent(site, nextProducts);
      const exportHash = await fingerprintContent(site, nextProducts);
      const next = { exportHash, exportedAt: new Date().toISOString(), committedAt: new Date().toISOString(), deployedAt: null };
      writeReleaseStatus(next);
      setRelease(next);
      setHash(exportHash);
      setNotice(`已提交到 GitHub（${result.sha.slice(0, 7)}）。Vercel 正在按这次提交部署，完成后刷新官网即可看到。`);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "发布失败");
    } finally {
      setBusy(false);
    }
  };

  if (!session) {
    return (
      <div className="admin-shell grid min-h-screen place-items-center px-4">
        <p className="text-sm text-[#5b6775]">{error ?? "正在检查登录状态…"}</p>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="admin-shell grid min-h-screen place-items-center bg-[#f4f6f8] px-4">
        <form
          className="w-full max-w-sm rounded-2xl border border-[rgba(11,27,43,0.08)] bg-white p-8"
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            setError(null);
            void loginAdmin(password)
              .then((next) => {
                setSession({ ...next, authenticated: true });
                setPassword("");
              })
              .catch((loginError) => setError(loginError instanceof Error ? loginError.message : "登录失败"))
              .finally(() => setBusy(false));
          }}
        >
          <p className="text-sm font-semibold text-[#00b51a]">coolinkey</p>
          <h1 className="mt-2 text-2xl font-bold text-[#0b1b2b]">登录管理系统</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5b6775]">登录后可以编辑官网内容，并提交到 GitHub 自动部署。</p>
          <label className="mt-6 block text-sm font-medium text-[#0b1b2b]">
            管理密码
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-[rgba(11,27,43,0.12)] px-3 py-2 outline-none focus:border-[#00b51a]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {session.missing.length ? (
            <p className="mt-3 text-xs leading-relaxed text-[#5b6775]">
              服务器还需配置：{session.missing.join("、")}。把它们加到 Vercel 环境变量，或本地 `.env` 后重启。
            </p>
          ) : null}
          <button type="submit" className="mt-6 w-full rounded-full bg-[#00b51a] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy}>
            登录
          </button>
        </form>
      </div>
    );
  }

  if (loading || !draft) {
    return (
      <div className="admin-shell grid min-h-screen place-items-center bg-[#f4f6f8] px-4">
        <p className="text-sm text-[#5b6775]">{error ?? "正在加载内容…"}</p>
      </div>
    );
  }

  const navItem = (id: typeof page, label: string) => (
    <button
      type="button"
      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${page === id ? "bg-[#e7f8ea] font-semibold text-[#00b51a]" : "text-[#5b6775] hover:bg-black/[0.03] hover:text-[#0b1b2b]"}`}
      onClick={() => setPage(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="admin-shell min-h-screen bg-[#f4f6f8] text-[#0b1b2b]">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-[rgba(11,27,43,0.08)] bg-white px-4 py-6">
          <div className="px-2">
            <div className="text-sm font-semibold text-[#00b51a]">coolinkey</div>
            <div className="mt-1 text-base font-bold">管理系统</div>
          </div>
          <nav className="mt-8 space-y-6">
            <div>
              {navItem("settings", "系统设置")}
            </div>
            <div>
              <div className="px-3 text-xs font-semibold tracking-wide text-[#0b1b2b]">官网管理</div>
              <div className="mt-2 space-y-1">
                {navItem("home", "首页管理")}
                {navItem("clx1", "CLX1管理")}
                {navItem("support", "Support管理")}
                {navItem("about", "About管理")}
              </div>
            </div>
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[rgba(11,27,43,0.08)] bg-white px-6 py-4">
            <div>
              <div className="text-lg font-bold">
                {page === "settings" ? "系统设置" : page === "home" ? "首页管理" : page === "clx1" ? "CLX1管理" : page === "support" ? "Support管理" : "About管理"}
              </div>
              <p className="text-sm text-[#5b6775]">{notice || status.detail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link className="rounded-full border border-[rgba(11,27,43,0.12)] px-3 py-2 text-sm" to="/">查看官网</Link>
              <button type="button" className="rounded-full border border-[rgba(11,27,43,0.12)] px-3 py-2 text-sm" disabled={busy} onClick={onSaveDraft}>保存草稿</button>
              <button type="button" className="rounded-full bg-[#00b51a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !session.publishReady} onClick={() => void onPublish()}>
                提交并发布
              </button>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm text-[#5b6775]"
                onClick={() => {
                  void logoutAdmin().finally(() => setSession({ ...session, authenticated: false }));
                }}
              >
                退出
              </button>
            </div>
          </header>
          <div className="space-y-6 px-6 py-6">
            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            {!session.publishReady ? (
              <p className="rounded-xl border border-[rgba(11,27,43,0.08)] bg-white px-4 py-3 text-sm text-[#5b6775]">
                提交并发布还不能用。请在 Vercel 项目环境变量中设置 {session.missing.join("、")}。令牌需要有这个仓库的写入权限，推送到 main 后 Vercel 会自动部署。
              </p>
            ) : null}

        {page === "clx1" ? (
          <AdminProductsPanel key={productsEpoch} products={products} onChange={setProducts} />
        ) : null}

        {page === "settings" ? (
          <AdminSiteExtras section="settings" draft={draft} setDraft={setDraft} products={products} setProducts={setProducts} />
        ) : null}

        {page === "support" ? (
          <AdminSiteExtras section="support" draft={draft} setDraft={setDraft} products={products} setProducts={setProducts} />
        ) : null}

        {page === "home" ? (
          <AdminSiteExtras section="home" draft={draft} setDraft={setDraft} products={products} setProducts={setProducts} />
        ) : null}

        {draft ? (
          <>

        {page === "settings" ? <div className="flex flex-wrap gap-2">
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
            JSON
          </button>
        </div> : null}

        {tab === "content" || page !== "settings" ? (
          <div className="space-y-10">
            {page === "settings" ? <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
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
            </section> : null}

            {page === "home" ? <><section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
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
            </section></> : null}

            {page === "home" || page === "clx1" || page === "support" ? <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
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
            </section> : null}

            {page === "about" ? <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
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
            </section> : null}

            {page === "settings" ? <><section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#252a33] p-5">
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
            </section></> : null}
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
        {page === "settings" ? (
          <section className="space-y-4 rounded-xl border border-[rgba(11,27,43,0.08)] bg-white p-5">
            <h2 className="text-lg font-semibold">媒体与备份</h2>
            <p className="text-sm text-[#5b6775]">图片和文件在各页面里直接替换。这里可以查看已上传的媒体，或下载一份备份。发布请用右上角的「提交并发布」，不需要再手动上传变更包。</p>
            <AdminMediaLibrary site={draft} products={products} />
            <AdminMediaPanel site={draft} products={products} onSite={setDraft} onProducts={setProducts} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-[rgba(11,27,43,0.12)] px-4 py-2 text-sm" disabled={busy} onClick={() => void onExport("full")}>下载完整备份</button>
              <button type="button" className="rounded-full border border-[rgba(11,27,43,0.12)] px-4 py-2 text-sm" disabled={busy} onClick={() => void onExport("json")}>下载配置 JSON</button>
              <label className="rounded-full border border-[rgba(11,27,43,0.12)] px-4 py-2 text-sm">
                从备份恢复
                <input type="file" accept=".zip" className="sr-only" onChange={(event) => void onImportZip(event.target.files?.[0] ?? null)} />
              </label>
            </div>
          </section>
        ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
