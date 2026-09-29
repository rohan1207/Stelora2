import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function readClock() {
  const now = new Date();
  return {
    hours: pad(now.getHours()),
    minutes: pad(now.getMinutes()),
    blink: now.getSeconds() % 2 === 0,
  };
}

/**
 * Pocket LED watch — live HH:MM in the hero mini frame.
 */
export default function LedClock() {
  const [clock, setClock] = useState(() => ({
    hours: "00",
    minutes: "00",
    blink: true,
  }));

  useEffect(() => {
    setClock(readClock());
    const id = window.setInterval(() => setClock(readClock()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="led-clock" aria-label={`Current time ${clock.hours}:${clock.minutes}`}>
      <div className="led-clock__bezel">
        <div className="led-clock__screen">
          <span className="led-clock__ghost" aria-hidden="true">
            88:88
          </span>
          <time className="led-clock__digits" dateTime={`${clock.hours}:${clock.minutes}`}>
            <span>{clock.hours}</span>
            <span className={`led-clock__colon${clock.blink ? " is-on" : ""}`}>:</span>
            <span>{clock.minutes}</span>
          </time>
        </div>
      </div>
    </div>
  );
}
