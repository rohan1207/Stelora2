import { useEffect, useRef, useState } from "react";

/**
 * Soft chill hop-style preview via Web Audio (no external file).
 */
function createAmbientEngine() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;

  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2200;
  filter.Q.value = 0.55;
  filter.connect(master);

  // Warm pad chord: Fmaj7 → Am7 vibes (F A C E / A C E G)
  const padNotes = [174.61, 220.0, 261.63, 329.63];
  const padOscs = padNotes.map((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.value = 0.028 + i * 0.006;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    return { osc, gain };
  });

  // Plucky arpeggio over F–A–C–E–G–A
  const arp = [349.23, 440.0, 523.25, 659.25, 783.99, 880.0, 783.99, 659.25];
  let arpIndex = 0;
  const pluck = ctx.createOscillator();
  const pluckGain = ctx.createGain();
  const pluckFilter = ctx.createBiquadFilter();
  pluck.type = "triangle";
  pluck.frequency.value = arp[0];
  pluckGain.gain.value = 0;
  pluckFilter.type = "lowpass";
  pluckFilter.frequency.value = 1800;
  pluck.connect(pluckFilter);
  pluckFilter.connect(pluckGain);
  pluckGain.connect(master);
  pluck.start();

  // Soft high shimmer
  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = "sine";
  shimmer.frequency.value = 987.77;
  shimmerGain.gain.value = 0.012;
  shimmer.connect(shimmerGain);
  shimmerGain.connect(filter);
  shimmer.start();

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.22;
  lfoGain.gain.value = 0.01;
  lfo.connect(lfoGain);
  lfoGain.connect(master.gain);
  lfo.start();

  const stepMs = 280;
  const timer = window.setInterval(() => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    const note = arp[arpIndex % arp.length];
    arpIndex += 1;
    pluck.frequency.setValueAtTime(note, now);
    pluckGain.gain.cancelScheduledValues(now);
    pluckGain.gain.setValueAtTime(0.0001, now);
    pluckGain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  }, stepMs);

  return {
    ctx,
    master,
    stop() {
      try {
        window.clearInterval(timer);
        padOscs.forEach(({ osc }) => osc.stop());
        pluck.stop();
        shimmer.stop();
        lfo.stop();
        ctx.close();
      } catch {
        /* ignore */
      }
    },
    fadeIn() {
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.62, now + 0.4);
    },
    fadeOut() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
    },
  };
}

export default function MusicCard({
  cover = "/images/collage/vinyl.jpg",
  title = "Midnight Brief",
  artist = "Stelora Session",
  label = "Now playing",
  duration = "3:12",
}) {
  const [playing, setPlaying] = useState(false);
  const engineRef = useRef(null);

  useEffect(() => {
    return () => {
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, []);

  const start = () => {
    if (!engineRef.current) engineRef.current = createAmbientEngine();
    engineRef.current?.fadeIn();
    setPlaying(true);
  };

  const stop = () => {
    engineRef.current?.fadeOut();
    setPlaying(false);
  };

  return (
    <article
      className="music-card group relative flex w-[min(260px,72vw)] select-none items-stretch overflow-hidden rounded-2xl border border-stelora-line bg-stelora-surface shadow-[0_14px_32px_rgba(12,22,56,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(12,22,56,0.16)] sm:w-[280px]"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      onClick={() => (playing ? stop() : start())}
      tabIndex={0}
      aria-label={`${title} by ${artist}. Hover to preview audio.`}
    >
      <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden bg-stelora-navy sm:h-[100px] sm:w-[100px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          className={`h-full w-full object-cover transition duration-700 ${
            playing ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-[8px] font-bold uppercase tracking-[0.18em] text-stelora-muted">
              {label}
            </p>
            <p className="mt-0.5 truncate font-display text-[12px] font-bold uppercase leading-tight tracking-hero text-stelora-navy sm:text-[13px]">
              {title}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-stelora-muted">{artist}</p>
          </div>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stelora-navy text-stelora-cream transition ${
              playing ? "scale-105" : ""
            }`}
            aria-hidden
          >
            {playing ? (
              <span className="flex items-end gap-[2px]">
                <span className="music-bar h-2.5 w-[2px] bg-stelora-cream" />
                <span className="music-bar music-bar--delay h-3.5 w-[2px] bg-stelora-cream" />
                <span className="music-bar music-bar--delay2 h-2 w-[2px] bg-stelora-cream" />
              </span>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M1 0.5v11l8.5-5.5L1 0.5z" />
              </svg>
            )}
          </span>
        </div>

        <div className="space-y-1">
          <div className="h-[3px] overflow-hidden rounded-full bg-stelora-line">
            <div
              className={`h-full rounded-full bg-stelora-navy transition-all duration-500 ${
                playing ? "w-[62%]" : "w-[18%]"
              }`}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[8px] text-stelora-muted">
            <span>{playing ? "0:42" : "0:00"}</span>
            <span className="rounded-full border border-stelora-line px-1.5 py-0.5 text-stelora-navy">
              {playing ? "LIVE" : "PREVIEW"}
            </span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
