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
