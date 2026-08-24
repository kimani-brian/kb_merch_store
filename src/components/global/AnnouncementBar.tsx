const TICKER_ITEMS = [
  "DROP 01 // LIVE NOW",
  "FREE DELIVERY ON ORDERS OVER KES 8,000",
  "LIMITED STOCK — NO RESTOCKS",
  "NAIROBI // WORLDWIDE SHIPPING",
  "PAY VIA M-PESA — INSTANT CONFIRMATION",
];

export default function AnnouncementBar() {
  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      aria-label="Store announcements"
      className="relative z-50 overflow-hidden border-b-2 border-brand-black bg-brand-accent-red py-1.5"
    >
      <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap pr-12">
        {ticker.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-xs tracking-[0.25em] text-brand-white uppercase"
          >
            {item}
            <span aria-hidden className="ml-12 text-ink">
              ///
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
