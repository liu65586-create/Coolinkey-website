import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type PreviewDraftValue = {
  previewDraft: boolean;
  setPreviewDraft: (value: boolean) => void;
};

const PreviewDraftContext = createContext<PreviewDraftValue | null>(null);

export function PreviewDraftProvider({ children }: { children: ReactNode }) {
  const [previewDraft, setPreviewDraft] = useState(false);
  const value = useMemo(() => ({ previewDraft, setPreviewDraft }), [previewDraft]);
  return <PreviewDraftContext.Provider value={value}>{children}</PreviewDraftContext.Provider>;
}

export function usePreviewDraft(): PreviewDraftValue {
  const ctx = useContext(PreviewDraftContext);
  if (!ctx) throw new Error("usePreviewDraft must be used within PreviewDraftProvider");
  return ctx;
}
