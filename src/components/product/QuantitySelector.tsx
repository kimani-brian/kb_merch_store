"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  const clamp = (value: number) => Math.max(1, Math.min(99, value));

  return (
    <div className="inline-flex items-center border-2 border-brand-gray-dark">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(qty - 1))}
        disabled={qty <= 1}
        className="flex h-12 w-12 items-center justify-center text-neutral-400 transition-colors hover:text-brand-white disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        aria-label={`Quantity: ${qty}`}
        className="w-12 text-center font-mono text-sm font-bold text-brand-white"
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(qty + 1))}
        className="flex h-12 w-12 items-center justify-center text-neutral-400 transition-colors hover:text-brand-white"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useQuantity(initial = 1): [number, (n: number) => void] {
  const [qty, setQty] = useState(initial);
  const clamp = (n: number) => Math.max(1, Math.min(99, n));
  return [qty, (n: number) => setQty(clamp(n))];
}
