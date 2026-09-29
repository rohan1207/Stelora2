import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";

library.add(faHandPointer);

const byPrefixAndName = {
  fas: {
    "hand-pointer": faHandPointer,
  },
};

/** Hover-only cue: shake + point at the stub tear line. */
export default function TicketTearHint({ visible = true }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="ticket-tear-hint pointer-events-none absolute -right-1 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-1 md:-right-2"
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <motion.div
            animate={{ x: [0, 5, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 1.35, ease: "easeInOut", repeat: Infinity }}
            className="palm-hint-icon palm-hint-icon--sm"
          >
            <FontAwesomeIcon icon={byPrefixAndName.fas["hand-pointer"]} />
          </motion.div>
          <span className="ticket-tear-hint__label font-display text-[0.58rem] font-bold uppercase tracking-[0.16em]">
            drag &amp; book
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
