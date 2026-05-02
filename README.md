# COOLINKEY Website

Marketing site for **COOLINKEY** (React + Vite + TypeScript). Product data is loaded from `public/cms/products.json` (Strapi/Contentful-shaped payload).

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

- **GitHub**: push `main` (or open a PR) after changes.
- **Vercel**: import the repo, framework preset **Vite**, output **dist**, SPA rewrites are in `vercel.json`.

## Manuals

Sample PDFs live under `public/manuals/{en,zh}/`. Replace with real assets while keeping language-prefixed paths.

## Site content & admin

- **Global copy / modules / logo path**: `public/cms/site.config.json` (bilingual fields; empty strings fall back to `src/i18n/locales/*.json`).
- **Logo image file**: place assets under `public/brand/` (default: `/brand/coolinkey-logo.png`).
- **Admin UI**: open `/admin` locally or on your deployed domain.
  - **Production**: set `VITE_ADMIN_PIN` in Vercel env vars, redeploy, then unlock with the PIN.
  - **Site tab → publish**: **Export JSON** → replace `public/cms/site.config.json` → push.
  - **Products tab → publish**: **Export products.json** → replace `public/cms/products.json` → push.
  - **Browser-only preview**: each tab has “Save in this browser” (`localStorage` keys `coolinkey_site_config_full` and `coolinkey_products_override`).
- **Products, galleries, specs, purchase links, manual PDF paths**: edited in admin **产品与说明书** tab or directly in `public/cms/products.json` (until a headless CMS API is wired).

`public/robots.txt` discourages indexing `/admin`.
