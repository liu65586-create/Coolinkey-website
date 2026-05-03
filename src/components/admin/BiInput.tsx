import type { LocalizedString } from "../../types/cms";

export function BiInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm text-[#cccccc]">
        <span className="mb-1 block text-xs font-semibold text-white/80">{label} · EN</span>
        <textarea
          className="min-h-[72px] w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
      </label>
      <label className="block text-sm text-[#cccccc]">
        <span className="mb-1 block text-xs font-semibold text-white/80">{label} · 中文</span>
        <textarea
          className="min-h-[72px] w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00e676]"
          value={value.zh}
          onChange={(e) => onChange({ ...value, zh: e.target.value })}
        />
      </label>
    </div>
  );
}
