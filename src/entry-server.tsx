import { renderToString } from "react-dom/server";
import { AppServer } from "./App";
import "./i18n";
import { headMarkup } from "./seo/documentMeta";

export function render(url: string) {
  return {
    html: renderToString(<AppServer url={url} />),
    head: headMarkup(url),
  };
}
