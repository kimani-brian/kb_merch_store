"use client";

import { useEffect, useState } from "react";
import { useCheckoutStore } from "@/stores/useCheckoutStore";

const TOTAL_SECONDS = 60;

export default function STKWaitingModal() {
  const stkState = useCheckoutStore((s) => s.stkState);
  const cancelPolling = useCheckoutStore((s) => s.cancelPolling);
  const errorMessage = useCheckoutStore((s) => s.errorMessage);
  const orderName = useCheckoutStore((s) => s.orderName);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  const visible = stkState === "polling";

  // Countdown
  useEffect(() => {
    if (!visible) {
      setSecondsLeft(TOTAL_SECONDS);
      return;
    }
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [visible]);

  if (!visible) return null;

  const circumference = 2 * Math.PI * 28;
  const progress = secondsLeft / TOTAL_SECONDS;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-label="Awaiting M-Pesa confirmation"
    >
      <div className="w-full max-w-sm border-2 border-brand-gray-dark bg-brand-black p-8 text-center">
        {/* Pulsing phone */}
        <div className="relative mx-auto h-24 w-24">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-mpesa-green/30" />
          <span className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-brand-mpesa-green bg-brand-black">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-10 w-10 text-brand-mpesa-green">
              <rect x="7" y="2" width="10" height="20" rx="2" />
              <path d="M11 18h2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <h2 className="mt-6 font-display text-3xl tracking-widest text-brand-white uppercase">
          Check your phone!
        </h2>
        <p className="mt-2 font-mono text-xs leading-relaxed tracking-wider text-neutral-400">
          Enter your M-Pesa PIN to complete the payment.
          {orderName && (
            <>
              <br />
              Order <span className="text-brand-white">{orderName}</span>
            </>
          )}
        </p>

        {/* Circular countdown */}
        <div className="relative mx-auto mt-6 h-16 w-16">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" className="stroke-brand-gray-dark" />
            <circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="butt"
              className={`transition-all duration-1000 ${secondsLeft <= 15 ? "stroke-brand-accent-red" : "stroke-brand-mpesa-green"}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-brand-white">
            {secondsLeft}s
          </span>
        </div>

        <p className="mt-4 font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
          Do not close this window
        </p>

        <button
          type="button"
          onClick={cancelPolling}
          className="mt-5 border-2 border-brand-gray-dark px-5 py-2 font-mono text-[11px] tracking-widest text-neutral-400 uppercase transition-colors hover:border-brand-accent-red hover:text-brand-accent-red"
        >
          Cancel / retry
        </button>
      </div>
    </div>
  );
}
