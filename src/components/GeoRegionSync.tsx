import { useEffect } from "react";
import { useGeoIpContext } from "../context/GeoIpContext";
import { useShoppingRegion } from "../context/ShoppingRegionContext";

/** Syncs resolved IP country into shopping-region auto mode. */
export function GeoRegionSync() {
  const { countryCode, loading } = useGeoIpContext();
  const { setIpCountryCode } = useShoppingRegion();

  useEffect(() => {
    if (loading) return;
    setIpCountryCode(countryCode);
  }, [countryCode, loading, setIpCountryCode]);

  return null;
}
