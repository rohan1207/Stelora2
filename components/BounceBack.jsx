import { motion } from "framer-motion";
import TextScatter from "@/components/TextScatter";

/**
 * Retention beat — clients scatter, then bounce back to Stelora.
 */
export default function BounceBack() {
  return (
    <section
      id="retention"
      className="relative flex min-h-[52svh] items-center justify-center overflow-hidden border-t border-stelora-line bg-stelora-canvas md:min-h-[48svh]"
      aria-labelledby="bounce-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 70% at 50% 40%, rgba(26, 48, 123, 0.07) 0%, transparent 70%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 55%, #efebe3 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-14 text-center md:px-8 md:py-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 font-display text-[0.65rem] font-bold uppercase tracking-[0.26em] text-stelora-muted md:mb-5"
        >
          Why clients stay
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          <TextScatter
            text="Bounce Back."
            as="h2"
            id="bounce-heading"
            velocity={180}
            rotation={70}
            scale={1.04}
            returnAfter={0.2}
            duration={2}
            className="font-display text-[clamp(2.4rem,9vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.04em] text-stelora-navy"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-sm font-body text-[0.9rem] leading-relaxed text-stelora-muted md:mt-6 md:text-[0.95rem]"
        >
          Partnerships that return — again and again.
        </motion.p>
      </div>
    </section>
  );
}
