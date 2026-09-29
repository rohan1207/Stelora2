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

/** Idle cue beside the ID card — does not touch Lanyard internals. */
export default function IdCardDragHint({ visible = true }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none absolute left-[1.5%] top-[38%] z-[18] flex flex-col items-center gap-1 sm:left-[2.5%] md:left-[3.5%] md:top-[36%]"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <motion.div
            animate={{ x: [0, 4, 0], y: [0, 3, 0] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
            className="palm-hint-icon"
          >
            <FontAwesomeIcon icon={byPrefixAndName.fas["hand-pointer"]} />
          </motion.div>

          <span className="drag-hint-label font-display text-[0.62rem] font-bold uppercase tracking-[0.2em]">
            drag
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
