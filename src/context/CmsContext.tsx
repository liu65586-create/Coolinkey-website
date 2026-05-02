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

type CmsContextValue = {
  products: CmsProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getBySlug: (slug: string) => CmsProduct | undefined;
  defaultProduct: CmsProduct | undefined;
};

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CmsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/cms/products.json", { cache: "no-store" });
      if (!res.ok) throw new Error("CMS fetch failed");
      const data = (await res.json()) as CmsPayload;
      setProducts(data.products ?? []);
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
    }),
    [products, loading, error, refetch, getBySlug, defaultProduct]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
