"use client";

import { useState } from "react";
import AddToCartCTA from "@/components/product/AddToCartCTA";
import QuantitySelector, { useQuantity } from "@/components/product/QuantitySelector";
import SizeSelector from "@/components/product/SizeSelector";

interface PurchaseBlockProps {
  productId: number;
  soldOut: boolean;
}

/**
 * Sticky purchase block: size selection, quantity stepper and the CTA.
 * Client island — the surrounding PDP stays server-rendered.
 */
export default function PurchaseBlock({ productId, soldOut }: PurchaseBlockProps) {
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useQuantity(1);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
          Size
        </p>
        <SizeSelector selected={size} onSelect={setSize} />
      </div>

      <div className="flex items-end gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            Qty
          </p>
          <QuantitySelector qty={qty} onChange={setQty} />
        </div>
      </div>

      <div className="pt-2">
        <AddToCartCTA
          productId={productId}
          qty={qty}
          disabled={soldOut}
        />
        {!soldOut && !size && (
          <p className="mt-3 font-mono text-[11px] tracking-wider text-neutral-600 uppercase">
            Select a size to complete your fit.
          </p>
        )}
      </div>
    </div>
  );
}
