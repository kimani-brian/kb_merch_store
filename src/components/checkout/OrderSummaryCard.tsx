"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { formatKES } from "@/lib/utils";

const FLAT_DELIVERY_FEE = 300;
export const FREE_SHIPPING_THRESHOLD = 8000;

export default function OrderSummaryCard() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal);
  const tax = useCartStore((s) => s.tax);

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = lines.length === 0 || freeShipping ? 0 : FLAT_DELIVERY_FEE;
  const total = subtotal + tax + deliveryFee;

  return (
    <aside
      aria-label="Order summary"
      className="border-2 border-brand-gray-dark bg-brand-gray-dark/30"
    >
      <h2 className="border-b-2 border-brand-gray-dark px-5 py-4 font-display text-2xl tracking-widest text-brand-white uppercase">
        Order summary
      </h2>

      {/* Itemized list */}
      <ul className="divide-y divide-brand-gray-dark px-5">
        {lines.map((line) => (
          <li key={line.lineId} className="flex justify-between gap-3 py-3 font-mono text-xs">
            <span className="min-w-0 truncate text-neutral-300 uppercase">
              {line.qty}× {line.name}
            </span>
            <span className="shrink-0 text-neutral-400">
              {formatKES(line.lineTotal)}
            </span>
          </li>
        ))}
        {lines.length === 0 && (
          <li className="py-6 text-center font-mono text-xs text-neutral-600 uppercase">
            Cart is empty —{" "}
            <Link href="/shop" className="underline hover:text-brand-white">
              shop the drop
            </Link>
          </li>
        )}
      </ul>

      <dl className="space-y-2 border-t-2 border-brand-gray-dark px-5 py-5 font-mono text-xs">
        <div className="flex justify-between text-neutral-400">
          <dt className="uppercase">Subtotal</dt>
          <dd>{formatKES(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-neutral-400">
          <dt className="uppercase">VAT (16%)</dt>
          <dd>{formatKES(tax)}</dd>
        </div>
        <div className="flex justify-between text-neutral-400">
          <dt className="uppercase">Delivery</dt>
          <dd className={freeShipping ? "text-brand-mpesa-green" : ""}>
            {deliveryFee === 0 ? "FREE" : formatKES(deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between border-t-2 border-brand-gray-dark pt-3 text-base font-bold text-brand-white">
          <dt className="uppercase">Total</dt>
          <dd>{formatKES(total)}</dd>
        </div>
      </dl>

      <p className="border-t-2 border-brand-gray-dark px-5 py-3 text-center font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
        Final charge happens on M-Pesa PIN confirmation
      </p>

      {/* Hidden total for the payment box */}
      <data id="checkout-total" value={total} className="hidden" />
    </aside>
  );
}
