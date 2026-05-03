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
        className="w-full appearance-none rounded-[8px] border-2 border-[#00e676] bg-black px-4 py-3 pr-10 text-white outline-none focus-visible:ring-2 focus-visible:ring-[#00e676] disabled:opacity-50"
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
