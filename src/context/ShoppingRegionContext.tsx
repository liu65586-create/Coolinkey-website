import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isChinaCountry } from "../hooks/useGeoIp";

export type ShoppingRegionMode = "auto" | "cn" | "global";

type ShoppingRegionContextValue = {
  mode: ShoppingRegionMode;
  setMode: (m: ShoppingRegionMode) => void;
  /** Resolved store region for purchase links when mode is auto */
  ipCountryCode: string | null;
  setIpCountryCode: (c: string | null) => void;
  /** true => JD/Tmall base link, false => Amazon */
  useChinaStores: boolean;
};

const ShoppingRegionContext = createContext<ShoppingRegionContextValue | null>(null);

const STORAGE_KEY = "coolinkey_shopping_region";

export function ShoppingRegionProvider({ children }: { children: ReactNode }) {
  const [ipCountryCode, setIpCountryCode] = useState<string | null>(null);
  const [mode, setModeState] = useState<ShoppingRegionMode>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as ShoppingRegionMode | null;
      if (v === "auto" || v === "cn" || v === "global") return v;
    } catch {
      /* ignore */
    }
    return "auto";
  });

  const setMode = useCallback((m: ShoppingRegionMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  const useChinaStores = useMemo(() => {
    if (mode === "cn") return true;
    if (mode === "global") return false;
    return isChinaCountry(ipCountryCode);
  }, [mode, ipCountryCode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      ipCountryCode,
      setIpCountryCode,
      useChinaStores,
    }),
    [mode, setMode, ipCountryCode, useChinaStores]
  );

  return (
    <ShoppingRegionContext.Provider value={value}>{children}</ShoppingRegionContext.Provider>
  );
}

export function useShoppingRegion(): ShoppingRegionContextValue {
  const ctx = useContext(ShoppingRegionContext);
  if (!ctx) throw new Error("useShoppingRegion must be used within ShoppingRegionProvider");
  return ctx;
}
