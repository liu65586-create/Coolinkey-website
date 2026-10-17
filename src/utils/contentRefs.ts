import { isSitePath } from "../cms/sitePaths";
import type { CmsProduct } from "../types/cms";
import type { SiteConfig } from "../types/siteConfig";

function walkStrings(value: unknown, trail: string, hits: string[]): void {
  if (typeof value === "string") {
    if (value.startsWith("blob:") || value.startsWith("data:")) hits.push(`${trail}: ${value.slice(0, 48)}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${trail}[${index}]`, hits));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) walkStrings(child, `${trail}.${key}`, hits);
  }
}

export function validateContent(site: SiteConfig, products: CmsProduct[]): string[] {
  const errors: string[] = [];
  const navIds = new Set<string>();
  for (const link of site.nav?.links ?? []) {
    if (!link.id.trim()) errors.push("导航项缺少稳定 ID");
    if (navIds.has(link.id)) errors.push(`导航 ID 重复：${link.id}`);
    navIds.add(link.id);
    if (!isSitePath(link.to)) errors.push(`导航「${link.label.zh || link.label.en}」的路径不在站点页面内：${link.to}`);
  }

  const sectionIds = new Set<string>();
  for (const section of site.homeSections ?? []) {
    if (sectionIds.has(section.id)) errors.push(`首页模块重复：${section.id}`);
    sectionIds.add(section.id);
  }

  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const product of products) {
    if (!product.slug.trim()) errors.push("有产品缺少 slug");
    if (slugs.has(product.slug)) errors.push(`产品 slug 重复：${product.slug}`);
    slugs.add(product.slug);
    const id = product.id ?? "";
    if (!id.trim()) errors.push(`产品 ${product.slug} 缺少稳定 ID`);
    if (ids.has(id)) errors.push(`产品 ID 重复：${id}`);
    ids.add(id);
    const manualIds = new Set<string>();
    for (const manual of product.manuals ?? []) {
      if (!manual.id.trim()) errors.push(`${product.slug} 有说明书缺少 ID`);
      if (manualIds.has(manual.id)) errors.push(`${product.slug} 说明书 ID 重复：${manual.id}`);
      manualIds.add(manual.id);
    }
  }

  const blobs: string[] = [];
  walkStrings(site, "site", blobs);
  walkStrings(products, "products", blobs);
  if (blobs.length) errors.push(`内容里含有浏览器临时地址，不能导出：${blobs.slice(0, 3).join("；")}`);
  return errors;
}

export function collectReferences(site: SiteConfig, products: CmsProduct[]): Map<string, string[]> {
  const refs = new Map<string, string[]>();
  const add = (path: string, where: string) => {
    const key = path.trim();
    if (!key.startsWith("/")) return;
    const list = refs.get(key) ?? [];
    list.push(where);
    refs.set(key, list);
  };
  const walk = (value: unknown, where: string) => {
    if (typeof value === "string") {
      if (value.startsWith("/")) add(value, where);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${where}[${index}]`));
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) walk(child, `${where}.${key}`);
    }
  };
  walk(site, "站点配置");
  walk(products, "产品");
  return refs;
}
