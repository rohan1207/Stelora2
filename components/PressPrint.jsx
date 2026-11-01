import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ClientOnly from "@/components/ClientOnly";

const PaperCrumple = dynamic(() => import("@/components/PaperCrumple"), {
  ssr: false,
});

/** 1 = crumpled ball, 0 = fully open — based on how centered the stage is. */
function crumpleFromViewport(el) {
  if (!el) return 1;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const sectionCenter = rect.top + rect.height / 2;
  const viewCenter = vh / 2;
  const dist = Math.abs(sectionCenter - viewCenter);
  // Open when the stage sits near the middle of the screen;
  // crumple as it approaches / leaves (scroll either direction).
  const openZone = vh * 0.12;
  const crumpleZone = vh * 0.52;
  if (dist <= openZone) return 0;
  if (dist >= crumpleZone) return 1;
  const t = (dist - openZone) / (crumpleZone - openZone);
  // Smoothstep for elegant open/close
  return t * t * (3 - 2 * t);
}

const PAGE_W = 1180;
const PAGE_H = 660;

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function withSticker(ctx, x, y, rot, draw) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.shadowColor = "rgba(40, 28, 16, 0.22)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  draw();
  ctx.restore();
}

function drawWashiTape(ctx, x, y, w, h, rot, color) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.78;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#fff8e8";
    for (let i = -w / 2; i < w / 2; i += 7) {
      ctx.fillRect(i, -h / 2, 2.5, h);
    }
    ctx.globalAlpha = 1;
  });
}

function drawCameraSticker(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    // backing
    ctx.fillStyle = "#fffaf0";
    roundRect(ctx, -42, -34, 84, 68, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,30,20,0.18)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, -42, -34, 84, 68, 10);
    ctx.stroke();

    // body
    ctx.fillStyle = "#1a307b";
    roundRect(ctx, -30, -14, 60, 36, 6);
    ctx.fill();
    ctx.fillStyle = "#2a4494";
    roundRect(ctx, -26, -28, 22, 16, 4);
    ctx.fill();
    // lens
    ctx.beginPath();
    ctx.arc(6, 4, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#0c1638";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, 4, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#7eb8e8";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#1a307b";
    ctx.fill();
    // flash
    ctx.fillStyle = "#fff4e0";
    roundRect(ctx, 16, -24, 10, 6, 2);
    ctx.fill();
  });
}

function drawFilmStrip(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#1a1a1a";
    roundRect(ctx, -18, -52, 36, 104, 4);
    ctx.fill();
    ctx.fillStyle = "#c4b49a";
    for (let i = -44; i <= 40; i += 14) {
      ctx.fillRect(-14, i, 6, 8);
      ctx.fillRect(8, i, 6, 8);
    }
    ctx.fillStyle = "#5a7ab8";
    for (let i = -36; i <= 28; i += 22) {
      ctx.fillRect(-6, i, 12, 16);
    }
  });
}

function drawHashtagSticker(ctx, x, y, rot, label) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#fff4e0";
    roundRect(ctx, -48, -20, 96, 40, 20);
    ctx.fill();
    ctx.strokeStyle = "#1a307b";
    ctx.lineWidth = 2;
    roundRect(ctx, -48, -20, 96, 40, 20);
    ctx.stroke();
    ctx.fillStyle = "#1a307b";
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  });
}

function drawHeartSticker(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,30,20,0.16)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#c45c5c";
    ctx.beginPath();
    const s = 1.15;
    ctx.moveTo(0, 8 * s);
    ctx.bezierCurveTo(-18 * s, -2 * s, -14 * s, -16 * s, 0, -10 * s);
    ctx.bezierCurveTo(14 * s, -16 * s, 18 * s, -2 * s, 0, 8 * s);
    ctx.fill();
  });
}

function drawMegaphoneSticker(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#fffaf0";
    roundRect(ctx, -40, -32, 80, 64, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,30,20,0.16)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, -40, -32, 80, 64, 12);
    ctx.stroke();

    ctx.fillStyle = "#1a307b";
    ctx.beginPath();
    ctx.moveTo(-18, -8);
    ctx.lineTo(16, -18);
    ctx.lineTo(16, 18);
    ctx.lineTo(-18, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#e8a23a";
    roundRect(ctx, -26, -6, 10, 12, 2);
    ctx.fill();
    ctx.strokeStyle = "#1a307b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(22, 0, 8, -0.8, 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(28, 0, 12, -0.7, 0.7);
    ctx.stroke();
  });
}

function drawStarSticker(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8a23a";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72 - 90) * Math.PI) / 180;
      const b = (((i * 72 - 90 + 36) * Math.PI) / 180);
      const r1 = 16;
      const r2 = 7;
      const px = Math.cos(a) * r1;
      const py = Math.sin(a) * r1;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      ctx.lineTo(Math.cos(b) * r2, Math.sin(b) * r2);
    }
    ctx.closePath();
    ctx.fill();
  });
}

function drawCursorSticker(ctx, x, y, rot) {
  withSticker(ctx, x, y, rot, () => {
    ctx.fillStyle = "#fffaf0";
    roundRect(ctx, -28, -28, 56, 56, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,30,20,0.16)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, -28, -28, 56, 56, 12);
    ctx.stroke();
    ctx.fillStyle = "#1a307b";
    ctx.beginPath();
    ctx.moveTo(-8, -14);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-1, 5);
    ctx.lineTo(4, 16);
    ctx.lineTo(9, 14);
    ctx.lineTo(4, 3);
    ctx.lineTo(14, 3);
    ctx.closePath();
    ctx.fill();
  });
}

/** Deterministic jagged outline — slight historic tear, not ragged shreds. */
function buildTornPath(ctx, w, h, inset = 10, amp = 5.5, step = 14) {
  const edge = (t, axis) => {
    // soft layered noise — keeps tears subtle
    const n =
      Math.sin(t * 0.31 + axis * 1.7) * amp * 0.55 +
      Math.sin(t * 0.77 + axis * 0.9) * amp * 0.3 +
      Math.sin(t * 1.9 + axis * 2.4) * amp * 0.15;
    return n;
  };

  ctx.beginPath();
  // top
  ctx.moveTo(inset + edge(0, 1), inset + edge(0, 2));
  for (let x = inset; x <= w - inset; x += step) {
    ctx.lineTo(x, inset + edge(x, 2));
  }
  // right
  for (let y = inset; y <= h - inset; y += step) {
    ctx.lineTo(w - inset + edge(y, 3), y);
  }
  // bottom
  for (let x = w - inset; x >= inset; x -= step) {
    ctx.lineTo(x, h - inset + edge(x, 4));
  }
  // left
  for (let y = h - inset; y >= inset; y -= step) {
    ctx.lineTo(inset + edge(y, 1), y);
  }
  ctx.closePath();
}

function paintWrinkles(ctx, w, h) {
  // Soft fold valleys — stronger on content (left) side
  const folds = [
    { x0: w * 0.12, y0: 0, x1: w * 0.22, y1: h, a: 0.07 },
    { x0: w * 0.34, y0: h * 0.05, x1: w * 0.28, y1: h * 0.95, a: 0.055 },
    { x0: w * 0.48, y0: 0, x1: w * 0.52, y1: h, a: 0.04 },
    { x0: w * 0.18, y0: h * 0.35, x1: w * 0.55, y1: h * 0.42, a: 0.045 },
    { x0: w * 0.08, y0: h * 0.62, x1: w * 0.42, y1: h * 0.7, a: 0.04 },
    { x0: w * 0.7, y0: h * 0.15, x1: w * 0.78, y1: h * 0.85, a: 0.03 },
  ];

  for (const f of folds) {
    const g = ctx.createLinearGradient(f.x0, f.y0, f.x1, f.y1);
    g.addColorStop(0, `rgba(90, 70, 40, 0)`);
    g.addColorStop(0.45, `rgba(70, 52, 30, ${f.a})`);
    g.addColorStop(0.55, `rgba(255, 248, 230, ${f.a * 0.55})`);
    g.addColorStop(1, `rgba(90, 70, 40, 0)`);
    ctx.strokeStyle = g;
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(f.x0, f.y0);
    ctx.quadraticCurveTo(
      (f.x0 + f.x1) / 2 + 20,
      (f.y0 + f.y1) / 2,
      f.x1,
      f.y1
    );
    ctx.stroke();
  }

  // Soft vignette / pressed-open edges
  const vig = ctx.createRadialGradient(
    w * 0.42,
    h * 0.45,
    h * 0.2,
    w * 0.5,
    h * 0.5,
    h * 0.78
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(90, 70, 40, 0.07)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

async function buildFounderPage() {
  await document.fonts.ready.catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Transparent outside the tear so PaperCrumple shows soft edges
  ctx.clearRect(0, 0, PAGE_W, PAGE_H);

  // Soft drop under the torn sheet
  buildTornPath(ctx, PAGE_W, PAGE_H, 11, 5.2, 13);
  ctx.fillStyle = "rgba(60, 45, 28, 0.1)";
  ctx.fill();

  buildTornPath(ctx, PAGE_W, PAGE_H, 10, 5.5, 14);
  ctx.save();
  ctx.clip();

  // Paper base
  const grad = ctx.createLinearGradient(0, 0, PAGE_W, PAGE_H);
  grad.addColorStop(0, "#f7efdc");
  grad.addColorStop(0.4, "#efe0c4");
  grad.addColorStop(1, "#e2cda8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // Fiber / age spots
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(110, 85, 50, ${0.012 + Math.random() * 0.03})`;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * PAGE_W,
      Math.random() * PAGE_H,
      12 + Math.random() * 55,
      8 + Math.random() * 36,
      Math.random(),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  paintWrinkles(ctx, PAGE_W, PAGE_H);

  // Slightly darker fibrous rim (inside clip)
  buildTornPath(ctx, PAGE_W, PAGE_H, 10, 5.5, 14);
  ctx.strokeStyle = "rgba(90, 70, 40, 0.28)";
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 248, 230, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const hand = '"Caveat", "Segoe Script", cursive';
  const ink = "#2a2218";
  const muted = "rgba(107, 85, 56, 0.9)";
  const navy = "#1a307b";

  // Copy left, polaroid right — stickers live in the mid gap (left of photo)
  const textLeft = 120;
  const textTop = 82;
  const textMaxW = 460;
  const photoW = 220;
  const photoH = 274;
  const photoX = PAGE_W - photoW - 118;
  const photoY = 100;
  const gapX = (textLeft + textMaxW + photoX) / 2; // center of open scrap space

  // Portrait polaroid
  try {
    const img = await loadImage("/founder.jpeg");
    ctx.save();
    ctx.translate(photoX + photoW / 2, photoY + photoH / 2);
    ctx.rotate((-2.5 * Math.PI) / 180);
    ctx.fillStyle = "#f7f1e4";
    ctx.shadowColor = "rgba(42, 34, 24, 0.2)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 7;
    ctx.fillRect(-photoW / 2 - 12, -photoH / 2 - 12, photoW + 24, photoH + 48);
    ctx.shadowColor = "transparent";
    ctx.drawImage(img, -photoW / 2, -photoH / 2, photoW, photoH);
    ctx.fillStyle = "#5a4a36";
    ctx.font = `500 24px ${hand}`;
    ctx.textAlign = "center";
    ctx.fillText("Divya Chauhan", 0, photoH / 2 + 28);
    ctx.restore();
    ctx.textAlign = "left";
  } catch {
    ctx.fillStyle = "#ddd4c4";
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }

  // Copy — generous line heights (fixes overlap)
  let y = textTop;

  ctx.fillStyle = muted;
  ctx.font = `400 28px ${hand}`;
  ctx.fillText("From my desk —", textLeft, y);
  y += 48;

  ctx.fillStyle = navy;
  ctx.font = `700 46px ${hand}`;
  ctx.fillText("I built Stelora", textLeft, y);
  y += 52;
  ctx.fillText("for brands that care.", textLeft, y);
  y += 44;

  const paragraphs = [
    "I believe brands deserve work that feels human — sharp enough to rank, warm enough to remember. Social, SEO, ads, stories: not filler, but craft.",
    "I lead with clarity and curiosity. Every brand has a voice worth amplifying. Stelora is my studio for that work — not a factory.",
    "If you want to grow with intention, then be seen — I'm here.",
  ];

  ctx.fillStyle = ink;
  ctx.font = `500 28px ${hand}`;
  const lineH = 34;
  for (const para of paragraphs) {
    const lines = wrapLines(ctx, para, textMaxW);
    for (const line of lines) {
      if (y > PAGE_H - 100) break;
      ctx.fillText(line, textLeft, y);
      y += lineH;
    }
    y += 14;
  }

  const signY = Math.min(Math.max(y + 14, PAGE_H - 100), PAGE_H - 78);
  ctx.fillStyle = navy;
  ctx.font = `600 34px ${hand}`;
  ctx.fillText("— Divya", textLeft, signY);

  // Light tape only on outer corners — keep left margin clear of clutter
  drawWashiTape(ctx, 78, 44, 100, 20, -26, "#1a307b");
  drawWashiTape(ctx, PAGE_W - 96, 52, 96, 18, 20, "#c45c5c");
  drawWashiTape(ctx, PAGE_W * 0.55, PAGE_H - 40, 130, 16, -3, "#e8a23a");

  // Stickers in the open gap left of the founder polaroid (no text overlap)
  drawCameraSticker(ctx, gapX - 10, 168, -12);
  drawStarSticker(ctx, gapX + 48, 250, -16);
  drawMegaphoneSticker(ctx, gapX - 6, 320, 8);
  drawHeartSticker(ctx, gapX + 42, 400, 14);
  drawFilmStrip(ctx, gapX - 36, 470, 6);
  drawCursorSticker(ctx, gapX + 50, 520, 10);

  // Far-right accents (clear of polaroid caption)
  drawHashtagSticker(ctx, PAGE_W - 86, photoY + photoH + 70, -10, "#grow");
  drawHashtagSticker(ctx, PAGE_W - 200, PAGE_H - 72, 5, "SEO");
  drawCameraSticker(ctx, PAGE_W - 320, PAGE_H - 78, 11);

  ctx.restore(); // end torn-edge clip

  return canvas.toDataURL("image/png");
}

export default function PressPrint() {
  const [src, setSrc] = useState(null);
  const [scrollCrumple, setScrollCrumple] = useState(1);
  const stageRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    let alive = true;
    buildFounderPage().then((url) => {
      if (alive && url) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !src) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      rafRef.current = 0;
      if (reduce.matches) {
        setScrollCrumple(0);
        return;
      }
      const next = crumpleFromViewport(stage);
      setScrollCrumple((prev) => (Math.abs(prev - next) < 0.008 ? prev : next));
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  const isOpen = scrollCrumple < 0.12;

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-stelora-line bg-stelora-canvas"
      aria-labelledby="scrap-heading"
    >
      <div className="mx-auto max-w-7xl px-3 py-10 md:px-6 md:py-14">
        <h2 id="scrap-heading" className="sr-only">
          A note from Divya Chauhan
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-2 text-center font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-stelora-muted"
        >
          {isOpen ? "Hold & drag the page to crumple" : "Scroll to unfold the page"}
        </motion.p>

        {src ? (
          <div ref={stageRef} className="press-print-stage w-full">
            <div className={isOpen ? "press-print-float" : undefined}>
              <ClientOnly>
              <PaperCrumple
                src={src}
                alt="A scrapbook page from Divya Chauhan with her portrait and stickers"
                width={1180}
                height={660}
                sceneHeight={680}
                imageFit="contain"
                releaseBehavior="creased"
                crumpleAmount={0.92}
                crumpleDuration={0.55}
                releaseDuration={0.45}
                foldCount={7}
                foldSharpness={0.55}
                wrinkleDepth={0.75}
                creaseStrength={0.18}
                initialCrease={0}
                externalAmount={scrollCrumple}
                paperColor="#efe0c4"
                paperTexture={0.14}
                lightIntensity={2.1}
                lightAngle={-28}
                shadow
                shadowOpacity={0.12}
                rotation={-1.2}
                seed={11}
                detail={72}
                draggable={isOpen}
                disabled={!isOpen}
                returnToOrigin
                className="press-print-crumple w-full"
              />
              </ClientOnly>
            </div>
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center text-stelora-muted"
            style={{ height: 640 }}
            aria-hidden
          >
            Preparing page…
          </div>
        )}
      </div>
    </section>
  );
}
