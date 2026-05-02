import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminMidModulesSection } from "../admin/AdminMidModulesSection";
import { AdminProductsPanel } from "../admin/AdminProductsPanel";
import { BiInput } from "../components/admin/BiInput";
import { useSiteConfig } from "../context/SiteConfigContext";
import type { SiteConfig } from "../types/siteConfig";
import { normalizeSiteConfig } from "../utils/normalizeSiteConfig";

const SESSION_KEY = "coolinkey_admin";

function useAdminGate() {
  const isProd = import.meta.env.PROD;
  const pin = (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim();

  const [unlocked, setUnlocked] = useState(() => {
    if (isProd && !pin) return false;
    if (!isProd && !pin) return true;
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });

  const blocked = isProd && !pin;

  const tryUnlock = (input: string) => {
    if (blocked) return;
    if (!pin) {
      setUnlocked(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }
    if (input.trim() === pin) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    if (!isProd && !pin) setUnlocked(true);
    else setUnlocked(false);
  };

  return { unlocked, blocked, tryUnlock, logout };
}

export function Admin() {
  const { config, loading, error, saveLocalOverride, resetToRepoFile, reload } = useSiteConfig();
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [mainTab, setMainTab] = useState<"site" | "products">("site");
  const [tab, setTab] = useState<"content" | "json">("content");
  const [rawJson, setRawJson] = useState("");
  const gate = useAdminGate();

  useEffect(() => {
    if (config) {
      const c = normalizeSiteConfig(structuredClone(config));
      setDraft(c);
      setRawJson(JSON.stringify(c, null, 2));
    }
  }, [config]);

  const canEdit = gate.unlocked && !gate.blocked;

  const onExport = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site.config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = normalizeSiteConfig(JSON.parse(text) as SiteConfig);
    setDraft(parsed);
    setRawJson(JSON.stringify(parsed, null, 2));
  };

  const dirty = useMemo(() => {
    if (!draft || !config) return false;
    return JSON.stringify(draft) !== JSON.stringify(config);
  }, [draft, config]);

  if (gate.blocked) {
    return (
      <div className="min-h-dvh bg-black px-4 py-16 text-white">
        <h1 className="text-2xl font-bold">Admin disabled</h1>
        <p className="mt-4 max-w-2xl text-[#cccccc]">
          Production deployments must set <code className="text-[#00b51a]">VITE_ADMIN_PIN</code> in Vercel
          environment variables, then redeploy. This prevents a public admin surface without a secret.
        </p>
        <Link className="mt-8 inline-block text-[#00b51a] hover:underline" to="/">
          Back to site
        </Link>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-dvh bg-black px-4 py-16 text-white">
        <h1 className="text-2xl font-bold">COOLINKEY Admin</h1>
        {!import.meta.env.PROD && !import.meta.env.VITE_ADMIN_PIN ? (
          <p className="mt-3 max-w-2xl text-sm text-amber-200">
            Dev mode: no <code>VITE_ADMIN_PIN</code> set — admin is open. Add a PIN before production.
          </p>
        ) : null}
        <div className="mt-8 max-w-md space-y-3">
          <input
            type="password"
            className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-white outline-none focus:border-[#00b51a]"
            placeholder="PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-[#00b51a] px-4 py-2 font-semibold text-white hover:bg-[#00cc1a]"
            onClick={() => gate.tryUnlock(pinInput)}
          >
            Unlock
          </button>
        </div>
        <Link className="mt-10 inline-block text-[#00b51a] hover:underline" to="/">
          Back to site
        </Link>
      </div>
    );
  }

  if (mainTab === "site" && (loading || !draft)) {
    return (
      <div className="min-h-dvh bg-black px-4 py-16 text-white">
        <p className="text-[#cccccc]">{error ?? "Loading…"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black text-white">
      <header className="border-b border-[rgba(255,255,255,0.1)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[#00b51a]">COOLINKEY</div>
            <div className="text-lg font-bold">
              {mainTab === "site" ? "Site configuration" : "Products & manuals"}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-lg border border-[rgba(255,255,255,0.15)] px-3 py-2 text-sm hover:border-[#00b51a]" to="/">
              View site
            </Link>
            <button
              type="button"
              className="rounded-lg border border-[rgba(255,255,255,0.15)] px-3 py-2 text-sm hover:border-[#00b51a]"
              onClick={() => gate.logout()}
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mainTab === "site" ? "bg-[#00b51a] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setMainTab("site")}
          >
            站点与文案
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mainTab === "products" ? "bg-[#00b51a] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setMainTab("products")}
          >
            产品与说明书
          </button>
        </div>

        {mainTab === "products" ? (
          <AdminProductsPanel />
        ) : null}

        {mainTab === "site" && draft ? (
          <>
        <div className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-4 text-sm text-[#cccccc]">
          <p>
            <strong className="text-white">How publishing works:</strong> “Save in this browser” stores overrides in{" "}
            <code className="text-[#00b51a]">localStorage</code> for preview. To update the public site for everyone,
            click <strong className="text-white">Export JSON</strong>, replace{" "}
            <code className="text-[#00b51a]">public/cms/site.config.json</code> in the repo, then push to GitHub (Vercel
            redeploys). Product catalog is edited in the <strong className="text-white">产品与说明书</strong> tab and
            saved to <code className="text-[#00b51a]">public/cms/products.json</code>; PDF files live under{" "}
            <code className="text-[#00b51a]">public/manuals/</code>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === "content" ? "bg-[#00b51a] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setTab("content")}
          >
            Forms
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === "json" ? "bg-[#00b51a] text-white" : "border border-[rgba(255,255,255,0.15)]"}`}
            onClick={() => setTab("json")}
          >
            Raw JSON
          </button>
        </div>

        {tab === "content" ? (
          <div className="space-y-10">
            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
              <h2 className="text-lg font-semibold">Branding</h2>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Logo URL (site root path recommended)</span>
                <input
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
                  value={draft.brand.logoSrc}
                  onChange={(e) => setDraft({ ...draft, brand: { ...draft.brand, logoSrc: e.target.value } })}
                />
              </label>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Logo alt text</span>
                <input
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
                  value={draft.brand.logoAlt}
                  onChange={(e) => setDraft({ ...draft, brand: { ...draft.brand, logoAlt: e.target.value } })}
                />
              </label>
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Logo max height (px)</span>
                <input
                  type="number"
                  className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
              <h2 className="text-lg font-semibold">Home modules</h2>
              {(
                [
                  ["homeHero", "Hero"],
                  ["homeFeatures", "Three features"],
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
              <h2 className="text-lg font-semibold">Hero</h2>
              <BiInput label="Title" value={draft.hero.title} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, title: v } })} />
              <BiInput label="Subtitle" value={draft.hero.subtitle} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: v } })} />
              <label className="block text-sm text-[#cccccc]">
                <span className="mb-1 block text-xs font-semibold text-white/80">Background image URL (optional)</span>
                <input
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
                  value={draft.hero.backgroundImageUrl}
                  onChange={(e) =>
                    setDraft({ ...draft, hero: { ...draft.hero, backgroundImageUrl: e.target.value } })
                  }
                  placeholder="https://... or /images/hero.jpg"
                />
              </label>
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

            <section className="space-y-6 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
              <h2 className="text-lg font-semibold">Three features</h2>
              {draft.features.map((f, idx) => (
                <div key={idx} className="space-y-3 border-t border-[rgba(255,255,255,0.08)] pt-4 first:border-t-0 first:pt-0">
                  <label className="block text-sm text-[#cccccc]">
                    <span className="mb-1 block text-xs font-semibold text-white/80">Icon</span>
                    <select
                      className="w-full max-w-xs rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00b51a]"
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
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

            <section className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] p-5">
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
              className="min-h-[420px] w-full rounded-xl border border-[rgba(255,255,255,0.12)] bg-black p-4 font-mono text-xs text-white outline-none focus:border-[#00b51a]"
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
            />
            <button
              type="button"
              className="rounded-lg border border-[#00b51a] px-4 py-2 text-sm font-semibold text-[#00b51a] hover:bg-[rgba(0,181,26,0.1)]"
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

        <div className="flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.1)] pt-6">
          <button
            type="button"
            className="rounded-lg bg-[#00b51a] px-4 py-2 font-semibold text-white hover:bg-[#00cc1a] disabled:opacity-50"
            disabled={!dirty}
            onClick={() => saveLocalOverride(normalizeSiteConfig(draft))}
          >
            Save in this browser
          </button>
          <button type="button" className="rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm" onClick={onExport}>
            Export JSON
          </button>
          <label className="cursor-pointer rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm hover:border-[#00b51a]">
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => void onImportFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            className="rounded-lg border border-[rgba(255,255,255,0.15)] px-4 py-2 text-sm"
            onClick={() => void resetToRepoFile().then(() => void reload())}
          >
            Reset to repo file (clear browser override)
          </button>
        </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
