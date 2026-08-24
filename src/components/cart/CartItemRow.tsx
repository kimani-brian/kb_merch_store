"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { odooImageUrl } from "@/services/odooClient";
import { formatKES } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import type { CartLine } from "@/lib/cart";

export default function CartItemRow({ line }: { line: CartLine }) {
  const setCart = useCartStore((s) => s.setCart);

  async function mutate(method: "PATCH" | "DELETE", body: object) {
    // Optimistic update
    const prev = useCartStore.getState();
    if (method === "DELETE") {
      setCart({
        lines: prev.lines.filter((l) => l.lineId !== line.lineId),
        itemCount:
          prev.itemCount - line.qty,
        subtotal: prev.subtotal - line.lineTotal,
        tax: Math.round((prev.subtotal - line.lineTotal) * 0.16),
        total:
          Math.round((prev.subtotal - line.lineTotal) * 1.16),
      });
    } else {
      setCart({
        ...prev,
        lines: prev.lines.map((l) =>
          l.lineId === line.lineId ? { ...l, qty: (body as { qty: number }).qty } : l,
        ),
        itemCount:
          prev.itemCount - line.qty + (body as { qty: number }).qty,
      });
    }

    try {
      const res = await fetch("/api/cart", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setCart(await res.json());
      } else {
        setCart({
          lines: prev.lines,
          itemCount: prev.itemCount,
          subtotal: prev.subtotal,
          tax: prev.tax,
          total: prev.total,
        }); // rollback
      }
    } catch {
      setCart({
        lines: prev.lines,
        itemCount: prev.itemCount,
        subtotal: prev.subtotal,
        tax: prev.tax,
        total: prev.total,
      });
    }
  }

  return (
    <div className="flex gap-4 border-b border-brand-gray-dark py-4">
      {/* Thumbnail */}
      <Link href={`/products/${line.handle ?? ""}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden border-2 border-brand-gray-dark bg-brand-gray-dark">
          {line.imageUrl ? (
            <Image
              src={odooImageUrl(line.imageUrl)}
              alt={line.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center font-display text-xl text-neutral-700">
              KB
            </span>
          )}
        </div>
      </Link>

      {/* Info + controls */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-base tracking-wide text-brand-white uppercase">
            {line.name}
          </p>
          <button
            type="button"
            aria-label={`Remove ${line.name} from cart`}
            onClick={() => mutate("DELETE", { lineId: line.lineId })}
            className="text-neutral-600 transition-colors hover:text-brand-accent-red"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Qty stepper */}
          <div className="inline-flex items-center border border-brand-gray-dark">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() =>
                line.qty <= 1
                  ? mutate("DELETE", { lineId: line.lineId })
                  : mutate("PATCH", { lineId: line.lineId, qty: line.qty - 1 })
              }
              className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-brand-white"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold text-brand-white">
              {line.qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => mutate("PATCH", { lineId: line.lineId, qty: line.qty + 1 })}
              className="flex h-8 w-8 items-center justify-center text-neutral-400 hover:text-brand-white"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <p className="font-mono text-sm font-bold text-brand-white">
            {formatKES(line.lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
