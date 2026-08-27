import { IconChevronLeft, IconChevronRight } from "./icons/Icon";

type Props = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
};

export function CarouselControls({ index, total, onPrev, onNext, onSelect }: Props) {
  if (total <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-4">
      <div className="flex gap-1">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-black/[0.04] hover:text-accent disabled:opacity-30"
          disabled={index === 0}
          onClick={onPrev}
          aria-label="Previous"
        >
          <IconChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-black/[0.04] hover:text-accent disabled:opacity-30"
          disabled={index >= total - 1}
          onClick={onNext}
          aria-label="Next"
        >
          <IconChevronRight size={18} />
        </button>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-accent" : "w-1.5 bg-black/15 hover:bg-black/25"}`}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
