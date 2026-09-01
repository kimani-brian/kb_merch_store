"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Smartphone } from "lucide-react";
import { useCheckoutStore, isValidKenyanPhone } from "@/stores/useCheckoutStore";
import { useCartStore } from "@/stores/useCartStore";
import { formatKES } from "@/lib/utils";

export default function MPesaPaymentBox() {
  const router = useRouter();
  const [payPhone, setPayPhone] = useState("");
  const [touched, setTouched] = useState(false);

  const stkState = useCheckoutStore((s) => s.stkState);
  const customer = useCheckoutStore((s) => s.customer);
  const startPayment = useCheckoutStore((s) => s.startPayment);

  const lines = useCartStore((s) => s.lines);
  const itemCount = useCartStore((s) => s.itemCount);
  const total = useCartStore((s) => s.total);
  const setCart = useCartStore((s) => s.setCart);

  const detailsValid =
    customer.name !== "" &&
    customer.email !== "" &&
    customer.county !== "" &&
    isValidKenyanPhone(customer.phone);
  const phoneValid = isValidKenyanPhone(payPhone);
  const canPay = detailsValid && phoneValid && lines.length > 0;

  async function pay() {
    if (!canPay || stkState !== "idle") return;
    // Sync the payment phone into the checkout details before firing.
    useCheckoutStore.getState().setCustomer({ phone: payPhone });
    await useCheckoutStore.getState().startPayment(
      (orderName, txnId) => {
        // Reset the local cart (server already expired the cookie).
        setCart({ lines: [], itemCount: 0, subtotal: 0, tax: 0, deliveryFee: 0, total: 0 });
        router.push(
          `/checkout/success?order=${encodeURIComponent(orderName)}&txn=${encodeURIComponent(txnId ?? "")}&total=${total}`,
        );
      },
    );
  }

  return (
    <section aria-label="M-Pesa payment" className="border-2 border-brand-mpesa-green/60">
      {/* Branded header */}
      <div className="flex items-center justify-between bg-brand-mpesa-green px-5 py-3">
        <span className="font-display text-xl tracking-widest text-ink uppercase">
          M-PESA
        </span>
        <span className="font-mono text-[10px] font-bold tracking-widest text-ink/80 uppercase">
          Safaricom STK Push
        </span>
      </div>

      <div className="space-y-4 p-5">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            M-Pesa number for this payment *
          </span>
          <input
            inputMode="tel"
            value={payPhone}
            onChange={(e) => setPayPhone(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="07XX XXX XXX"
            className={`w-full border-2 bg-transparent px-4 py-3 font-mono text-sm tracking-widest text-brand-white placeholder:text-neutral-700 focus:outline-none ${
              !touched || phoneValid
                ? "border-brand-gray-dark focus:border-brand-mpesa-green"
                : "border-brand-accent-red"
            }`}
          />
          {touched && !phoneValid && (
            <span className="mt-1 block font-mono text-[10px] text-brand-accent-red">
              Enter a valid Safaricom number (07XX / 01XX)
            </span>
          )}
        </label>

        <button
          type="button"
          onClick={pay}
          disabled={!canPay || stkState !== "idle"}
          className={`flex h-14 w-full items-center justify-center gap-3 border-2 text-sm font-bold tracking-[0.2em] uppercase transition-colors ${
            canPay && stkState === "idle"
              ? "border-brand-mpesa-green bg-brand-mpesa-green text-ink hover:bg-transparent hover:text-brand-mpesa-green"
              : "cursor-not-allowed border-brand-gray-dark bg-transparent text-neutral-600"
          }`}
        >
          <Smartphone className="h-5 w-5" />
          Pay {formatKES(total)} via M-Pesa
        </button>

        {!detailsValid && (
          <p className="font-mono text-[10px] tracking-wider text-neutral-600 uppercase">
            Complete your delivery details to enable payment.
          </p>
        )}

        {stkState === "error" && (
          <p className="border-2 border-brand-accent-red p-3 font-mono text-xs text-brand-accent-red">
            {useCheckoutStore.getState().errorMessage}
          </p>
        )}
        {stkState === "failed" && (
          <p className="border-2 border-brand-accent-red p-3 font-mono text-xs text-brand-accent-red">
            {useCheckoutStore.getState().errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
