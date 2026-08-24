import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { formatKES } from "@/lib/utils";

interface SuccessProps {
  searchParams: Promise<{
    order?: string;
    txn?: string;
    total?: string;
  }>;
}

const TIMELINE = [
  { label: "Order placed", done: true },
  { label: "Warehouse packing", done: false },
  { label: "Dispatched", done: false },
  { label: "Delivered", done: false },
];

export default async function CheckoutSuccessPage({ searchParams }: SuccessProps) {
  const { order, txn, total } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Confirmation header */}
      <div className="text-center">
        <CheckCircle2
          className="mx-auto h-20 w-20 text-brand-mpesa-green"
          strokeWidth={1.5}
        />
        <h1 className="mt-6 font-display text-5xl tracking-widest text-brand-white uppercase sm:text-6xl">
          Payment received
        </h1>
        <p className="mt-3 font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
          Your fit is locked in /// No restocks
        </p>
      </div>

      {/* Receipt */}
      <div className="mt-12 border-2 border-brand-gray-dark">
        <div className="flex items-center justify-between border-b-2 border-brand-mpesa-green bg-brand-mpesa-green px-5 py-3">
          <span className="font-display text-xl tracking-widest text-ink uppercase">
            M-Pesa receipt
          </span>
          <span className="font-mono text-xs font-bold text-ink/80 uppercase">
            Confirmed
          </span>
        </div>

        <dl className="space-y-3 px-5 py-6 font-mono text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500 uppercase">Order number</dt>
            <dd className="font-bold text-brand-white">{order || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500 uppercase">M-Pesa code</dt>
            <dd className="font-bold text-brand-white">{txn || "PENDING"}</dd>
          </div>
          {total && (
            <div className="flex justify-between">
              <dt className="text-neutral-500 uppercase">Amount paid</dt>
              <dd className="font-bold text-brand-mpesa-green">
                {formatKES(Number(total) || 0)}
              </dd>
            </div>
          )}
        </dl>

        {/* Delivery timeline */}
        <div className="border-t-2 border-brand-gray-dark px-5 py-6">
          <p className="mb-5 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            Delivery timeline
          </p>
          <ol className="space-y-0">
            {TIMELINE.map((step, i) => (
              <li key={step.label} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`h-3 w-3 shrink-0 ${
                      step.done ? "bg-brand-mpesa-green" : "bg-brand-gray-dark border-2 border-neutral-700"
                    }`}
                  />
                  {i < TIMELINE.length - 1 && (
                    <span
                      className={`w-[2px] self-stretch ${step.done ? "bg-brand-mpesa-green/50" : "bg-brand-gray-dark"}`}
                      style={{ minHeight: 28 }}
                    />
                  )}
                </div>
                <div className={i === TIMELINE.length - 1 ? "" : "pb-5"}>
                  <p
                    className={`pt-0.5 font-mono text-xs uppercase ${
                      step.done ? "text-brand-white" : "text-neutral-600"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="border-2 border-brand-white px-8 py-3 font-mono text-xs font-bold tracking-[0.2em] text-brand-white uppercase transition-colors hover:bg-brand-white hover:text-brand-black"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="border-2 border-brand-gray-dark px-8 py-3 font-mono text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase transition-colors hover:border-neutral-400 hover:text-brand-white"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
