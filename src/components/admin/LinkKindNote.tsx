import { classifyLink } from "../../utils/linkKind";

export function LinkKindNote({ value }: { value: string }) {
  const info = classifyLink(value);
  if (info.kind === "empty") return null;
  return <p className="text-[11px] leading-relaxed text-[#f0d48a]">{info.note} 状态：未验证。</p>;
}
