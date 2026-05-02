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
  - **Publish changes for all visitors**: use **Export JSON** in admin, replace `public/cms/site.config.json` in the repo, commit, and push (or merge `deepMerge` output carefully).
- **Products, galleries, specs, purchase links, manual PDF paths**: still edited in `public/cms/products.json` (until a headless CMS API is wired).

`public/robots.txt` discourages indexing `/admin`.
