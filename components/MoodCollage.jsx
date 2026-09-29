import { useState } from "react";

const DEFAULT_ITEMS = [
  { src: "/images/collage/moodboard.jpg", alt: "Moodboard texture", rotate: -4, x: "8%", y: "10%", w: "58%" },
  { src: "/images/photoshoot.jpg", alt: "Photoshoot still", rotate: 6, x: "42%", y: "28%", w: "52%" },
  { src: "/images/atmosphere.jpg", alt: "Atmosphere shot", rotate: -8, x: "14%", y: "48%", w: "48%" },
  { src: "/images/collage/torn-strip.jpg", alt: "Creative flat lay", rotate: 3, x: "46%", y: "58%", w: "44%" },
];

export default function MoodCollage({
  items = DEFAULT_ITEMS,
  caption = "capture the brand",
}) {
  const [active, setActive] = useState(null);
  const [hoveredBoard, setHoveredBoard] = useState(false);

  const featured = active ?? (hoveredBoard ? 1 : null);

  return (
    <div
      className="mood-collage group relative w-[min(232px,36vw)] rotate-[5deg] md:w-[268px]"
      onMouseEnter={() => setHoveredBoard(true)}
      onMouseLeave={() => {
        setHoveredBoard(false);
        setActive(null);
      }}
    >
      <div className="relative overflow-visible rounded-sm border border-[#c4a882] bg-[#c4a882] p-2.5 shadow-[0_14px_30px_rgba(12,22,56,0.14)] transition duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[3/4] overflow-visible rounded-[2px] bg-[#ebe4d6] p-1">
          {items.map((item, i) => {
            const isUp = featured === i;
            return (
              <button
                key={item.src + i}
                type="button"
                className="absolute overflow-hidden rounded-[2px] border border-white/70 bg-white shadow-[0_6px_14px_rgba(12,22,56,0.18)] transition-transform duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stelora-navy"
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.w,
                  zIndex: isUp ? 20 : 2 + i,
                  transform: isUp
                    ? `rotate(${item.rotate}deg) scale(1.28) translateY(-10px)`
                    : `rotate(${item.rotate}deg) scale(1)`,
                }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-label={item.alt}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" className="aspect-square h-auto w-full object-cover" />
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-right font-display text-[10px] italic text-[#3d2b1a] md:text-[11px]">
          {caption}
        </p>
      </div>
    </div>
  );
}
