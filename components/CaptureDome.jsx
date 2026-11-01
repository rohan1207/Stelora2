import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ClientOnly from "@/components/ClientOnly";

const DomeGallery = dynamic(() => import("@/components/DomeGallery"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[480px] items-center justify-center font-body text-sm text-stelora-muted">
      Loading gallery…
    </div>
  ),
});

const SHOOT_IMAGES = [
  { src: "/images/dome/dome-product-skincare.png", alt: "Skincare product still" },
  { src: "/images/dome/dome-place-cafe.png", alt: "Cafe lifestyle frame" },
  { src: "/images/dome/dome-fashion-detail.png", alt: "Fashion detail shoot" },
  { src: "/images/dome/dome-place-boutique.png", alt: "Boutique interior" },
  { src: "/images/dome/dome-product-food.png", alt: "Food brand plating" },
  { src: "/images/dome/dome-place-rooftop.png", alt: "Rooftop terrace" },
  { src: "/images/dome/dome-people-founder.png", alt: "Founder portrait" },
  { src: "/images/dome/dome-product-jewelry.png", alt: "Jewelry product shoot" },
  { src: "/images/dome/dome-place-mountains.png", alt: "Mountain location" },
  { src: "/images/dome/dome-product-home.png", alt: "Homeware still life" },
  { src: "/images/photoshoot.jpg", alt: "Studio photoshoot" },
  { src: "/images/atmosphere.jpg", alt: "Atmosphere frame" },
  { src: "/images/hero.jpg", alt: "Campaign hero" },
  { src: "/founder.jpeg", alt: "Founder on location" },
  { src: "/images/collage/moodboard.jpg", alt: "Moodboard texture" },
  { src: "/images/collage/vinyl.jpg", alt: "Vinyl still" },
];

/**
 * Photoshoot dome — a spinning gallery of frames we've captured.
 * Sticky dwell keeps the gallery from being flicked past on fast scroll.
 */
export default function CaptureDome() {
  return (
    <section
      id="photoshoot"
      data-scroll-dwell
      className="relative border-t border-stelora-line bg-stelora-canvas"
      style={{ height: "148svh" }}
      aria-labelledby="capture-heading"
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 40%, rgba(26, 48, 123, 0.06) 0%, transparent 70%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 55%, #ebe7df 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-20 mx-auto w-full max-w-4xl px-5 pt-12 text-center md:px-8 md:pt-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="font-display text-[0.65rem] font-bold uppercase tracking-[0.26em] text-stelora-muted"
          >
            Photoshoot
          </motion.p>
          <motion.h2
            id="capture-heading"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 font-display text-[clamp(1.85rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-stelora-navy"
          >
            Through our lens
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mx-auto mt-3 max-w-md font-body text-[0.92rem] leading-relaxed text-stelora-muted md:text-[1rem]"
          >
            A glimpse of the light we chase — products, places, and people, framed
            for brands that want to be seen.
          </motion.p>
          <p className="mt-4 font-display text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stelora-muted/70">
            Hover to pause · click a frame · drag to orbit
          </p>
        </div>

        <div className="relative z-10 w-full min-h-0 flex-1" style={{ minHeight: 560 }}>
          <ClientOnly
            fallback={
              <div className="flex h-full min-h-[480px] items-center justify-center font-body text-sm text-stelora-muted">
                Loading gallery…
              </div>
            }
          >
          <DomeGallery
            images={SHOOT_IMAGES}
            fit={0.95}
            fitBasis="width"
            minRadius={300}
            maxRadius={2400}
            padFactor={0.06}
            overlayBlurColor="#f4f2ec"
            grayscale={false}
            imageBorderRadius="18px"
            openedImageBorderRadius="22px"
            openedImageWidth="440px"
            openedImageHeight="440px"
            segments={35}
            dragDampening={2}
            autoSpinSpeed={3.2}
            hoverInfluence={2}
          />
          </ClientOnly>
        </div>
      </div>
    </section>
  );
}
