"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import ThemeToggle from "@/components/global/ThemeToggle";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Drops", href: "/drops" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount);
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-brand-gray-dark bg-brand-black/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-3xl tracking-widest text-brand-white uppercase transition-colors hover:text-brand-accent-red"
        >
          KB-MERCH
        </Link>

        {/* Primary nav (placeholder until Odoo routes API is wired in Phase 2) */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase transition-colors hover:text-brand-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border-2 border-transparent text-neutral-400 transition-colors hover:border-brand-gray-dark hover:text-brand-white"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            onClick={openDrawer}
            className="relative flex h-10 w-10 items-center justify-center border-2 border-transparent text-neutral-400 transition-colors hover:border-brand-gray-dark hover:text-brand-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center bg-brand-accent-red px-1 font-mono text-[10px] font-bold text-brand-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t-2 border-brand-gray-dark bg-brand-gray-dark">
          <form
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-500" />
            <input
              autoFocus
              type="search"
              placeholder="SEARCH THE DROP..."
              aria-label="Search products"
              className="w-full bg-transparent font-mono text-sm tracking-wider text-brand-white uppercase placeholder:text-neutral-600 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="text-neutral-500 transition-colors hover:text-brand-white"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
