import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Folder from "@/components/Folder";
import LanyardMount from "@/components/LanyardMount";
import MusicCard from "@/components/MusicCard";
import MoodCollage from "@/components/MoodCollage";
import HeroDeskCollage from "@/components/HeroDeskCollage";
import LedClock from "@/components/LedClock";
import IdCardDragHint from "@/components/IdCardDragHint";
import TicketTearHint from "@/components/TicketTearHint";
import ClientOnly from "@/components/ClientOnly";

const TearTicket = dynamic(() => import("@/components/TearTicket"), { ssr: false });
const CursorGridClient = dynamic(() => import("@/components/CursorGrid"), { ssr: false });
const FuzzyText = dynamic(() => import("@/components/FuzzyText"), { ssr: false });

const fade = (delay = 0, extra = {}) => ({
  initial: { opacity: 0, y: 16, ...extra },
  animate: { opacity: 1, y: 0, rotate: extra.rotate || 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
});

const IDLE_RESUME_MS = 3200;

export default function Hero() {
  const [cardIdle, setCardIdle] = useState(true);
  const [ticketTorn, setTicketTorn] = useState(false);
  const [ticketHover, setTicketHover] = useState(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  const markCardActive = () => {
    setCardIdle(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setCardIdle(true);
    }, IDLE_RESUME_MS);
  };

  return (
    <section
      className="relative min-h-[100svh] overflow-x-hidden bg-stelora-canvas pt-[4.25rem] md:h-[100svh] md:max-h-[100svh] md:overflow-hidden md:pt-0"
      aria-labelledby="hero-brand"
    >
      <div className="pointer-events-auto absolute inset-0 z-0">
        <ClientOnly>
          <CursorGridClient
            cellSize={70}
            color="#1A307B"
            gridColor="#9AA3B8"
            radius={140}
            falloff="smooth"
            holdTime={400}
            fadeDuration={800}
            lineWidth={1.55}
            maxOpacity={1}
            fillOpacity={0.08}
            gridOpacity={0.28}
            cellRadius={0}
            clickPulse
            pulseSpeed={600}
          />
        </ClientOnly>
      </div>

      {/* Lanyard stage — idle sway is on this wrapper only; Lanyard itself unchanged */}
      <div
        className={`pointer-events-auto relative z-[15] h-[34svh] min-h-[200px] w-full md:absolute md:inset-0 md:h-auto md:min-h-0 ${
          cardIdle ? "lanyard-idle-sway" : "lanyard-idle-sway is-interacting"
        }`}
        onPointerDown={markCardActive}
        onPointerMove={(e) => {
          if (e.buttons > 0) markCardActive();
        }}
        onWheel={markCardActive}
      >
        <LanyardMount
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          fov={20}
          offset={[-5.1, 0.15, 0]}
          ropeLength={0.7}
          cardLayout="founder"
          frontImage="/founder.jpeg"
          backImage="/logo.webp"
          imageFit="cover"
          lanyardWidth={0.42}
        />
      </div>

      <IdCardDragHint visible={cardIdle} />

      <div className="pointer-events-none relative z-20 mx-auto h-auto w-full max-w-7xl px-4 pb-10 pt-2 md:h-full md:px-8 md:pb-0 md:pt-[5.25rem]">
        <div className="relative flex w-full flex-col items-center gap-5 md:block md:h-[calc(100svh-5.25rem)] md:gap-0">
          {/* Desk flat-lay collage — upper center */}
          <motion.div
            className="pointer-events-auto relative z-20 w-[min(340px,88vw)] md:absolute md:left-1/2 md:top-[1%] md:w-[min(440px,78vw)] md:-translate-x-1/2"
            {...fade(0.15)}
          >
            <HeroDeskCollage />
          </motion.div>

          {/* Plant — left of brand; base tilt + hover motion */}
          <motion.div
            className="pointer-events-auto relative z-40 w-[min(88px,26vw)] origin-bottom self-start pl-2 md:absolute md:left-[16%] md:top-[9%] md:w-[180px] md:pl-0 lg:left-[18%]"
            initial={{ opacity: 0, y: 16, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -8 }}
            whileHover={{ scale: 1.07, rotate: -14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-collage/hero-plant.png"
              alt=""
              className="w-full origin-bottom cursor-pointer select-none drop-shadow-[0_14px_18px_rgba(12,22,56,0.18)]"
              draggable={false}
            />
          </motion.div>

          {/* Mood collage — top right */}
          <motion.div
            className="pointer-events-auto relative z-20 origin-top-right scale-[0.72] md:absolute md:right-[-10%] md:top-[16%] md:scale-100 lg:right-[-8%]"
            {...fade(0.2, { rotate: 5 })}
          >
            <MoodCollage />
          </motion.div>

          {/* Center brand */}
          <div className="pointer-events-none relative z-30 w-full max-w-[960px] text-center md:absolute md:left-1/2 md:top-[48%] md:w-[min(960px,94vw)] md:-translate-x-1/2 md:-translate-y-1/2">
            <motion.h1
              id="hero-brand"
              className="pointer-events-auto flex flex-col items-center justify-center gap-1 font-display md:gap-2"
              {...fade(0.25)}
            >
              <span className="sr-only">Stelora Media</span>
              <ClientOnly
                fallback={
                  <span className="mx-auto block max-w-full font-display font-extrabold leading-none tracking-[-0.04em] text-[#1A307B] [font-size:clamp(2.35rem,14vw,7rem)]">
                    STELORA
                  </span>
                }
              >
                <FuzzyText
                  fontSize="clamp(2.35rem, 14vw, 7rem)"
                  fontWeight={800}
                  fontFamily='"Space Grotesk", sans-serif'
                  color="#1A307B"
                  baseIntensity={0.14}
                  hoverIntensity={0.42}
                  enableHover
                  fuzzRange={22}
                  letterSpacing={3}
                  className="mx-auto block max-w-full"
                >
                  STELORA
                </FuzzyText>
              </ClientOnly>
              <ClientOnly
                fallback={
                  <span className="mx-auto block max-w-full font-display font-extrabold leading-none tracking-[-0.04em] text-[#1A307B] [font-size:clamp(2.35rem,14vw,7rem)]">
                    MEDIA
                  </span>
                }
              >
                <FuzzyText
                  fontSize="clamp(2.35rem, 14vw, 7rem)"
                  fontWeight={800}
                  fontFamily='"Space Grotesk", sans-serif'
                  color="#1A307B"
                  baseIntensity={0.14}
                  hoverIntensity={0.42}
                  enableHover
                  fuzzRange={22}
                  letterSpacing={3}
                  className="mx-auto block max-w-full"
                >
                  MEDIA
                </FuzzyText>
              </ClientOnly>
            </motion.h1>
            <motion.p
              className="mt-3 font-display text-[clamp(0.68rem,3.4vw,1rem)] font-bold uppercase tracking-[0.18em] text-stelora-ink md:mt-4 md:tracking-[0.22em]"
              {...fade(0.35)}
            >
              We craft. Then we amplify.
            </motion.p>
            <motion.div
              className="pointer-events-auto mt-4 flex flex-wrap justify-center gap-2.5 md:mt-5 md:gap-3"
              {...fade(0.45)}
            >
              <Link
                href="/contact"
                className="btn-pill btn-pill-primary px-5 py-2.5 text-[0.62rem] md:px-6 md:text-[0.68rem]"
              >
                <span>Book a call</span>
              </Link>
              <Link
                href="/services"
                className="btn-pill btn-pill-outline px-5 py-2.5 text-[0.62rem] md:px-6 md:text-[0.68rem]"
              >
                <span>Explore services</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </motion.div>
          </div>

          {/* Folder — bottom left */}
          <motion.div
            className="pointer-events-auto relative z-40 overflow-visible rotate-[-4deg] md:absolute md:bottom-[8%] md:left-44 lg:left-52"
            {...fade(0.4, { rotate: -4 })}
          >
            <div className="-m-4 overflow-visible p-4 md:-m-12 md:p-12">
              <Folder
                color="#1A307B"
                size={1.18}
                items={[
                  <span key="marketing" className="px-1 text-center font-display text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-[#1A307B]">
                    Marketing
                  </span>,
                  <span key="website" className="px-1 text-center font-display text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-[#1A307B]">
                    Website
                  </span>,
                  <span key="seo" className="px-1 text-center font-display text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-[#1A307B]">
                    SEO
                  </span>,
                ]}
              />
            </div>
          </motion.div>

          {/* Tear ticket — vintage admit ticket */}
          <motion.div
            className="ticket-hero pointer-events-auto relative z-30 w-[min(300px,92vw)] origin-bottom scale-[0.92] md:absolute md:bottom-[5%] md:left-[44%] md:w-[min(320px,58vw)] md:-translate-x-1/2 md:scale-[0.8] lg:scale-[0.84]"
            {...fade(0.5, { rotate: -3 })}
            onMouseEnter={() => setTicketHover(true)}
            onMouseLeave={() => setTicketHover(false)}
          >
            <div className="relative">
              <ClientOnly>
              <TearTicket
                className="tear-ticket--vintage"
                image="/images/atmosphere.jpg"
                imageAlt="Your ticket to brand success"
                stub={
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center text-stelora-cream">
                    <p className="font-display text-[9px] font-bold uppercase tracking-[0.22em] opacity-70">
                      Stelora
                    </p>
                    <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em]">
                      {ticketTorn ? "Booked" : "Admit one"}
                    </p>
                    <div className="my-1 h-px w-10 bg-stelora-cream/35" />
                    <p className="text-[10px] leading-snug opacity-85">
                      {ticketTorn ? "Confirmed" : "Brand success"}
                    </p>
                    <span className="mt-1 font-mono text-[9px] opacity-55">No. 01</span>
                  </div>
                }
                orientation="horizontal"
                scrim
                imageRadius={6}
                width={480}
                height={200}
                stubSize={108}
                radius={12}
                holes={11}
                holeSize={5}
                notch={3}
                tearAngle={28}
                stretch={28}
                resistance={0.42}
                rotate={-3}
                tilt
                tiltMax={7}
                background="#f3e6cc"
                stubBackground="#1a307b"
                color="#1a307b"
                border
                borderColor="#1a307b"
                borderWidth={1.25}
                recenter
                onTear={() => setTicketTorn(true)}
                ariaLabel="Tear stub to book your ticket"
              >
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                  <div className="pointer-events-none absolute inset-0 bg-[#f3e6cc]/88" />
                  <div className="relative">
                    <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[#1a307b]/70">
                      Event pass · Stelora Media
                    </p>
                    <p className="mt-1.5 font-display text-[1.05rem] font-bold uppercase leading-[1.1] tracking-hero text-[#1a307b] sm:text-[1.2rem]">
                      {ticketTorn ? (
                        <>
                          Ticket booked
                        </>
                      ) : (
                        <>
                          Your ticket to
                          <br />
                          brand success
                        </>
                      )}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#1a307b]/75">
                      {ticketTorn ? "See you in the brand lab" : "Tear along the line · book your seat"}
                    </p>
                  </div>
                </div>
              </TearTicket>
              </ClientOnly>

              <TicketTearHint visible={!ticketTorn && ticketHover} />
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            className="pointer-events-auto relative z-20 w-full max-w-[280px] rotate-[2deg] md:absolute md:bottom-[4%] md:left-auto md:right-[30%] md:w-[min(280px,70vw)]"
            {...fade(0.55, { rotate: 2 })}
          >
            <div className="overflow-hidden rounded-xl border border-stelora-line bg-stelora-surface/95 shadow-[0_12px_28px_rgba(12,22,56,0.1)] backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-stelora-line bg-[#efece4] px-2.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono text-[9px] text-stelora-muted">stelora — zsh</span>
              </div>
              <pre className="overflow-x-auto p-2.5 font-mono text-[9px] leading-relaxed text-stelora-ink sm:text-[10px]">
{`~ $ whoami
Full-stack growth agency
~ $ ls services/
social/ seo/ ads/ brand/`}
              </pre>
            </div>
          </motion.div>

          {/* Music card — bottom right */}
          <motion.div
            className="pointer-events-auto relative z-20 rotate-[4deg] md:absolute md:bottom-[8%] md:right-4"
            {...fade(0.45, { rotate: 4 })}
          >
            <MusicCard />
          </motion.div>

          {/* LED pocket watch */}
          <motion.div
            className="relative z-10 rotate-[10deg] md:absolute md:right-[20%] md:top-[36%]"
            {...fade(0.6, { rotate: 10 })}
            whileHover={{ scale: 1.06, rotate: 6 }}
          >
            <div className="rounded-md border-4 border-stelora-navy bg-stelora-cream p-1 shadow-lg">
              <LedClock />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
