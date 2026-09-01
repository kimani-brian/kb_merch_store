"use client";

import { create } from "zustand";
import type { CartLine, CartSummary } from "@/lib/cart";

interface CartState {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  /** Drawer visibility */
  isOpen: boolean;
  /** True while the initial hydration from /api/cart is in flight. */
  hydrated: boolean;

  openDrawer: () => void;
  closeDrawer: () => void;
  setCart: (summary: CartSummary) => void;
  hydrate: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
  isOpen: false,
  hydrated: false,

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  setCart: (summary) =>
    set({
      lines: summary.lines,
      itemCount: summary.itemCount,
      subtotal: summary.subtotal,
      tax: summary.tax,
      deliveryFee: summary.deliveryFee ?? 0,
      total: summary.total,
      hydrated: true,
    }),

  hydrate: async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const summary = await res.json();
      set({
        lines: summary.lines ?? [],
        itemCount: summary.itemCount ?? 0,
        subtotal: summary.subtotal ?? 0,
        tax: summary.tax ?? 0,
        deliveryFee: summary.deliveryFee ?? 0,
        total: summary.total ?? 0,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },
}));
