export interface CartLine {
  lineId: number;
  productId: number;
  handle?: string;
  name: string;
  imageUrl: string;
  qty: number;
  priceUnit: number;
  lineTotal: number;
}

export interface CartSummary {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export function emptySummary(): CartSummary {
  return { lines: [], itemCount: 0, subtotal: 0, tax: 0, deliveryFee: 0, total: 0 };
}
