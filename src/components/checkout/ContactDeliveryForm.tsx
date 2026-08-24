"use client";

import { useCheckoutStore, isValidKenyanPhone } from "@/stores/useCheckoutStore";

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu (Eldoret)",
  "Kiambu", "Machakos", "Kajiado", "Nyeri", "Meru", "Kakamega",
  "Kisii", "Bungoma", "Kilifi", "Trans Nzoia",
];

export default function ContactDeliveryForm() {
  const customer = useCheckoutStore((s) => s.customer);
  const setCustomer = useCheckoutStore((s) => s.setCustomer);

  const phoneValid =
    customer.phone === "" || isValidKenyanPhone(customer.phone);

  return (
    <section aria-label="Contact and delivery details" className="space-y-6">
      <div>
        <h2 className="font-display text-2xl tracking-widest text-brand-white uppercase">
          Delivery details
        </h2>
        <p className="mt-1 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
          /// We only deliver within Kenya
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            Full name *
          </span>
          <input
            required
            value={customer.name}
            onChange={(e) => setCustomer({ name: e.target.value })}
            className="w-full border-2 border-brand-gray-dark bg-transparent px-4 py-3 font-mono text-sm text-brand-white focus:border-brand-white focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            Email *
          </span>
          <input
            required
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer({ email: e.target.value })}
            placeholder="you@example.com"
            className="w-full border-2 border-brand-gray-dark bg-transparent px-4 py-3 font-mono text-sm text-brand-white placeholder:text-neutral-700 focus:border-brand-white focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            M-Pesa phone *
          </span>
          <input
            required
            inputMode="tel"
            value={customer.phone}
            onChange={(e) => setCustomer({ phone: e.target.value })}
            placeholder="07XX XXX XXX"
            className={`w-full border-2 bg-transparent px-4 py-3 font-mono text-sm text-brand-white placeholder:text-neutral-700 focus:outline-none ${
              phoneValid
                ? "border-brand-gray-dark focus:border-brand-white"
                : "border-brand-accent-red"
            }`}
          />
          {!phoneValid && (
            <span className="mt-1 block font-mono text-[10px] text-brand-accent-red">
              Use 07XX / 01XX / +254 format
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            County / City *
          </span>
          <select
            required
            value={customer.county}
            onChange={(e) => setCustomer({ county: e.target.value })}
            className="w-full border-2 border-brand-gray-dark bg-brand-black px-4 py-3 font-mono text-sm text-brand-white focus:border-brand-white focus:outline-none"
          >
            <option value="">Select county</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            Delivery notes / street
          </span>
          <textarea
            rows={3}
            value={customer.street}
            onChange={(e) => setCustomer({ street: e.target.value })}
            placeholder="Building, gate code, drop-off instructions..."
            className="w-full resize-none border-2 border-brand-gray-dark bg-transparent px-4 py-3 font-mono text-sm text-brand-white placeholder:text-neutral-700 focus:border-brand-white focus:outline-none"
          />
        </label>
      </div>

    </section>
  );
}
