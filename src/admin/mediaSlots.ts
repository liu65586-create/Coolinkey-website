import type { SiteConfig } from "../types/siteConfig";
import type { CmsProduct } from "../types/cms";

export type MediaSlotDef = {
  id: string;
  group: string;
  label: string;
  spec: string;
  kind: "image" | "video" | "pdf" | "any";
  getValue: () => string;
  setValue: (url: string) => void;
};

export function buildMediaSlots(
  site: SiteConfig,
  products: CmsProduct[],
  patchSite: (next: SiteConfig) => void,
  patchProducts: (next: CmsProduct[]) => void
): MediaSlotDef[] {
  const slots: MediaSlotDef[] = [];

  slots.push({
    id: "brand-logo",
    group: "品牌",
    label: "Logo",
    spec: "SVG 优先；PNG 透明底约 512×512，显示高度 ≤ 40px",
    kind: "image",
    getValue: () => site.brand.logoSrc,
    setValue: (url) => patchSite({ ...site, brand: { ...site.brand, logoSrc: url } }),
  });

  slots.push({
    id: "hero-background",
    group: "首页 Hero",
    label: "Hero 背景图 / 动图",
    spec: "2400×1350 或 1920×1080（16∶9）；GIF/WebP 动图可用；WebP ≤ 350 KB",
    kind: "image",
    getValue: () => site.hero.backgroundImageUrl,
    setValue: (url) => patchSite({ ...site, hero: { ...site.hero, backgroundImageUrl: url } }),
  });

  for (const key of ["a", "b", "d"] as const) {
    const mod = site.midModules[key];
    mod.slides.forEach((slide, idx) => {
      slots.push({
        id: `mid-${key}-${idx}`,
        group: `首页轮播 · 模块 ${key.toUpperCase()}`,
        label: `幻灯片 ${idx + 1} · 媒体`,
        spec: "1600×1000（16∶10）；视频 mp4 1080p 短循环 ≤ 15 MB",
        kind: slide.mediaKind === "video" ? "video" : "image",
        getValue: () => slide.mediaUrl,
        setValue: (url) => {
          const slides = [...mod.slides];
          slides[idx] = { ...slide, mediaUrl: url };
          patchSite({
            ...site,
            midModules: { ...site.midModules, [key]: { ...mod, slides } },
          });
        },
      });
    });
  }

  products.forEach((p, pi) => {
    slots.push({
      id: `product-${pi}-main`,
      group: `产品 · ${p.slug}`,
      label: "主图",
      spec: "1600×1000 或 1200×900；WebP ≤ 400 KB",
      kind: "image",
      getValue: () => p.mainImage,
      setValue: (url) => {
        const next = [...products];
        next[pi] = { ...p, mainImage: url };
        patchProducts(next);
      },
    });

    p.galleryImages.forEach((url, gi) => {
      slots.push({
        id: `product-${pi}-gallery-${gi}`,
        group: `产品 · ${p.slug}`,
        label: `画廊 ${gi + 1}`,
        spec: "与主图同比例；宽 1600–2000 px",
        kind: "image",
        getValue: () => url,
        setValue: (v) => {
          const next = [...products];
          const gallery = [...p.galleryImages];
          gallery[gi] = v;
          next[pi] = { ...p, galleryImages: gallery };
          patchProducts(next);
        },
      });
    });

    p.manuals.forEach((m, mi) => {
      if (m.type === "video") return;
      slots.push({
        id: `product-${pi}-manual-${mi}-en`,
        group: `产品 · ${p.slug} · 说明书`,
        label: `${m.id} · PDF · EN`,
        spec: "PDF；可外链 https 或 /manuals/en/…",
        kind: "pdf",
        getValue: () => m.pdfFileEn ?? "",
        setValue: (v) => {
          const next = [...products];
          const manuals = [...p.manuals];
          manuals[mi] = { ...m, pdfFileEn: v || null };
          next[pi] = { ...p, manuals };
          patchProducts(next);
        },
      });
      slots.push({
        id: `product-${pi}-manual-${mi}-zh`,
        group: `产品 · ${p.slug} · 说明书`,
        label: `${m.id} · PDF · 中文`,
        spec: "PDF；可外链 https 或 /manuals/zh/…",
        kind: "pdf",
        getValue: () => m.pdfFileZh ?? "",
        setValue: (v) => {
          const next = [...products];
          const manuals = [...p.manuals];
          manuals[mi] = { ...m, pdfFileZh: v || null };
          next[pi] = { ...p, manuals };
          patchProducts(next);
        },
      });
    });
  });

  return slots;
}
