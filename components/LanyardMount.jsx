import { useEffect, useState } from "react";
import { getLanyard, warmLanyardPipeline } from "@/lib/lanyardWarm";

export default function LanyardMount(props) {
  // Always start empty so SSR and the first client paint match.
  // (getLanyard() may already be warm on the client from intro import.)
  const [Lanyard, setLanyard] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const existing = getLanyard();
    if (existing) {
      setLanyard(() => existing);
      return undefined;
    }
    warmLanyardPipeline()
      .then((Comp) => {
        if (!alive) return;
        if (Comp) setLanyard(() => Comp);
        else setFailed(true);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <button
          type="button"
          className="rounded-full border border-stelora-navy px-3 py-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stelora-navy"
          onClick={() => {
            setFailed(false);
            warmLanyardPipeline()
              .then((Comp) => {
                if (Comp) setLanyard(() => Comp);
                else setFailed(true);
              })
              .catch(() => setFailed(true));
          }}
        >
          Load ID card
        </button>
      </div>
    );
  }

  // Transparent while warming — no pulse blank (intro covers first visit).
  if (!Lanyard) {
    return <div className="h-full w-full" aria-hidden />;
  }

  return <Lanyard {...props} />;
}
