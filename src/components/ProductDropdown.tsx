import { useTranslation } from "react-i18next";
import type { CmsProduct } from "../types/cms";

type Props = {
  products: CmsProduct[];
  valueSlug: string;
  onChangeSlug: (slug: string) => void;
  disabled?: boolean;
};

export function ProductDropdown({ products, valueSlug, onChangeSlug, disabled }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("zh") ? "zh" : "en";

  return (
    <label className="block max-w-xl">
      <span className="sr-only">Product</span>
      <select
        className="w-full appearance-none rounded-[8px] border-2 border-emerald-600 bg-white px-4 py-3 pr-10 text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50"
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
