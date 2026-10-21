import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const templatePath = resolve(root, "dist/index.html");
const template = readFileSync(templatePath, "utf8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html is already prerendered. Run the Vite client build first.");
}
const serverEntry = resolve(root, ".ssr/entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href);

const routes = [
  { url: "/", title: "COOLINKEY CLX1 | Fingerprint Smart Chain Lock", must: ["Meet CLX1", "Less Complexity", "The Pressure Test"], forbid: ["Working Together", "bolt cutter", "theft-proof"] },
  { url: "/business", title: "Business Partnerships &amp; Inquiries | COOLINKEY", must: ["Working Together"], forbid: [">Meet CLX1.<"] },
  { url: "/privacy", title: "Privacy Policy | COOLINKEY", must: ["Privacy Policy"], forbid: [">Meet CLX1.<"] },
  { url: "/cookie-policy", title: "GDPR &amp; Cookie Statement | COOLINKEY", must: ["Cookie Statement"], forbid: [">Meet CLX1.<"] },
];

const titles = new Set();

for (const route of routes) {
  const { html, head } = await render(route.url);
  const preloads = [];
  const body = html.replace(/^(?:\s*<link\b[^>]*rel="preload"[^>]*>)+/, (match) => {
    preloads.push(match);
    return "";
  });
  if (body.includes('rel="preload"')) {
    throw new Error(`${route.url} still has a preload link inside #root`);
  }
  let page = template
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${head}\n    <!--seo:end-->`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (preloads.length) {
    page = page.replace("</head>", `    ${preloads.join("")}\n  </head>`);
  }
  if (page.includes('<div id="root"></div>')) throw new Error(`${route.url} root is empty`);
  if (!page.includes(`<title>${route.title}</title>`)) throw new Error(`${route.url} has the wrong title`);
  if ((page.match(/<h1\b/g) || []).length !== 1) throw new Error(`${route.url} should have one h1`);
  for (const phrase of route.must) {
    if (!page.includes(phrase)) throw new Error(`${route.url} is missing "${phrase}"`);
  }
  for (const phrase of route.forbid) {
    if (page.includes(phrase)) throw new Error(`${route.url} includes unexpected "${phrase}"`);
  }
  for (const block of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(block[1]);
    const types = data["@graph"].map((node) => node["@type"]);
    if (route.url === "/" && !types.includes("Product")) throw new Error("Homepage JSON-LD is missing Product");
    if (route.url !== "/" && (types.includes("Product") || types.includes("Organization"))) {
      throw new Error(`${route.url} should not repeat Product or Organization JSON-LD`);
    }
  }
  titles.add(route.title);
  const file = route.url === "/" ? templatePath : resolve(root, "dist", route.url.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

if (titles.size !== routes.length) throw new Error("Prerendered pages share a title");
