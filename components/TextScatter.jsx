import { useCallback, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

function scatterOffset(velocity) {
  const angle = Math.random() * Math.PI * 2;
  const dist = (0.4 + Math.random() * 0.6) * velocity;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
  };
}

function Letter({ char, velocity, rotation, scale, returnAfter, duration }) {
  const controls = useAnimationControls();
  const timerRef = useRef(null);
  const busyRef = useRef(false);

  const runScatter = useCallback(async () => {
    if (char === " ") return;
    if (busyRef.current) return;
    busyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    const { x, y } = scatterOffset(velocity);
    const rot = (Math.random() * 2 - 1) * rotation;

    await controls.start({
      x,
      y,
      rotate: rot,
      scale,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 16,
        mass: 0.65,
      },
    });

    timerRef.current = setTimeout(() => {
      controls
        .start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            type: "tween",
            ease: [0.22, 1, 0.36, 1],
            duration,
          },
        })
        .then(() => {
          busyRef.current = false;
        });
    }, Math.max(0, returnAfter) * 1000);
  }, [char, controls, duration, returnAfter, rotation, scale, velocity]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  if (char === " ") {
    return <span className="inline-block w-[0.28em]" aria-hidden />;
  }

  return (
    <motion.span
      className="inline-block cursor-pointer will-change-transform outline-none"
      style={{ originX: 0.5, originY: 0.5 }}
      animate={controls}
      initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
      onHoverStart={runScatter}
      onTap={runScatter}
      onFocus={runScatter}
      tabIndex={0}
      aria-hidden
    >
      {char}
    </motion.span>
  );
}

/**
 * Interactive letter scatter — only the hovered / tapped letter flies out,
 * then returns in ~`duration` seconds.
 */
export default function TextScatter({
  text,
  className = "",
  as: Tag = "h1",
  velocity = 200,
  rotation = 90,
  scale = 1,
  returnAfter = 0.25,
  duration = 2,
  ...rest
}) {
  return (
    <Tag
      {...rest}
      className={`text-scatter select-none ${className}`}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <Letter
          key={`${i}-${char}`}
          char={char}
          velocity={velocity}
          rotation={rotation}
          scale={scale}
          returnAfter={returnAfter}
          duration={duration}
        />
      ))}
    </Tag>
  );
}
