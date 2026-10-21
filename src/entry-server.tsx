import { renderToString } from "react-dom/server";
import { AppServer } from "./App";
import { i18nReady } from "./i18n";
import { headMarkup } from "./seo/documentMeta";

export async function render(url: string) {
  await i18nReady;
  return {
    html: renderToString(<AppServer url={url} />),
    head: headMarkup(url),
  };
}
