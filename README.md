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

The public site is static. Visitors only see files in the repo (`public/cms/site.config.json`, `public/cms/products.json`, and files under `public/`).

`/admin` edits a **local draft** in this browser. It does not publish the live site and it does not call an upload API.

1. Edit copy, products, and media.
2. Use **保存并预览草稿** to open `/?draft=1`. That preview is only in your browser.
3. Use **导出完整变更包**. The zip contains `MANIFEST.md`, the JSON files, and any media you imported.
4. Copy those files onto the paths listed in the manifest, commit, and push.
5. After Vercel finishes building, check the live site, then use the manual confirmation buttons. Those buttons do not talk to GitHub or Vercel.

**下载配置 JSON** omits new media files. A local draft is not a backup until you export the full package. Import that zip later with **从变更包恢复**.

There is no admin password in this static build. Do not put secrets in `VITE_*` variables. `/admin` can change only the current browser until someone commits the export.

Image fit and focus change CSS `object-fit` and `object-position`. They do not crop the original file.

Google Drive folder links are rejected as file URLs. Drive, YouTube, and Vimeo links are shape-checked only; the admin cannot verify share permissions.

Browser title and description fields update the tab after JavaScript runs. This site does not prerender per-route Open Graph tags.


## COOLINKEY visual rebuild (static CMS)

This revision refreshes the homepage with a light smoky-grey visual system, restrained lime accents, product-first hero, editable feature/story/scenario sections, and the supplied listing imagery under `public/images/listing/`.

### Editing and publishing

- Open `/admin` to edit the bilingual site copy, brand logo, product content, page images, manuals/PDFs, video links, navigation, support content, and homepage detail cards.
- Uploaded media remains a local browser draft until you export the complete content bundle.
- Use **Export complete bundle** and follow `MANIFEST.md` to place JSON and media files into the repository before committing and redeploying.
- The site remains static. The admin does not write to GitHub or deploy automatically.
- The logo is controlled by `brand.logoSrc`; upload/replacement should be previewed in the draft and included in the export bundle.

The build could not be independently run in the editing environment because dependency installation timed out. TypeScript/TSX syntax transpilation was checked separately; run `npm ci` and `npm run build` in a normal development environment before publishing.
