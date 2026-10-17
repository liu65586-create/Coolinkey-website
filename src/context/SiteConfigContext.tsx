import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePreviewDraft } from "./PreviewDraftContext";
import type { SiteConfig } from "../types/siteConfig";
import { deepMerge } from "../utils/deepMerge";
import { normalizeSiteConfig } from "../utils/normalizeSiteConfig";

const STORAGE_KEY = "coolinkey_site_config_full";

type SiteConfigContextValue = {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
  /** Reload repo JSON. Local draft is applied only while `?draft=1` preview is on. */
  reload: () => Promise<void>;
  /** Remove browser draft and reload the repo JSON */
  resetToRepoFile: () => Promise<void>;
  /** Persist a local draft. This does not publish the public site. */
  saveLocalOverride: (next: SiteConfig) => void;
};

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

async function fetchRepoConfig(): Promise<SiteConfig> {
  const res = await fetch("/cms/site.config.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load site.config.json");
  return (await res.json()) as SiteConfig;
}

function readLocalOverride(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteConfig;
  } catch {
    return null;
  }
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const { previewDraft } = usePreviewDraft();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = await fetchRepoConfig();
      const local = previewDraft ? readLocalOverride() : null;
      setConfig(normalizeSiteConfig(local ? deepMerge(repo, local) : repo));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [previewDraft]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void reload();
    };
    const onCustom = () => void reload();
    window.addEventListener("storage", onStorage);
    window.addEventListener("coolinkey-site-config", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("coolinkey-site-config", onCustom as EventListener);
    };
  }, [reload]);

  const resetToRepoFile = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    await reload();
  }, [reload]);

  const saveLocalOverride = useCallback((next: SiteConfig) => {
    const normalized = normalizeSiteConfig(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setConfig(normalized);
    window.dispatchEvent(new Event("coolinkey-site-config"));
  }, []);

  const value = useMemo(
    () => ({
      config,
      loading,
      error,
      reload,
      resetToRepoFile,
      saveLocalOverride,
    }),
    [config, loading, error, reload, resetToRepoFile, saveLocalOverride]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error("useSiteConfig must be used within SiteConfigProvider");
  return ctx;
}
