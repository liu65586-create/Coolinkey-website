import { createContext, useContext, useMemo, type ReactNode } from "react";
import { shouldShowCookieBanner, useGeoIp } from "../hooks/useGeoIp";

type GeoIpContextValue = ReturnType<typeof useGeoIp> & {
  showCookieBanner: boolean;
};

const GeoIpContext = createContext<GeoIpContextValue | null>(null);

export function GeoIpProvider({ children }: { children: ReactNode }) {
  const geo = useGeoIp();
  const value = useMemo(
    () => ({
      ...geo,
      showCookieBanner: shouldShowCookieBanner(geo.countryCode),
    }),
    [geo.countryCode, geo.loading, geo.error]
  );
  return <GeoIpContext.Provider value={value}>{children}</GeoIpContext.Provider>;
}

export function useGeoIpContext(): GeoIpContextValue {
  const ctx = useContext(GeoIpContext);
  if (!ctx) throw new Error("useGeoIpContext must be used within GeoIpProvider");
  return ctx;
}
