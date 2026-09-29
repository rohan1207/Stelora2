import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const CircularCarousel = dynamic(() => import("@/components/CircularCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-body text-sm text-stelora-muted">
      Loading ring…
    </div>
  ),
});

const RING_ITEMS = [
  {
    src: "/images/dome/dome-product-skincare.png",
    alt: "Skincare product still",
    title: "Skincare",
    subtitle: "Product",
  },
  {
    src: "/images/dome/dome-place-cafe.png",
    alt: "Cafe lifestyle frame",
    title: "Cafe",
    subtitle: "Place",
  },
  {
    src: "/images/dome/dome-fashion-detail.png",
    alt: "Fashion detail shoot",
    title: "Fashion",
    subtitle: "Detail",
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
  {
    src: "/images/photoshoot.jpg",
    alt: "Studio photoshoot",
    title: "Studio",
    subtitle: "Shoot",
  },
  {
    src: "/images/atmosphere.jpg",
    alt: "Atmosphere frame",
    title: "Atmosphere",
    subtitle: "Mood",
  },
  {
    src: "/images/hero.jpg",
    alt: "Campaign hero",
    title: "Hero",
    subtitle: "Campaign",
  },
  {
    src: "/founder.jpeg",
    alt: "Founder on location",
    title: "Founder",
    subtitle: "On set",
  },
  {
    src: "/images/collage/moodboard.jpg",
    alt: "Moodboard texture",
    title: "Moodboard",
    subtitle: "Creative",
  },
  {
    src: "/images/collage/vinyl.jpg",
    alt: "Vinyl still",
    title: "Vinyl",
    subtitle: "Still",
  },
];

/**
 * Full-viewport circular ring of campaign frames.
 * Extra sticky travel keeps the orbit from being flicked past.
 */
export default function CircularReel() {
  return (
    <section
      id="orbit"
      data-scroll-dwell
      className="relative border-t border-stelora-line bg-stelora-canvas"
      style={{ height: "158svh" }}
      aria-labelledby="orbit-heading"
    >
      <div className="sticky top-0 flex h-[100svh] max-h-[100svh] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 50% at 50% 45%, rgba(26, 48, 123, 0.08) 0%, transparent 70%), linear-gradient(180deg, #f7f5ef 0%, #f4f2ec 55%, #ebe8e0 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl shrink-0 px-5 pt-6 text-center md:px-8 md:pt-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="font-display text-[0.65rem] font-bold uppercase tracking-[0.26em] text-stelora-muted"
          >
            Orbit gallery
          </motion.p>
          <motion.h2
            id="orbit-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-2 font-display text-[clamp(1.6rem,4.5vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.035em] text-stelora-navy"
          >
            Around the brand
          </motion.h2>
        </div>

        <div className="relative z-10 min-h-0 w-full flex-1">
          <CircularCarousel
            items={RING_ITEMS}
            preset="cylinder"
            intro="rise"
            cardWidth={300}
            aspectRatio={1}
            gap={18}
            speed={12}
            captions
            fadeColor="#f4f2ec"
            cornerRadius={16}
            perspective={2200}
          />
        </div>
      </div>
    </section>
  );
}
