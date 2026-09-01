"use client";

import { useState } from "react";
import AddToCartCTA from "@/components/product/AddToCartCTA";
import QuantitySelector, { useQuantity } from "@/components/product/QuantitySelector";
import VariantSelector from "@/components/product/VariantSelector";
import type { OdooProductAttribute, OdooProductVariant } from "@/types/odoo";

interface PurchaseBlockProps {
  productId: number;
  soldOut: boolean;
  attributes: OdooProductAttribute[];
  variants: OdooProductVariant[];
}

/**
 * Sticky purchase block: size selection, quantity stepper and the CTA.
 * Client island — the surrounding PDP stays server-rendered.
 */
export default function PurchaseBlock({
  productId,
  soldOut,
  attributes,
  variants,
}: PurchaseBlockProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [qty, setQty] = useQuantity(1);
  const selectableAttributes = attributes.filter((attribute) =>
    variants.some((variant) =>
      variant.attributes.some((value) => value.attribute_id === attribute.id),
    ),
  );
  const selectedVariant = variants.find((variant) =>
    selectableAttributes.every((attribute) =>
      variant.attributes.some(
        (value) =>
          value.attribute_id === attribute.id &&
          value.value_id === selected[attribute.id],
      ),
    ),
  );
  const selectionComplete = selectableAttributes.every(
    (attribute) => selected[attribute.id] != null,
  );
  const activeProductId = selectedVariant?.id ?? productId;
  const variantSoldOut = selectedVariant ? selectedVariant.qty_available <= 0 : false;
  const disabled =
    soldOut ||
    !selectionComplete ||
    !selectedVariant ||
    !selectedVariant.sale_ok ||
    variantSoldOut;

  function selectVariant(attributeId: number, valueId: number) {
    setSelected((current) => ({ ...current, [attributeId]: valueId }));
  }

  return (
    <div className="mt-8 space-y-6">
      {selectableAttributes.length > 0 && (
        <VariantSelector
          attributes={selectableAttributes}
          selected={selected}
          onSelect={selectVariant}
        />
      )}

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
          productId={activeProductId}
          qty={qty}
          disabled={disabled}
        />
        {!soldOut && !selectionComplete && selectableAttributes.length > 0 && (
          <p className="mt-3 font-mono text-[11px] tracking-wider text-neutral-600 uppercase">
            Select all options to complete your fit.
          </p>
        )}
      </div>
    </div>
  );
}
