"use client";

import { SIZE_OPTIONS } from "@/components/catalog/FilterSortBar";

interface SizeSelectorProps {
  selected: string | null;
  onSelect: (size: string) => void;
}

/**
 * Block variant buttons. Sizes are a merchandising convention until Odoo
 * variants exist — every size is selectable; the sold-out strike-through
 * state activates per-variant in Phase 3+ when stock data is wired.
 */
export default function SizeSelector({ selected, onSelect }: SizeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Select size" className="flex flex-wrap gap-2">
      {SIZE_OPTIONS.map((size) => {
        const isSelected = selected === size;
        const soldOut = false; // per-size stock arrives with real variants
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={soldOut}
            onClick={() => onSelect(size)}
            className={`relative h-12 w-14 border-2 font-mono text-sm font-bold transition-colors ${
              isSelected
                ? "border-brand-white bg-brand-white text-brand-black"
                : "border-brand-gray-dark text-neutral-300 hover:border-brand-white"
            } ${soldOut ? "cursor-not-allowed opacity-40" : ""}`}
          >
            {size}
            {soldOut && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span aria-hidden className="h-[2px] w-full rotate-[-35deg] bg-brand-accent-red" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
