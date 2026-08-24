"use client";

import { useState } from "react";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import type { CartSummary } from "@/lib/cart";

interface AddToCartCTAProps {
  productId: number;
  qty: number;
  disabled?: boolean;
}

type CtaState = "idle" | "loading" | "added" | "error";

export default function AddToCartCTA({
  productId,
  qty,
  disabled = false,
}: AddToCartCTAProps) {
  const [state, setState] = useState<CtaState>("idle");
  const setCart = useCartStore((s) => s.setCart);
  const openDrawer = useCartStore((s) => s.openDrawer);

  async function addToCart() {
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "add failed");
      }
      setCart(data as CartSummary);
      setState("added");
      openDrawer();
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  const label = {
    idle: "Add to cart",
    loading: "Adding...",
    added: "Added ✓",
    error: "Failed — retry",
  }[state];

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={disabled || state === "loading"}
      className={`flex h-14 w-full items-center justify-center gap-3 border-2 text-sm font-bold tracking-[0.25em] uppercase transition-colors ${
        state === "added"
          ? "border-brand-mpesa-green bg-brand-mpesa-green text-ink"
          : state === "error"
            ? "border-brand-accent-red bg-transparent text-brand-accent-red"
            : disabled
              ? "cursor-not-allowed border-brand-gray-dark bg-transparent text-neutral-600"
              : "border-brand-white bg-brand-white text-brand-black hover:bg-brand-black hover:text-brand-white"
      }`}
    >
      {state === "loading" ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : state === "added" ? (
        <Check className="h-5 w-5" />
      ) : (
        <ShoppingBag className="h-5 w-5" />
      )}
      {label}
    </button>
  );
}
