import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { applyPreferredLanguage, i18nReady } from "./i18n";
import "./index.css";
import App from "./App.tsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root");

void i18nReady.then(() => {
  const tree = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  if (rootEl.childElementCount > 0) hydrateRoot(rootEl, tree);
  else createRoot(rootEl).render(tree);
  applyPreferredLanguage();
});
