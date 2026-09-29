/**
 * Small desk diary — opens on hover, closes on leave.
 */
export default function DeskDiary({ className = "" }) {
  return (
    <div
      className={`desk-diary group pointer-events-auto relative ${className}`}
      aria-label="Desk diary — hover to open"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-collage/hero-diary-closed.png"
        alt=""
        className="desk-diary__img desk-diary__img--closed absolute inset-0 h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(12,22,56,0.18)] transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:opacity-0 group-hover:rotate-[-4deg]"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-collage/hero-diary-open.png"
        alt=""
        className="desk-diary__img desk-diary__img--open absolute inset-0 h-full w-full object-contain opacity-0 drop-shadow-[0_12px_16px_rgba(12,22,56,0.2)] transition-all duration-300 ease-out group-hover:scale-[1.06] group-hover:opacity-100 group-hover:rotate-[3deg]"
        draggable={false}
      />
    </div>
  );
}
