"use client";

import { create } from "zustand";

export type StkState =
  | "idle" // form entry
  | "initiating" // POST /api/payment/stk in flight
  | "polling" // waiting for user PIN / confirmation
  | "paid"
  | "failed"
  | "error";

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string; // delivery contact
  county: string;
  street: string;
}

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 60_000;

interface CheckoutState {
  customer: CustomerDetails;
  stkState: StkState;
  requestId: number | null;
  orderName: string | null;
  txnId: string | null;
  errorMessage: string | null;

  setCustomer: (patch: Partial<CustomerDetails>) => void;
  reset: () => void;
  /**
   * Fire the STK push and start the polling loop. Callbacks:
   * - onPaid(orderName, txnId) — navigate to success screen.
   */
  startPayment: (
    onPaid: (orderName: string, txnId: string | null) => void,
  ) => Promise<void>;
  cancelPolling: () => void;
}

let pollTimer: ReturnType<typeof setInterval> | null = null;
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

function stopTimers() {
  if (pollTimer) clearInterval(pollTimer);
  if (timeoutTimer) clearTimeout(timeoutTimer);
  pollTimer = null;
  timeoutTimer = null;
}

/** Kenyan phone: 07XXXXXXXX, 01XXXXXXXX or +2547XXXXXXXX */
export function isValidKenyanPhone(phone: string): boolean {
  return /^(?:\+254|0)(?:7|1)\d{8}$/.test(phone.replace(/[\s-]/g, ""));
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  customer: { name: "", email: "", phone: "", county: "", street: "" },
  stkState: "idle",
  requestId: null,
  orderName: null,
  txnId: null,
  errorMessage: null,

  setCustomer: (patch) =>
    set({ customer: { ...get().customer, ...patch } }),

  reset: () => {
    stopTimers();
    set({
      stkState: "idle",
      requestId: null,
      orderName: null,
      txnId: null,
      errorMessage: null,
    });
  },

  cancelPolling: () => {
    stopTimers();
    set({
      stkState: "failed",
      errorMessage: "Payment window expired. No money was taken.",
    });
  },

  startPayment: async (onPaid) => {
    stopTimers();
    set({ stkState: "initiating", errorMessage: null });

    try {
      const res = await fetch("/api/payment/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: get().customer.phone }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Could not reach M-Pesa");
      }
      set({
        stkState: "polling",
        requestId: data.request_id,
        orderName: data.order_name ?? null,
      });

      const started = Date.now();
      pollTimer = setInterval(async () => {
        const id = get().requestId;
        if (!id || pollTimer == null) return;
        try {
          const statusRes = await fetch(
            `/api/payment/stk/status?request_id=${id}`,
            { cache: "no-store" },
          );
          const status = await statusRes.json();

          if (status.status === "paid") {
            stopTimers();
            set({ stkState: "paid", txnId: status.txn_id ?? null });
            onPaid(status.order_name ?? "", status.txn_id ?? null);
          } else if (
            status.status === "cancelled" ||
            status.status === "failed"
          ) {
            stopTimers();
            set({
              stkState: "failed",
              errorMessage:
                status.status === "cancelled"
                  ? "Request cancelled on your phone."
                  : "The payment failed. Please try again.",
            });
          } else if (Date.now() - started > POLL_TIMEOUT_MS) {
            stopTimers();
            set({
              stkState: "failed",
              errorMessage: "Payment window expired. No money was taken.",
            });
          }
        } catch {
          /* transient network error — keep polling until timeout */
        }
      }, POLL_INTERVAL_MS);

      timeoutTimer = setTimeout(() => get().cancelPolling(), POLL_TIMEOUT_MS + POLL_INTERVAL_MS);
    } catch (e) {
      set({
        stkState: "error",
        errorMessage: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },
}));
