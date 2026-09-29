import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_SESSION_KEY, warmLanyardPipeline } from "@/lib/lanyardWarm";

const VIDEO_SRC = "/video.mp4";
/** Minimum landing time — always wait this long before revealing home. */
const PLAY_SECONDS = 6;

if (typeof window !== "undefined") {
  warmLanyardPipeline();
}

/**
 * White landing overlay — video + % for at least 6s while home (ID card) mounts underneath.
 */
export default function IntroLanding({ onComplete }) {
  const videoRef = useRef(null);
  const leavingRef = useRef(false);
  const doneRef = useRef(false);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [percent, setPercent] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const finish = useCallback(async () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setPercent(100);
    setLeaving(true);

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }

    const el = videoRef.current;
    if (el) {
      try {
        el.pause();
      } catch {
        /* ignore */
      }
    }

    await warmLanyardPipeline().catch(() => null);
    await new Promise((r) => setTimeout(r, 280));
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    warmLanyardPipeline();
  }, []);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setPercent(Math.min(100, Math.round((elapsed / PLAY_SECONDS) * 100)));

      const el = videoRef.current;
      if (el && el.duration && !Number.isNaN(el.duration) && el.currentTime >= PLAY_SECONDS) {
        try {
          el.pause();
        } catch {
          /* ignore */
        }
      }

      if (elapsed >= PLAY_SECONDS) {
        if (!doneRef.current) {
          doneRef.current = true;
          finish();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finish]);

  const handleVideoEnded = () => {
    const elapsed = (performance.now() - startRef.current) / 1000;
    if (elapsed >= PLAY_SECONDS) return;
    const el = videoRef.current;
    if (!el || videoFailed) return;
    el.currentTime = 0;
    el.play().catch(() => setVideoFailed(true));
  };

  return (
    <div className={`intro-landing${leaving ? " is-leaving" : ""}`} aria-busy={!leaving}>
      <div className="intro-landing__stage">
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="intro-landing__video"
            src={VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            onError={() => setVideoFailed(true)}
            aria-label="Stelora intro"
          />
        ) : null}
      </div>

      <div className="intro-landing__meter" aria-live="polite">
        <div className="intro-landing__track" aria-hidden>
          <div className="intro-landing__fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="intro-landing__percent">
          <span className="intro-landing__digits">{String(percent).padStart(2, "0")}</span>
          <span className="intro-landing__suffix">%</span>
        </p>
        <p className="intro-landing__hint">Loading experience</p>
      </div>
    </div>
  );
}
