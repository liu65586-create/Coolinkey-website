import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../utils/mediaStore";

/** Resolves site paths to blob URLs when file is in local IndexedDB (admin preview). */
export function useResolvedMediaUrl(url: string | undefined | null): string {
  const [resolved, setResolved] = useState(url ?? "");

  useEffect(() => {
    const raw = url?.trim() ?? "";
    let cancelled = false;
    const run = () => {
      if (!raw) {
        setResolved("");
        return;
      }
      void resolveMediaUrl(raw).then((next) => {
        if (!cancelled) setResolved(next);
      });
    };
    run();
    const onMedia = () => run();
    window.addEventListener("coolinkey-media", onMedia);
    return () => {
      cancelled = true;
      window.removeEventListener("coolinkey-media", onMedia);
    };
  }, [url]);

  return resolved;
}
