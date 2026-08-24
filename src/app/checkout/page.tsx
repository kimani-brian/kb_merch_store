"use client";

import ContactDeliveryForm from "@/components/checkout/ContactDeliveryForm";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import MPesaPaymentBox from "@/components/checkout/MPesaPaymentBox";
import STKWaitingModal from "@/components/checkout/STKWaitingModal";

export default function CheckoutPage() {
  return (
    <>
      <STKWaitingModal />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="font-mono text-xs tracking-[0.35em] text-brand-accent-red uppercase">
            /// Secure checkout
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-widest text-brand-white uppercase">
            Checkout
          </h1>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* Left column — details */}
          <ContactDeliveryForm />

          {/* Right column — summary + payment */}
          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <MPesaPaymentBox />
            <OrderSummaryCard />
          </div>
        </div>
      </div>
    </>
  );
}
