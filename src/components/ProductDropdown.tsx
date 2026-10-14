import { useTranslation } from "react-i18next";
import type { CmsProduct } from "../types/cms";

type Props = {
  products: CmsProduct[];
  valueSlug: string;
  onChangeSlug: (slug: string) => void;
  disabled?: boolean;
};

export function ProductDropdown({ products, valueSlug, onChangeSlug, disabled }: Props) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language.startsWith("zh") ? "zh" : "en";

  return (
    <label className="block max-w-md">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">{t("product.selectProduct")}</span>
      <select
        className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
        value={valueSlug}
        disabled={disabled || products.length === 0}
        onChange={(e) => onChangeSlug(e.target.value)}
      >
        {products.map((p) => (
          <option key={p.slug} value={p.slug}>
            {lang === "zh" ? p.name.zh : p.name.en}
          </option>
        ))}
      </select>
    </label>
  );
}
