import { useEffect, useState } from "react";

type GeoState = {
  countryCode: string | null;
  loading: boolean;
  error: boolean;
};

/** EU + EEA + UK + US — used for GDPR-style cookie banner visibility (per product brief). */
const COOKIE_CONSENT_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "UK",
  "CH",
  "US",
]);

export function useGeoIp(): GeoState {
  const [state, setState] = useState<GeoState>({
    countryCode: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
        if (!res.ok) throw new Error("geo failed");
        const data = (await res.json()) as { country_code?: string };
        setState({
          countryCode: (data.country_code ?? "").toUpperCase() || null,
          loading: false,
          error: false,
        });
      } catch {
        setState({ countryCode: null, loading: false, error: true });
      }
    })();
    return () => ctrl.abort();
  }, []);

  return state;
}

/** Mainland China → domestic storefronts; other regions default to global (Amazon). */
export function isChinaCountry(code: string | null): boolean {
  return code === "CN";
}

export function shouldShowCookieBanner(countryCode: string | null): boolean {
  if (!countryCode) return false;
  return COOKIE_CONSENT_COUNTRIES.has(countryCode);
}
