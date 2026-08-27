import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../utils/mediaStore";

/** Resolves site paths to blob URLs when file is in local IndexedDB (admin preview). */
export function useResolvedMediaUrl(url: string | undefined | null): string {
  const [resolved, setResolved] = useState(url ?? "");

  useEffect(() => {
    const raw = url?.trim() ?? "";
    if (!raw) {
      setResolved("");
      return;
    }
    let cancelled = false;
    void resolveMediaUrl(raw).then((next) => {
      if (!cancelled) setResolved(next);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return resolved;
}
