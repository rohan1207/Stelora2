/**
 * Flat-lay collage — torn paper with diary, coffee, and pencil stuck on the strip.
 * Plant lives separately in Hero (left of brand).
 */
import DeskDiary from "@/components/DeskDiary";

export default function HeroDeskCollage({ className = "" }) {
  return (
    <div
      className={`hero-desk-collage relative mx-auto w-full ${className}`}
      aria-label="Creative desk flat lay"
    >
      <div className="hero-desk-collage__stage relative mx-auto w-[96%]">
        {/* Tan kraft tape — top-left, behind objects */}
        <div
          className="pointer-events-none absolute left-[8%] top-[6%] z-[3] h-[28%] w-[28%] -rotate-[2deg] rounded-[1px] bg-[#c4a574] shadow-[0_4px_10px_rgba(12,22,56,0.12)]"
          aria-hidden
        />

        {/* Torn paper — props are positioned against this strip */}
        <svg
          className="hero-desk-collage__paper relative z-[2] h-auto w-full drop-shadow-[0_12px_20px_rgba(12,22,56,0.14)]"
          viewBox="0 0 640 120"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="#f7f4ee"
            stroke="rgba(12,22,56,0.06)"
            strokeWidth="1"
            d="M8 28
              C28 18, 48 36, 72 24
              C96 12, 120 32, 148 22
              C176 12, 200 30, 228 20
              C256 10, 280 28, 312 18
              C344 8, 372 26, 404 16
              C436 6, 464 24, 496 14
              C528 4, 556 22, 584 16
              C604 12, 624 20, 632 28
              L632 92
              C612 104, 588 86, 560 98
              C532 110, 504 90, 472 102
              C440 114, 408 92, 376 104
              C344 116, 312 94, 280 106
              C248 118, 216 96, 184 108
              C152 120, 120 98, 88 110
              C56 122, 32 100, 8 92
              Z"
          />
        </svg>

        {/* Sticky props — seated on the paper band */}
        <DeskDiary className="absolute left-[1%] top-[-64%] z-[5] h-[95%] w-[36%] sm:left-[3%] sm:top-[-62%] sm:w-[34%]" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-collage/hero-coffee.png"
          alt=""
          className="desk-prop pointer-events-auto absolute left-[50%] top-[0%] z-[6] w-[32%] origin-center -translate-x-1/2 cursor-pointer select-none drop-shadow-[0_10px_14px_rgba(12,22,56,0.18)] transition-transform duration-300 ease-out hover:scale-[1.06] hover:rotate-[-3deg] sm:w-[30%]"
          draggable={false}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-collage/hero-pencil.png"
          alt=""
          className="desk-prop pointer-events-auto absolute right-[2%] top-[-4%] z-[5] w-[28%] origin-center rotate-[16deg] cursor-pointer select-none drop-shadow-[0_10px_14px_rgba(12,22,56,0.18)] transition-transform duration-300 ease-out hover:scale-[1.07] hover:rotate-[24deg] sm:right-[5%] sm:w-[26%]"
          draggable={false}
        />
      </div>
    </div>
  );
}
