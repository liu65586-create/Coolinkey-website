import type { ImageFit } from "../../types/siteConfig";

const FOCI = [
  { id: "50% 50%", label: "居中" },
  { id: "50% 0%", label: "顶部" },
  { id: "50% 100%", label: "底部" },
  { id: "0% 50%", label: "左侧" },
  { id: "100% 50%", label: "右侧" },
] as const;

export function FitFocusFields({
  fit,
  focus,
  onChange,
}: {
  fit: ImageFit;
  focus: string;
  onChange: (next: { fit: ImageFit; focus: string }) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm text-[#cccccc]">
        <span className="mb-1 block text-xs font-semibold text-white/80">展示方式（CSS object-fit，不改原图）</span>
        <select
          className="w-full rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
          value={fit}
          onChange={(e) => onChange({ fit: e.target.value as ImageFit, focus })}
        >
          <option value="contain">contain · 完整显示</option>
          <option value="cover">cover · 铺满区域</option>
        </select>
      </label>
      <label className="block text-sm text-[#cccccc]">
        <span className="mb-1 block text-xs font-semibold text-white/80">焦点（CSS object-position，不裁切文件）</span>
        <select
          className="w-full rounded-lg border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
          value={focus}
          onChange={(e) => onChange({ fit, focus: e.target.value })}
        >
          {FOCI.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
