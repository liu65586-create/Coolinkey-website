import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const templatePath = resolve(root, "dist/index.html");
const template = readFileSync(templatePath, "utf8");
const serverEntry = resolve(root, "dist/server/entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href);

const routes = ["/", "/business", "/privacy", "/cookie-policy"];

for (const url of routes) {
  const { html, head } = render(url);
  const page = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${head}\n    <!--seo:end-->`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const file = url === "/" ? templatePath : resolve(root, "dist", url.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  if (!page.includes("Meet CLX1") && url === "/") {
    throw new Error("Homepage prerender is missing visible copy");
  }
}
