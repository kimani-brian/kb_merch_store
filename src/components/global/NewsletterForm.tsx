"use client";

export default function NewsletterForm() {
  return (
    <form
      className="mt-4 flex"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        required
        placeholder="YOUR@EMAIL.COM"
        aria-label="Email address"
        className="w-full border-2 border-brand-gray-dark bg-transparent px-4 py-3 font-mono text-xs tracking-wider text-brand-white uppercase placeholder:text-neutral-600 focus:border-brand-white focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 border-2 border-l-0 border-brand-white bg-brand-white px-6 text-xs font-bold tracking-[0.2em] text-brand-black uppercase transition-colors hover:bg-brand-black hover:text-brand-white"
      >
        Sign up
      </button>
    </form>
  );
}
