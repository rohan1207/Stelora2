import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide Lenis scroll — elegant, not sluggish.
 * Soft-caps big wheel flicks inside/near immersive sections so reels,
 * dome, and orbit aren't blasted past in one gesture.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return undefined;
    // Phones are gated — don't start Lenis on small screens
    if (window.matchMedia("(max-width: 819px)").matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.84,
      touchMultiplier: 1.05,
      syncTouch: false,
      virtualScroll: (data) => {
        const { event } = data;
        if (!event?.type?.includes("wheel")) return true;
        if (event.ctrlKey) return true;

        const vh = window.innerHeight || 800;
        const globalCap = vh * 0.52;
        if (Math.abs(data.deltaY) > globalCap) {
          data.deltaY = Math.sign(data.deltaY) * globalCap;
        }

        const dwells = document.querySelectorAll("[data-scroll-dwell]");
        if (!dwells.length) return true;

        const mid = vh * 0.42;
        let nearestAhead = null;
        let nearestDist = Infinity;

        for (const el of dwells) {
          const r = el.getBoundingClientRect();
          if (r.height < 40) continue;

          // Soften while the section owns the viewport center
          if (r.top < mid && r.bottom > vh * 0.32) {
            const insideCap = vh * 0.26;
            if (Math.abs(data.deltaY) > insideCap) {
              data.deltaY = Math.sign(data.deltaY) * insideCap;
            }
            return true;
          }

          if (data.deltaY > 0 && r.top > 8 && r.top < vh * 1.05) {
            if (r.top < nearestDist) {
              nearestDist = r.top;
              nearestAhead = r;
            }
          }
        }

        // Entering a dwell section — land into it, don't leap over
        if (nearestAhead && data.deltaY > 0) {
          const approachCap = Math.max(
            vh * 0.18,
            Math.min(nearestAhead.top + vh * 0.12, vh * 0.38)
          );
          if (data.deltaY > approachCap) data.deltaY = approachCap;
        }

        return true;
      },
      prevent: (node) =>
        Boolean(
          node?.closest?.("[data-lenis-prevent]") ||
            document.body.classList.contains("dg-scroll-lock")
        ),
    });

    window.__steloraLenis = lenis;

    const syncLock = () => {
      const locked =
        document.body.classList.contains("dg-scroll-lock") ||
        document.body.style.overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };

    const mo = new MutationObserver(syncLock);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    syncLock();

    const onReduce = () => {
      if (reduce.matches) lenis.destroy();
    };
    reduce.addEventListener?.("change", onReduce);

    return () => {
      reduce.removeEventListener?.("change", onReduce);
      mo.disconnect();
      if (window.__steloraLenis === lenis) delete window.__steloraLenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
