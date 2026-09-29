import { useEffect, useState } from "react";
import { getLanyard, warmLanyardPipeline } from "@/lib/lanyardWarm";

export default function LanyardMount(props) {
  const [Lanyard, setLanyard] = useState(() => getLanyard());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (Lanyard) return undefined;
    let alive = true;
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
  }, [Lanyard]);

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
