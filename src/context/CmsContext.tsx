import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CmsPayload, CmsProduct } from "../types/cms";
import { deepMerge } from "../utils/deepMerge";

const PRODUCTS_STORAGE_KEY = "coolinkey_products_override";

type CmsContextValue = {
  products: CmsProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getBySlug: (slug: string) => CmsProduct | undefined;
  defaultProduct: CmsProduct | undefined;
  saveLocalProducts: (payload: CmsPayload) => void;
  resetProductsToRepoFile: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue | null>(null);

async function fetchRepoPayload(): Promise<CmsPayload> {
  const res = await fetch("/cms/products.json", { cache: "no-store" });
  if (!res.ok) throw new Error("CMS fetch failed");
  return (await res.json()) as CmsPayload;
}

function readLocalPayload(): CmsPayload | null {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CmsPayload;
  } catch {
    return null;
  }
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CmsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = await fetchRepoPayload();
      const local = readLocalPayload();
      const merged = local ? deepMerge(repo, local) : repo;
      setProducts(merged.products ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY) void refetch();
    };
    const onCustom = () => void refetch();
    window.addEventListener("storage", onStorage);
    window.addEventListener("coolinkey-products-config", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("coolinkey-products-config", onCustom as EventListener);
    };
  }, [refetch]);

  const saveLocalProducts = useCallback((payload: CmsPayload) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(payload));
    setProducts(payload.products ?? []);
    window.dispatchEvent(new Event("coolinkey-products-config"));
  }, []);

  const resetProductsToRepoFile = useCallback(async () => {
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    await refetch();
  }, [refetch]);

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const defaultProduct = useMemo(
    () => products.find((p) => p.slug === "smart-chain-lock") ?? products[0],
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refetch,
      getBySlug,
      defaultProduct,
      saveLocalProducts,
      resetProductsToRepoFile,
    }),
    [products, loading, error, refetch, getBySlug, defaultProduct, saveLocalProducts, resetProductsToRepoFile]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
