import TrueFocus from "@/components/TrueFocus";

/**
 * Stelora slogan — brands into focus.
 */
export default function BrandFocus() {
  return (
    <section
      id="focus"
      className="relative flex min-h-[50svh] items-center justify-center overflow-hidden border-t border-stelora-line bg-stelora-canvas"
      aria-labelledby="brand-focus-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 70% at 50% 45%, rgba(26, 48, 123, 0.08) 0%, transparent 68%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 55%, #ebe7df 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-14 text-center md:px-8 md:py-16">
        <p className="mb-6 font-display text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stelora-muted md:mb-8">
          Our promise
        </p>

        <h2 id="brand-focus-heading" className="sr-only">
          We bring brands into focus
        </h2>

        <TrueFocus
          sentence="We bring brands into focus."
          manualMode={false}
          blurAmount={4.5}
          borderColor="#1A307B"
          glowColor="rgba(26, 48, 123, 0.45)"
          animationDuration={0.55}
          pauseBetweenAnimations={0.85}
        />

        <p className="mt-8 max-w-sm font-body text-[0.88rem] leading-relaxed text-stelora-muted md:mt-10 md:text-[0.95rem]">
          Clarity in craft. Sharpness in growth. Every brand deserves to be seen.
        </p>
      </div>
    </section>
  );
}
