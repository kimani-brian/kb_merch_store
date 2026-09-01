"use client";

import type { OdooProductAttribute } from "@/types/odoo";

interface VariantSelectorProps {
  attributes: OdooProductAttribute[];
  selected: Record<number, number>;
  onSelect: (attributeId: number, valueId: number) => void;
}

export default function VariantSelector({
  attributes,
  selected,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-5">
      {attributes.map((attribute) => (
        <div key={attribute.id}>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            {attribute.name}
          </p>
          <div
            role="radiogroup"
            aria-label={`Select ${attribute.name}`}
            className="flex flex-wrap gap-2"
          >
            {attribute.values.map((value) => {
              const isSelected = selected[attribute.id] === value.id;
              return (
                <button
                  key={value.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelect(attribute.id, value.id)}
                  className={`min-w-14 border-2 px-3 py-3 font-mono text-sm font-bold uppercase transition-colors ${
                    isSelected
                      ? "border-brand-white bg-brand-white text-brand-black"
                      : "border-brand-gray-dark text-neutral-300 hover:border-brand-white"
                  }`}
                >
                  {value.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
