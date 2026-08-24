"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";

/**
 * Invisible client island that hydrates the cart store from the
 * BFF (which owns the kb_cart_token cookie) once on first mount.
 */
export default function CartHydration() {
  const hydrate = useCartStore((s) => s.hydrate);
  const hydrated = useCartStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrated, hydrate]);

  return null;
}
