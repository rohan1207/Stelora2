import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/packages", label: "Packages" },
  { href: "/testimonials", label: "Client testimonials" },
  { href: "/case-studies", label: "Case studies" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={[
          "w-full overflow-hidden transition-[background-color,box-shadow,border-color,border-radius] duration-200 ease-out",
          solid
            ? "rounded-b-[1.5rem] border-b border-stelora-line bg-stelora-canvas shadow-[0_10px_28px_rgba(12,22,56,0.1)] md:rounded-b-[2rem]"
            : "rounded-b-none border-b border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <nav
          className="mx-auto flex h-[4.75rem] w-full max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 md:h-[5.25rem] md:px-10 lg:px-14"
          aria-label="Primary"
        >
          <Link href="/" className="relative z-50 flex shrink-0 items-center" aria-label="Stelora home">
            <Image
              src="/logo.webp"
              alt="Stelora Media"
              width={220}
              height={72}
              priority
              className="h-12 w-auto object-contain md:h-14"
            />
          </Link>

          <ul className="hidden flex-1 items-center justify-center gap-4 xl:gap-6 2xl:gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap font-body text-[0.72rem] font-bold uppercase tracking-[0.14em] text-stelora-ink/80 transition-colors duration-200 hover:text-stelora-navy xl:text-[0.78rem] xl:tracking-[0.16em]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center lg:flex">
            <Link href="/contact" className="btn-pill btn-pill-primary px-5 py-2.5 text-[0.7rem] xl:px-6 xl:py-3 xl:text-[0.75rem]">
              <span>Contact us</span>
              <span aria-hidden="true" className="text-[0.9em]">
                ↗
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-6 flex-col gap-1.5">
              <span
                className={`block h-[1.5px] w-full bg-stelora-navy transition duration-200 ease-out ${
                  open ? "translate-y-[7.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-stelora-navy transition duration-200 ease-out ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-stelora-navy transition duration-200 ease-out ${
                  open ? "-translate-y-[7.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-stelora-line lg:hidden"
            >
              <ul className="flex flex-col gap-1 px-6 py-7">
                {NAV_LINKS.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display block py-2.5 text-xl font-bold uppercase tracking-hero text-stelora-navy sm:text-2xl"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="btn-pill btn-pill-primary px-6 py-3.5 text-xs"
                  >
                    <span>Contact us</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
