"use client";

export const SIZE_OPTIONS = ["S", "M", "L", "XL", "2XL"] as const;
export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

interface FilterSortBarProps {
  activeSize: string | null;
  onSizeChange: (size: string | null) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export default function FilterSortBar({
  activeSize,
  onSizeChange,
  sortKey,
  onSortChange,
}: FilterSortBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-2 border-brand-gray-dark p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Size pills — variant-aware filtering lands with Phase 3 (PDP) */}
      <div className="flex items-center gap-2" role="group" aria-label="Filter by size">
        <span className="mr-1 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          Size
        </span>
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={activeSize === size}
            onClick={() => onSizeChange(activeSize === size ? null : size)}
            className={`h-9 w-11 border-2 font-mono text-xs font-bold transition-colors ${
              activeSize === size
                ? "border-brand-white bg-brand-white text-brand-black"
                : "border-brand-gray-dark text-neutral-400 hover:border-brand-white hover:text-brand-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Sort */}
      <label className="flex items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          Sort
        </span>
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="border-2 border-brand-gray-dark bg-brand-black px-3 py-2 font-mono text-xs tracking-wider text-brand-white uppercase focus:border-brand-white focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price // Low-High</option>
          <option value="price-desc">Price // High-Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </label>
    </div>
  );
}
