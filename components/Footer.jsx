import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const TechText = dynamic(() => import("@/components/TechText"), { ssr: false });

const YEAR = new Date().getFullYear();

const SOCIAL = [
  { label: "Instagram", href: "#contact" },
  { label: "LinkedIn", href: "#contact" },
  { label: "Behance", href: "#contact" },
];

const OTHER = [
  { label: "Privacy Policy", href: "#contact" },
  { label: "Terms of Use", href: "#contact" },
  { label: "Careers", href: "#contact" },
];

function CornerArrow() {
  return (
    <div className="footer-corner" aria-hidden>
      <span className="footer-corner__bracket footer-corner__bracket--tl" />
      <span className="footer-corner__bracket footer-corner__bracket--tr" />
      <span className="footer-corner__bracket footer-corner__bracket--bl" />
      <span className="footer-corner__bracket footer-corner__bracket--br" />
      <svg
        className="footer-corner__arrow"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M7 7h14v14M21 7L7 21"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="footer relative overflow-hidden border-t border-stelora-line"
      aria-labelledby="footer-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 15% 0%, rgba(26, 48, 123, 0.07) 0%, transparent 55%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 45%, #ebe7df 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-8 pt-16 sm:px-8 md:px-10 md:pt-20 lg:px-14 lg:pt-24">
        {/* Top CTA */}
        <div className="flex items-start justify-between gap-6 border-b border-stelora-line/80 pb-10 md:gap-8 md:pb-14">
          <div className="min-w-0 flex-1">
            <h2 id="footer-heading" className="sr-only">
              Ready to discuss your next project?
            </h2>
            <div className="relative w-full max-w-[18ch] md:max-w-none">
              <div
                className="relative w-full"
                style={{ height: "clamp(3.25rem, 8.5vw, 5.5rem)" }}
              >
                <TechText
                  text="READY TO DISCUSS"
                  fontFamily='"Space Grotesk", sans-serif'
                  fontWeight={700}
                  fontSize={96}
                  letterSpacing={-0.035}
                  color="#1A307B"
                  accentColor="#1A307B"
                  align="left"
                  reveal="letter"
                  reach={140}
                  softness={0.65}
                  dashLength={4}
                  dashGap={2}
                  strokeWidth={1.5}
                  lineStyle="dashed"
                  specks={10}
                  selection
                  labels
                  draggable
                  sweep
                  speed={0.85}
                />
              </div>
              <div
                className="relative w-full"
                style={{ height: "clamp(3.25rem, 8.5vw, 5.5rem)", marginTop: "-0.15em" }}
              >
                <TechText
                  text="YOUR NEXT PROJECT?"
                  fontFamily='"Space Grotesk", sans-serif'
                  fontWeight={700}
                  fontSize={96}
                  letterSpacing={-0.035}
                  color="#1A307B"
                  accentColor="#1A307B"
                  align="left"
                  reveal="letter"
                  reach={140}
                  softness={0.65}
                  dashLength={4}
                  dashGap={2}
                  strokeWidth={1.5}
                  lineStyle="dashed"
                  specks={10}
                  selection
                  labels
                  draggable
                  sweep
                  speed={0.85}
                />
              </div>
            </div>
          </div>
          <a
            href="#contact"
            className="mt-2 hidden shrink-0 text-stelora-navy transition-transform duration-500 hover:translate-x-1 hover:translate-y-1 md:mt-4 md:block"
            aria-label="Stay on Stelora home"
          >
            <CornerArrow />
          </a>
        </div>

        {/* Columns */}
        <div className="grid gap-12 border-b border-stelora-line/80 py-12 md:grid-cols-2 md:gap-10 md:py-16 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link
              href="#contact"
              className="btn-pill btn-pill-outline inline-flex px-6 py-3.5 text-[0.72rem] text-stelora-navy"
            >
              <span aria-hidden>↗</span>
              <span>Work with us</span>
            </Link>
          </div>

          <div className="space-y-10">
            <div>
              <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stelora-navy">
                Hello
              </p>
              <a
                href="#contact"
                className="mt-4 block font-body text-[0.95rem] text-stelora-ink transition-colors hover:text-stelora-navy"
              >
                hello@stelora.com
              </a>
              <p className="mt-3 font-body text-[0.88rem] leading-relaxed text-stelora-muted">
                Headquarters
                <br />
                Remote-first · Worldwide
              </p>
              <p className="mt-3 font-body text-[0.88rem] leading-relaxed text-stelora-muted">
                Studio
                <br />
                Social · SEO · Brand · Shoot
              </p>
            </div>
            <div>
              <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stelora-navy">
                Opening hours
              </p>
              <p className="mt-4 font-body text-[0.88rem] leading-relaxed text-stelora-muted">
                Monday to Friday
                <br />
                9AM – 6PM IST
              </p>
            </div>
          </div>

          <div>
            <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stelora-navy">
              Social
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-stelora-ink transition-colors hover:text-stelora-navy"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stelora-navy">
              Other
            </p>
            <ul className="mt-4 space-y-2.5">
              {OTHER.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-stelora-ink transition-colors hover:text-stelora-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-8 pt-8 md:flex-row md:items-end md:justify-between md:gap-6 md:pt-10">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Stelora Media home">
            <Image
              src="/logo.webp"
              alt="Stelora Media"
              width={160}
              height={52}
              className="h-10 w-auto object-contain md:h-11"
            />
          </Link>

          <div className="max-w-md text-center font-body text-[0.72rem] leading-relaxed text-stelora-muted md:flex-1">
            <p>All content © Stelora Media {YEAR}</p>
            <p className="mt-1">
              Designed and developed by{" "}
              <span className="font-semibold text-stelora-navy">Stelora Media</span>
            </p>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            className="btn-pill btn-pill-outline shrink-0 px-5 py-2.5 text-[0.68rem] text-stelora-navy"
          >
            <span aria-hidden>↑</span>
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
