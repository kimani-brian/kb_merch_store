"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { formatKES } from "@/lib/utils";
import FreeShippingBar from "@/components/cart/FreeShippingBar";
import CartItemRow from "@/components/cart/CartItemRow";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal);
  const tax = useCartStore((s) => s.tax);
  const total = useCartStore((s) => s.total);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-over panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l-2 border-brand-gray-dark bg-brand-black transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-brand-gray-dark px-5 py-4">
          <h2 className="font-display text-2xl tracking-widest text-brand-white uppercase">
            Your cart<span className="text-brand-accent-red">.</span>
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center border-2 border-transparent text-neutral-400 transition-colors hover:border-brand-gray-dark hover:text-brand-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <FreeShippingBar subtotal={subtotal} />

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="font-display text-3xl tracking-widest text-neutral-600 uppercase">
                Empty cart
              </p>
              <p className="font-mono text-xs tracking-wider text-neutral-700 uppercase">
                The drop won&apos;t wait forever.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="mt-2 border-2 border-brand-white px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] text-brand-white uppercase transition-colors hover:bg-brand-white hover:text-brand-black"
              >
                Shop now
              </Link>
            </div>
          ) : (
            lines.map((line) => (
              <CartItemRow key={line.lineId} line={line} />
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t-2 border-brand-gray-dark px-5 py-5">
            <dl className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <dt className="uppercase">Subtotal</dt>
                <dd>{formatKES(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-neutral-400">
                <dt className="uppercase">VAT (16%)</dt>
                <dd>{formatKES(tax)}</dd>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-brand-white">
                <dt className="uppercase">Total</dt>
                <dd>{formatKES(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="mt-5 flex h-14 w-full items-center justify-center gap-3 border-2 border-brand-white bg-brand-white text-sm font-bold tracking-[0.25em] text-brand-black uppercase transition-colors hover:bg-brand-black hover:text-brand-white"
            >
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
              M-Pesa STK Push // secure checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
