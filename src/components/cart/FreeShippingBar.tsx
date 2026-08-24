interface FreeShippingBarProps {
  subtotal: number;
  threshold?: number;
}

export default function FreeShippingBar({
  subtotal,
  threshold = 8000,
}: FreeShippingBarProps) {
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const unlocked = remaining === 0;

  return (
    <div className="border-b-2 border-brand-gray-dark px-5 py-4">
      <p className="font-mono text-[11px] tracking-widest uppercase">
        {unlocked ? (
          <span className="text-brand-mpesa-green">
            /// Free delivery unlocked
          </span>
        ) : (
          <span className="text-neutral-400">
            KES {remaining.toLocaleString("en-US")} away from{" "}
            <span className="text-brand-white">free delivery</span>
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full bg-brand-gray-dark">
        <div
          className={`h-full transition-all duration-500 ${
            unlocked ? "bg-brand-mpesa-green" : "bg-brand-accent-red"
          }`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Free shipping progress"
        />
      </div>
    </div>
  );
}
