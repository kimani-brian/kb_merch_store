import Link from "next/link";
import NewsletterForm from "@/components/global/NewsletterForm";

const POLICY_LINKS = [
  { label: "Delivery Policy", href: "/policies/delivery" },
  { label: "Returns & Exchanges", href: "/policies/returns" },
  { label: "Size Guide", href: "/policies/sizing" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-brand-gray-dark bg-brand-black">
      {/* Newsletter + brand statement */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <h2 className="font-display text-4xl tracking-widest text-brand-white uppercase">
            KB-MERCH
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
            Raw. Unapologetic. Limited drop culture from Nairobi to the world.
            Every piece is a numbered run — once it&apos;s gone, it&apos;s gone.
          </p>
        </div>

        {/* Newsletter sign-up */}
        <div className="md:col-span-1">
          <h3 className="text-xs font-bold tracking-[0.25em] text-brand-white uppercase">
            Join the drop list
          </h3>
          <p className="mt-2 font-mono text-xs text-neutral-500">
            Early access. No spam. Unsubscribe anytime.
          </p>
          <NewsletterForm />
        </div>

        {/* Policy links */}
        <nav aria-label="Policies" className="lg:justify-self-end">
          <h3 className="text-xs font-bold tracking-[0.25em] text-brand-white uppercase">
            Info
          </h3>
          <ul className="mt-4 space-y-3">
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs tracking-wider text-neutral-500 uppercase transition-colors hover:text-brand-accent-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-gray-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-mono text-[11px] tracking-wider text-neutral-600 uppercase sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} KB-MERCH. All rights reserved.</span>
          <span>Nairobi, Kenya // Pay via M-Pesa</span>
        </div>
      </div>
    </footer>
  );
}
