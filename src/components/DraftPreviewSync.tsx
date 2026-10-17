import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePreviewDraft } from "../context/PreviewDraftContext";

/** Turns `?draft=1` into an explicit local-draft preview. Ordinary visits stay on repo JSON. */
export function DraftPreviewSync() {
  const [params] = useSearchParams();
  const { setPreviewDraft } = usePreviewDraft();
  const draft = params.get("draft") === "1";

  useEffect(() => {
    setPreviewDraft(draft);
  }, [draft, setPreviewDraft]);

  return null;
}
