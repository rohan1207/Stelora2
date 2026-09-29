import { useEffect, useMemo, useRef, useCallback } from "react";
import { useGesture } from "@use-gesture/react";

const DEFAULT_IMAGES = [
  { src: "/images/dome/dome-product-skincare.png", alt: "Skincare product still" },
  { src: "/images/dome/dome-place-cafe.png", alt: "Cafe lifestyle frame" },
  { src: "/images/dome/dome-fashion-detail.png", alt: "Fashion detail shoot" },
  { src: "/images/dome/dome-place-boutique.png", alt: "Boutique interior" },
  { src: "/images/dome/dome-product-food.png", alt: "Food brand plating" },
  { src: "/images/dome/dome-place-rooftop.png", alt: "Rooftop terrace" },
  { src: "/images/dome/dome-people-founder.png", alt: "Founder portrait" },
  { src: "/images/dome/dome-product-jewelry.png", alt: "Jewelry product shoot" },
  { src: "/images/dome/dome-place-mountains.png", alt: "Mountain location" },
  { src: "/images/dome/dome-product-home.png", alt: "Homeware still life" },
  { src: "/images/photoshoot.jpg", alt: "Studio photoshoot" },
  { src: "/images/atmosphere.jpg", alt: "Atmosphere frame" },
  { src: "/images/hero.jpg", alt: "Campaign hero" },
  { src: "/founder.jpeg", alt: "Founder on location" },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map((c) => ({ ...c, src: "", alt: "" }));
  }

  const normalizedImages = pool.map((image) => {
    if (typeof image === "string") {
      return { src: image, alt: "" };
    }
    return { src: image.src || "", alt: image.alt || "" };
  });

  const usedImages = Array.from(
    { length: totalSlots },
    (_, i) => normalizedImages[i % normalizedImages.length]
  );

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#f4f2ec",
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = "400px",
  openedImageHeight = "400px",
  imageBorderRadius = "30px",
  openedImageBorderRadius = "30px",
  grayscale = false,
  autoSpinSpeed = 7,
  hoverInfluence = 4.5,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const pointerDownRef = useRef(false);
  const pointerInsideRef = useRef(false);
  const spinVelRef = useRef(0);
  const tapCandidateRef = useRef(null);
  const hoverTargetRef = useRef({ x: 0, y: 0 });
  const hoverAppliedRef = useRef({ x: 0, y: 0 });
  const lastFrameRef = useRef(0);
  const autoSpinSpeedRef = useRef(autoSpinSpeed);
  const hoverInfluenceRef = useRef(hoverInfluence);
  const maxVerticalRef = useRef(maxVerticalRotationDeg);
  const openItemRef = useRef(() => {});

  autoSpinSpeedRef.current = autoSpinSpeed;
  hoverInfluenceRef.current = hoverInfluence;
  maxVerticalRef.current = maxVerticalRotationDeg;

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add("dg-scroll-lock");
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    scrollLockedRef.current = false;
    document.body.classList.remove("dg-scroll-lock");
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = useCallback((xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }, []);

  const paintSphere = useCallback(() => {
    const hover = hoverAppliedRef.current;
    const maxV = maxVerticalRef.current;
    const x = clamp(rotationRef.current.x + hover.x, -maxV, maxV);
    const y = wrapAngleSigned(rotationRef.current.y + hover.y);
    applyTransform(x, y);
  }, [applyTransform]);

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;
      let basis;
      switch (fitBasis) {
        case "min":
          basis = minDim;
          break;
        case "max":
          basis = maxDim;
          break;
        case "width":
          basis = w;
          break;
        case "height":
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.5;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty("--radius", `${lockedRadiusRef.current}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--enlarge-radius", openedImageBorderRadius);
      root.style.setProperty("--image-filter", grayscale ? "grayscale(1)" : "none");
      paintSphere();

      const enlargedOverlay = viewerRef.current?.querySelector(".enlarge");
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();
        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement("div");
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);
          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;
          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
    paintSphere,
  ]);

  useEffect(() => {
    paintSphere();
  }, [paintSphere]);

  // Elegant idle spin — freezes smoothly when the pointer is over the gallery
  useEffect(() => {
    let rafId = 0;
    const tick = (now) => {
      const last = lastFrameRef.current || now;
      const dt = Math.min(0.048, (now - last) / 1000);
      lastFrameRef.current = now;

      const busy =
        draggingRef.current ||
        pointerDownRef.current ||
        focusedElRef.current ||
        openingRef.current ||
        !!inertiaRAF.current ||
        rootRef.current?.getAttribute("data-enlarging") === "true";

      // Spin only when idle and pointer is away — otherwise ease to a still dome
      const wantSpin =
        !busy && !pointerInsideRef.current ? autoSpinSpeedRef.current : 0;
      const spinEase = 1 - Math.exp(-dt * (wantSpin > 0 ? 1.8 : 8));
      spinVelRef.current += (wantSpin - spinVelRef.current) * spinEase;

      if (Math.abs(spinVelRef.current) > 0.01 && !busy) {
        rotationRef.current.y = wrapAngleSigned(
          rotationRef.current.y + spinVelRef.current * dt
        );
      } else if (wantSpin === 0) {
        spinVelRef.current = 0;
      }

      // Soft hover lean — disabled while frozen for a click (kept very subtle)
      const target = hoverTargetRef.current;
      const applied = hoverAppliedRef.current;
      const hoverEase = 1 - Math.exp(-dt * 6);
      applied.x += (target.x - applied.x) * hoverEase;
      applied.y += (target.y - applied.y) * hoverEase;

      if (!draggingRef.current && !inertiaRAF.current) {
        paintSphere();
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [paintSphere]);

  // Enter/leave + subtle lean (no spin while inside)
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const onEnter = () => {
      pointerInsideRef.current = true;
    };

    const onMove = (e) => {
      pointerInsideRef.current = true;
      if (draggingRef.current || focusedElRef.current || openingRef.current) return;
      const rect = main.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const strength = hoverInfluenceRef.current * 0.35;
      hoverTargetRef.current = {
        x: clamp(-ny * strength * 0.5, -strength, strength),
        y: clamp(nx * strength, -strength, strength),
      };
    };

    const onLeave = () => {
      pointerInsideRef.current = false;
      pointerDownRef.current = false;
      hoverTargetRef.current = { x: 0, y: 0 };
    };

    main.addEventListener("pointerenter", onEnter, { passive: true });
    main.addEventListener("pointermove", onMove, { passive: true });
    main.addEventListener("pointerleave", onLeave);
    return () => {
      main.removeEventListener("pointerenter", onEnter);
      main.removeEventListener("pointermove", onMove);
      main.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(
          rotationRef.current.x - vY / 200,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        paintSphere();
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, paintSphere, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current || openingRef.current) return;
        stopInertia();
        spinVelRef.current = 0;
        pointerDownRef.current = true;
        pointerInsideRef.current = true;
        draggingRef.current = true;
        movedRef.current = false;
        hoverTargetRef.current = { x: 0, y: 0 };
        hoverAppliedRef.current = { x: 0, y: 0 };
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: event.clientX, y: event.clientY };

        const path = typeof event.composedPath === "function" ? event.composedPath() : [];
        const fromPath = path.find((n) => n?.classList?.contains?.("item__image"));
        const tileEl = fromPath || event.target?.closest?.(".item__image");
        tapCandidateRef.current = tileEl
          ? { el: tileEl, x: event.clientX, y: event.clientY, t: performance.now() }
          : null;
      },
      onDrag: ({ event, last, movement = [0, 0] }) => {
        if (focusedElRef.current || openingRef.current) return;
        if (!draggingRef.current || !startPosRef.current) {
          if (last) {
            pointerDownRef.current = false;
            draggingRef.current = false;
          }
          return;
        }

        const [mx, my] = movement;
        // Generous tap slop — only treat as drag after a clear pull
        if (Math.hypot(mx, my) > 14) {
          movedRef.current = true;
          tapCandidateRef.current = null;
        }

        if (movedRef.current) {
          const nextX = clamp(
            startRotRef.current.x - my / dragSensitivity,
            -maxVerticalRotationDeg,
            maxVerticalRotationDeg
          );
          const nextY = wrapAngleSigned(startRotRef.current.y + mx / dragSensitivity);
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }

        if (last) {
          const didMove = movedRef.current;
          const tap = tapCandidateRef.current;
          pointerDownRef.current = false;
          draggingRef.current = false;
          startPosRef.current = null;
          tapCandidateRef.current = null;
          movedRef.current = false;

          if (didMove) {
            lastDragEndAt.current = performance.now();
            const vx = clamp(mx / 220, -1.1, 1.1);
            const vy = clamp(my / 220, -1.1, 1.1);
            if (Math.abs(vx) > 0.03 || Math.abs(vy) > 0.03) startInertia(vx, vy);
          } else if (tap?.el) {
            openItemRef.current(tap.el);
          }
        }
      },
    },
    {
      target: mainRef,
      eventOptions: { passive: true },
      drag: {
        filterTaps: false,
        threshold: 0,
        pointer: { touch: true },
      },
    }
  );

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const overlay = viewerRef.current?.querySelector(".enlarge");
      if (!overlay) return;
      const refDiv = parent.querySelector(".item__image--reference");
      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        parent.removeAttribute("data-expanding");
        el.style.visibility = "";
        el.style.zIndex = 0;
        el.removeAttribute("data-focused");
        focusedElRef.current = null;
        rootRef.current?.removeAttribute("data-enlarging");
        openingRef.current = false;
        unlockScroll();
        return;
      }
      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      };
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      };
      const animatingOverlay = document.createElement("div");
      animatingOverlay.className = "enlarge-closing";
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;
      const originalImg = overlay.querySelector("img");
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        animatingOverlay.appendChild(img);
      }
      overlay.remove();
      rootRef.current.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();
      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + "px";
        animatingOverlay.style.top = originalPosRelativeToRoot.top + "px";
        animatingOverlay.style.width = originalPosRelativeToRoot.width + "px";
        animatingOverlay.style.height = originalPosRelativeToRoot.height + "px";
        animatingOverlay.style.opacity = "0";
      });
      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;
        if (refDiv) refDiv.remove();
        parent.style.transition = "none";
        el.style.transition = "none";
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        requestAnimationFrame(() => {
          el.style.visibility = "";
          el.style.opacity = "0";
          el.style.zIndex = 0;
          el.removeAttribute("data-focused");
          parent.removeAttribute("data-expanding");
          focusedElRef.current = null;
          rootRef.current?.removeAttribute("data-enlarging");
          requestAnimationFrame(() => {
            parent.style.transition = "";
            el.style.transition = "opacity 300ms ease-out";
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              setTimeout(() => {
                el.style.transition = "";
                el.style.opacity = "";
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute("data-enlarging") !== "true") {
                  document.body.classList.remove("dg-scroll-lock");
                }
              }, 300);
            });
          });
        });
      };
      animatingOverlay.addEventListener("transitionend", cleanup, { once: true });
    };
    scrim.addEventListener("click", close);
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      scrim.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  const openItemFromElement = useCallback(
    (el) => {
      if (!el || openingRef.current || focusedElRef.current) return;
      if (performance.now() - lastDragEndAt.current < 160) return;

      const parent = el.parentElement;
      const mainR = mainRef.current?.getBoundingClientRect();
      const frameR = frameRef.current?.getBoundingClientRect();
      if (!parent || !mainR || !frameR || !viewerRef.current) return;

      stopInertia();
      spinVelRef.current = 0;
      pointerDownRef.current = false;
      pointerInsideRef.current = true;
      draggingRef.current = false;
      movedRef.current = false;
      tapCandidateRef.current = null;
      hoverTargetRef.current = { x: 0, y: 0 };
      hoverAppliedRef.current = { x: 0, y: 0 };
      paintSphere();

      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();
      focusedElRef.current = el;
      el.setAttribute("data-focused", "true");
      parent.setAttribute("data-expanding", "true");

      // Measure the live tile first (most reliable for click-to-open)
      let tileR = el.getBoundingClientRect();
      if (tileR.width < 4 || tileR.height < 4) {
        tileR = {
          left: mainR.left + mainR.width / 2 - 48,
          top: mainR.top + mainR.height / 2 - 48,
          width: 96,
          height: 96,
        };
      }

      const offsetX = getDataNumber(parent, "offsetX", 0);
      const offsetY = getDataNumber(parent, "offsetY", 0);
      const sizeX = getDataNumber(parent, "sizeX", 2);
      const sizeY = getDataNumber(parent, "sizeY", 2);
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;
      parent.style.setProperty("--rot-y-delta", `${rotY}deg`);
      parent.style.setProperty("--rot-x-delta", `${rotX}deg`);

      const refDiv = document.createElement("div");
      refDiv.className = "item__image item__image--reference";
      refDiv.style.opacity = "0";
      refDiv.style.pointerEvents = "none";
      parent.appendChild(refDiv);

      originalTilePositionRef.current = {
        left: tileR.left,
        top: tileR.top,
        width: tileR.width,
        height: tileR.height,
      };
      el.style.visibility = "hidden";
      el.style.zIndex = 0;

      const overlay = document.createElement("div");
      overlay.className = "enlarge";
      overlay.style.position = "absolute";
      overlay.style.left = `${frameR.left - mainR.left}px`;
      overlay.style.top = `${frameR.top - mainR.top}px`;
      overlay.style.width = `${frameR.width}px`;
      overlay.style.height = `${frameR.height}px`;
      overlay.style.opacity = "0";
      overlay.style.zIndex = "30";
      overlay.style.willChange = "transform, opacity";
      overlay.style.transformOrigin = "top left";
      overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;
      const rawSrc = parent.dataset.src || el.querySelector("img")?.src || "";
      const img = document.createElement("img");
      img.src = rawSrc;
      img.alt = el.getAttribute("aria-label") || "";
      overlay.appendChild(img);
      viewerRef.current.appendChild(overlay);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / Math.max(frameR.width, 1);
      const sy0 = tileR.height / Math.max(frameR.height, 1);
      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0 || 1}, ${sy0 || 1})`;

      requestAnimationFrame(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = "1";
        overlay.style.transform = "translate(0px, 0px) scale(1, 1)";
        rootRef.current?.setAttribute("data-enlarging", "true");
      });

      const wantsResize = openedImageWidth || openedImageHeight;
      if (wantsResize) {
        const onFirstEnd = (ev) => {
          if (ev.propertyName !== "transform") return;
          overlay.removeEventListener("transitionend", onFirstEnd);
          const prevTransition = overlay.style.transition;
          overlay.style.transition = "none";
          const tempWidth = openedImageWidth || `${frameR.width}px`;
          const tempHeight = openedImageHeight || `${frameR.height}px`;
          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
          const newRect = overlay.getBoundingClientRect();
          overlay.style.width = `${frameR.width}px`;
          overlay.style.height = `${frameR.height}px`;
          void overlay.offsetWidth;
          overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`;
            overlay.style.top = `${centeredTop}px`;
            overlay.style.width = tempWidth;
            overlay.style.height = tempHeight;
          });
          const cleanupSecond = () => {
            overlay.removeEventListener("transitionend", cleanupSecond);
            overlay.style.transition = prevTransition;
          };
          overlay.addEventListener("transitionend", cleanupSecond, { once: true });
        };
        overlay.addEventListener("transitionend", onFirstEnd);
      }
    },
    [
      enlargeTransitionMs,
      lockScroll,
      openedImageHeight,
      openedImageWidth,
      paintSphere,
      segments,
      stopInertia,
    ]
  );

  openItemRef.current = openItemFromElement;

  const onTilePointerDown = useCallback((e) => {
    if (e.button != null && e.button !== 0) return;
    pointerDownRef.current = true;
    stopInertia();
    tapCandidateRef.current = {
      el: e.currentTarget,
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
    };
  }, [stopInertia]);

  const onTilePointerUp = useCallback(
    (e) => {
      // Backup if gesture didn't capture; primary open is in drag-end
      const tap = tapCandidateRef.current;
      if (!tap || tap.el !== e.currentTarget) return;
      if (movedRef.current) return;
      if (Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 12) return;
      if (performance.now() - lastDragEndAt.current < 160) return;
      if (openingRef.current || focusedElRef.current) return;

      tapCandidateRef.current = null;
      pointerDownRef.current = false;
      openItemFromElement(tap.el);
    },
    [openItemFromElement]
  );

  const onTilePointerCancel = useCallback(() => {
    tapCandidateRef.current = null;
    pointerDownRef.current = false;
  }, []);

  const onTileClick = useCallback(
    (e) => {
      // Secondary path — primary open is pointerup. Skip if we just opened from pointer.
      e.preventDefault();
      e.stopPropagation();
      if (openingRef.current || focusedElRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 160) return;
      if (performance.now() - openStartedAtRef.current < 400) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  const onTileKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  useEffect(() => {
    return () => {
      document.body.classList.remove("dg-scroll-lock");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        ["--segments-x"]: String(segments),
        ["--segments-y"]: String(segments),
        ["--overlay-blur-color"]: overlayBlurColor,
        ["--tile-radius"]: imageBorderRadius,
        ["--enlarge-radius"]: openedImageBorderRadius,
        ["--image-filter"]: grayscale ? "grayscale(1)" : "none",
      }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={{
                  ["--offset-x"]: it.x,
                  ["--offset-y"]: it.y,
                  ["--item-size-x"]: it.sizeX,
                  ["--item-size-y"]: it.sizeY,
                }}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || "Open image"}
                  onPointerDown={onTilePointerDown}
                  onPointerUp={onTilePointerUp}
                  onPointerCancel={onTilePointerCancel}
                  onClick={onTileClick}
                  onKeyDown={onTileKeyDown}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  );
}
