import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ClientOnly from "@/components/ClientOnly";

const FlexCarousel = dynamic(() => import("@/components/FlexCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-body text-sm text-stelora-muted">
      Loading reel…
    </div>
  ),
});

const REEL_ITEMS = [
  {
    src: "/images/dome/dome-product-skincare.png",
    alt: "Skincare product still",
    title: "Skincare Still",
    subtitle: "Product",
  },
  {
    src: "/images/dome/dome-place-cafe.png",
    alt: "Cafe lifestyle frame",
    title: "Cafe Light",
    subtitle: "Place",
  },
  {
    src: "/images/dome/dome-fashion-detail.png",
    alt: "Fashion detail shoot",
    title: "Fashion Detail",
    subtitle: "Look",
  },
  {
    src: "/images/dome/dome-place-boutique.png",
    alt: "Boutique interior",
    title: "Boutique",
    subtitle: "Interior",
  },
  {
    src: "/images/dome/dome-product-food.png",
    alt: "Food brand plating",
    title: "Plating",
    subtitle: "Food",
  },
  {
    src: "/images/dome/dome-place-rooftop.png",
    alt: "Rooftop terrace",
    title: "Rooftop",
    subtitle: "Place",
  },
  {
    src: "/images/dome/dome-people-founder.png",
    alt: "Founder portrait",
    title: "Founder",
    subtitle: "Portrait",
  },
  {
    src: "/images/dome/dome-product-jewelry.png",
    alt: "Jewelry product shoot",
    title: "Jewelry",
    subtitle: "Product",
  },
  {
    src: "/images/dome/dome-place-mountains.png",
    alt: "Mountain location",
    title: "Mountains",
    subtitle: "Location",
  },
  {
    src: "/images/dome/dome-product-home.png",
    alt: "Homeware still life",
    title: "Homeware",
    subtitle: "Still",
  },
];

const COUNT = REEL_ITEMS.length;
/** Scroll distance per frame — after the last frame, page scroll continues normally. */
const STEP_VH = 44;

/**
 * Full-viewport reel — scroll drives frames one-by-one (no infinite loop).
 * Going down unlocks after the last image; going up re-locks until the first.
 */
export default function FlexReel() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sync = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const total = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const next = Math.min(COUNT - 1, Math.max(0, Math.round(progress * (COUNT - 1))));
      setIndex((prev) => (prev === next ? prev : next));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        sync();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="reel"
      ref={trackRef}
      data-scroll-dwell
      className="relative border-t border-stelora-line bg-stelora-canvas"
      style={{ height: `calc(100svh + ${(COUNT - 1) * STEP_VH}svh)` }}
      aria-labelledby="reel-heading"
    >
      <div className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 55%, rgba(26, 48, 123, 0.07) 0%, transparent 70%), linear-gradient(180deg, #f7f5ef 0%, #f4f2ec 50%, #ebe8e0 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl shrink-0 px-5 pt-8 text-center md:px-8 md:pt-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="font-display text-[0.65rem] font-bold uppercase tracking-[0.26em] text-stelora-muted"
          >
            Campaign reel
          </motion.p>
          <motion.h2
            id="reel-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.035em] text-stelora-navy"
          >
            Frames in motion
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mx-auto mt-2 max-w-md font-body text-[0.85rem] leading-relaxed text-stelora-muted md:text-[0.95rem]"
          >
            Keep scrolling — each frame advances. After the last, the page moves on.
          </motion.p>
        </div>

        <div className="relative z-10 min-h-0 w-full flex-1 pb-4">
          <ClientOnly
            fallback={
              <div className="flex h-full items-center justify-center font-body text-sm text-stelora-muted">
                Loading reel…
              </div>
            }
          >
          <FlexCarousel
            items={REEL_ITEMS}
            index={index}
            preset="liquid"
            intro="rise"
            cardHeight={0.52}
            gap={12}
            squeeze={0.15}
            focusOnClick={false}
            captions
            loop={false}
            autoplay={false}
            captureWheel={false}
            drag={false}
          />
          </ClientOnly>
        </div>
      </div>
    </section>
  );
}
