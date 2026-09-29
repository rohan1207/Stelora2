import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/** Achievement packs — clusters share a color; reward text floats on break. */
const PACKS = [
  {
    name: "Growth",
    color: "#e85d5d",
    highlight: "#ff8f8f",
    shadow: "#b83a3a",
    rewards: ["Growth ++", "Growth +12%", "Growth unlocked"],
  },
  {
    name: "Sales",
    color: "#f0c040",
    highlight: "#ffe07a",
    shadow: "#c49212",
    rewards: ["Sales 50%+", "Sales spike", "Pipeline win"],
  },
  {
    name: "Profit",
    color: "#3d8bfd",
    highlight: "#7eb3ff",
    shadow: "#1a5fd0",
    rewards: ["Profit ↑", "Margin ↑", "MRR ++"],
  },
  {
    name: "Reach",
    color: "#2fc98a",
    highlight: "#6eebb0",
    shadow: "#1a9a64",
    rewards: ["Reach 2×", "Awareness +", "Visibility ↑"],
  },
  {
    name: "Loyalty",
    color: "#a78bfa",
    highlight: "#c4b5fd",
    shadow: "#7c5cf0",
    rewards: ["Loyalty ++", "Retention ↑", "Reviews ↑"],
  },
  {
    name: "Momentum",
    color: "#fb923c",
    highlight: "#fdba74",
    shadow: "#d97706",
    rewards: ["ROAS ++", "Conversion ↑", "Breakthrough"],
  },
];

const BALL_SPEED = 440;
const PAD_X = 20;
const PAD_TOP = 18;
const LOGO_H = 56;

const easeOut = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function pathRoundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, rad);
    return;
  }
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function drawBevelBlock(ctx, x, y, w, h, pack) {
  const r = Math.min(6, w * 0.16);
  ctx.fillStyle = pack.color;
  pathRoundRect(ctx, x, y, w, h, r);
  ctx.fill();

  ctx.fillStyle = pack.highlight;
  pathRoundRect(ctx, x + 1.5, y + 1.5, w - 3, Math.max(4, h * 0.32), r - 1);
  ctx.fill();

  const inset = Math.max(3, w * 0.12);
  ctx.fillStyle = pack.color;
  pathRoundRect(ctx, x + inset * 0.5, y + inset * 0.5, w - inset, h - inset, r - 2);
  ctx.fill();

  ctx.strokeStyle = pack.shadow;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 1.25;
  pathRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Dense 3-row grid — random color blobs (not solid columns/rows). */
function buildBricks(cw, ch) {
  const cols = 14;
  const rows = 3;
  const gap = 4;
  const sidePad = PAD_X;
  const usable = cw - sidePad * 2 - gap * (cols - 1);
  const bw = usable / cols;
  const bh = Math.max(18, Math.min(24, bw * 0.48));
  const originX = sidePad;
  const top = PAD_TOP;
  const packs = [...PACKS];

  const grid = Array.from({ length: rows }, () => Array(cols).fill(-1));

  const neighbors = (r, c) => {
    const out = [];
    if (r > 0) out.push([r - 1, c]);
    if (r < rows - 1) out.push([r + 1, c]);
    if (c > 0) out.push([r, c - 1]);
    if (c < cols - 1) out.push([r, c + 1]);
    return out;
  };

  let packCursor = 0;
  const open = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) open.push([r, c]);
  }
  for (let i = open.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [open[i], open[j]] = [open[j], open[i]];
  }

  for (const [sr, sc] of open) {
    if (grid[sr][sc] !== -1) continue;
    const packIndex = packCursor % packs.length;
    packCursor += 1;
    const target = 2 + Math.floor(Math.random() * 4); // 2–5
    const queue = [[sr, sc]];
    grid[sr][sc] = packIndex;
    let count = 1;
    while (queue.length && count < target) {
      const [cr, cc] = queue.shift();
      const nbs = neighbors(cr, cc).sort(() => Math.random() - 0.5);
      for (const [nr, nc] of nbs) {
        if (grid[nr][nc] !== -1) continue;
        grid[nr][nc] = packIndex;
        queue.push([nr, nc]);
        count += 1;
        if (count >= target) break;
      }
    }
  }

  const bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pack = packs[Math.max(0, grid[r][c]) % packs.length];
      bricks.push({
        x: originX + c * (bw + gap),
        y: top + r * (bh + gap),
        w: bw,
        h: bh,
        alive: true,
        reward: pack.rewards[Math.floor(Math.random() * pack.rewards.length)],
        category: pack.name,
        color: pack.color,
        highlight: pack.highlight,
        shadow: pack.shadow,
      });
    }
  }

  const brickBottom = top + rows * (bh + gap);
  const paddleY = Math.min(ch - LOGO_H - 18, Math.max(brickBottom + 56, ch * 0.72));
  return { bricks, paddleY };
}

function resetBall(state, cw, ch) {
  state.ball.x = cw / 2;
  state.ball.y = ch * 0.58;
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.28;
  state.ball.vx = Math.cos(angle) * BALL_SPEED;
  state.ball.vy = Math.sin(angle) * BALL_SPEED;
  state.ball.r = 13;
}

/** Soft ambient + hit tones via Web Audio (no asset file). */
function createAudioBus() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);

  let musicNodes = [];
  let musicOn = false;

  const resume = () => {
    if (ctx.state === "suspended") ctx.resume();
  };

  const tone = (freq, dur, type = "sine", gain = 0.12, when = 0) => {
    resume();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  };

  return {
    resume,
    hit() {
      tone(660, 0.12, "triangle", 0.1);
      tone(990, 0.18, "sine", 0.06, 0.04);
    },
    countdown(n) {
      if (n === "GO") {
        tone(523, 0.15, "sine", 0.1);
        tone(784, 0.25, "triangle", 0.08, 0.08);
      } else {
        tone(392, 0.18, "sine", 0.09);
      }
    },
    paddle() {
      tone(220, 0.08, "sine", 0.05);
    },
    startMusic() {
      resume();
      if (musicOn) return;
      musicOn = true;
      const notes = [262, 311, 349, 392, 349, 311];
      let i = 0;
      const beat = () => {
        if (!musicOn) return;
        const f = notes[i % notes.length];
        i += 1;
        tone(f, 0.55, "sine", 0.035);
        tone(f * 1.5, 0.4, "triangle", 0.018, 0.05);
        const id = window.setTimeout(beat, 520);
        musicNodes.push(id);
      };
      beat();
    },
    stopMusic() {
      musicOn = false;
      musicNodes.forEach((id) => window.clearTimeout(id));
      musicNodes = [];
    },
    dispose() {
      this.stopMusic();
      try {
        ctx.close();
      } catch {
        /* ignore */
      }
    },
  };
}

/**
 * Light, modern brand-lift brick breaker — Stelora paddle, brand ball, grouped wins.
 */
export default function SteloraBreaker() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef(null);
  const runningRef = useRef(false);
  const logoRef = useRef(null);
  const audioRef = useRef(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [musicOn, setMusicOn] = useState(false);

  const syncScore = useCallback((n) => setScore(n), []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = createAudioBus();
    return audioRef.current;
  }, []);

  const buildRound = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const { bricks, paddleY } = buildBricks(cw, ch);

    const logo = logoRef.current;
    let paddleW = Math.min(168, cw * 0.24);
    let paddleH = LOGO_H;
    if (logo && logo.complete && logo.naturalWidth) {
      paddleH = LOGO_H;
      paddleW = paddleH * (logo.naturalWidth / logo.naturalHeight);
      paddleW = Math.min(Math.max(paddleW, 112), cw * 0.34);
    }

    const state = {
      cw,
      ch,
      dpr,
      bricks,
      paddle: { x: cw / 2, w: paddleW, h: paddleH, y: paddleY },
      ball: { x: 0, y: 0, vx: 0, vy: 0, r: 13 },
      popups: [],
      particles: [],
      ripples: [],
      cracked: 0,
      paused: true,
      pointerX: cw / 2,
    };
    resetBall(state, cw, ch);
    stateRef.current = state;
    setTotal(bricks.length);
    syncScore(0);
    setOverlay(null);
  }, [syncScore]);

  const runCountdown = useCallback(async () => {
    const audio = ensureAudio();
    audio?.resume();
    runningRef.current = false;
    const steps = ["3", "2", "1", "GO"];
    for (const step of steps) {
      setCountdown(step);
      audio?.countdown(step);
      await new Promise((r) => setTimeout(r, step === "GO" ? 520 : 700));
    }
    setCountdown(null);
    const state = stateRef.current;
    if (state) {
      state.paused = false;
      resetBall(state, state.cw, state.ch);
    }
    runningRef.current = true;
  }, [ensureAudio]);

  const startWithCountdown = useCallback(async () => {
    buildRound();
    await runCountdown();
  }, [buildRound, runCountdown]);

  useEffect(() => {
    const img = new Image();
    img.src = "/logo.webp";
    img.onload = () => {
      logoRef.current = img;
    };

    let cancelled = false;
    (async () => {
      buildRound();
      if (!cancelled) await runCountdown();
    })();

    return () => {
      cancelled = true;
      audioRef.current?.dispose();
      audioRef.current = null;
    };
    // Mount once — round + countdown bootstrapped here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let last = performance.now();

    const loop = (now) => {
      rafRef.current = requestAnimationFrame(loop);
      const state = stateRef.current;
      if (!state) return;

      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const { cw, ch, dpr } = state;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "#fbfaf7";
      ctx.fillRect(0, 0, cw, ch);
      const soft = ctx.createRadialGradient(cw * 0.5, ch * 0.2, 20, cw * 0.5, ch * 0.35, cw * 0.55);
      soft.addColorStop(0, "rgba(26,48,123,0.04)");
      soft.addColorStop(1, "transparent");
      ctx.fillStyle = soft;
      ctx.fillRect(0, 0, cw, ch);

      if (!state.paused && runningRef.current) {
        // Snap paddle to pointer — no lag / stickiness
        const half = state.paddle.w / 2;
        state.paddle.x = Math.max(
          PAD_X + half,
          Math.min(cw - PAD_X - half, state.pointerX)
        );

        const steps = 2;
        const stepDt = dt / steps;
        for (let s = 0; s < steps; s++) {
          state.ball.x += state.ball.vx * stepDt;
          state.ball.y += state.ball.vy * stepDt;

          if (state.ball.x - state.ball.r < PAD_X) {
            state.ball.x = PAD_X + state.ball.r;
            state.ball.vx = Math.abs(state.ball.vx);
          }
          if (state.ball.x + state.ball.r > cw - PAD_X) {
            state.ball.x = cw - PAD_X - state.ball.r;
            state.ball.vx = -Math.abs(state.ball.vx);
          }
          if (state.ball.y - state.ball.r < 10) {
            state.ball.y = 10 + state.ball.r;
            state.ball.vy = Math.abs(state.ball.vy);
          }

          const py = state.paddle.y;
          const px = state.paddle.x;
          const pw = state.paddle.w;
          const ph = state.paddle.h;
          if (
            state.ball.vy > 0 &&
            state.ball.y + state.ball.r >= py &&
            state.ball.y - state.ball.r <= py + ph &&
            state.ball.x >= px - pw / 2 &&
            state.ball.x <= px + pw / 2
          ) {
            state.ball.y = py - state.ball.r - 0.5;
            const hit = (state.ball.x - px) / (pw / 2);
            const angle = -Math.PI / 2 + Math.max(-0.85, Math.min(0.85, hit)) * 0.72;
            const speed = Math.max(BALL_SPEED, Math.hypot(state.ball.vx, state.ball.vy));
            state.ball.vx = Math.cos(angle) * speed;
            state.ball.vy = Math.sin(angle) * speed;
            audioRef.current?.paddle();
          }

          let hitBrick = false;
          for (const b of state.bricks) {
            if (!b.alive) continue;
            if (
              state.ball.x + state.ball.r > b.x &&
              state.ball.x - state.ball.r < b.x + b.w &&
              state.ball.y + state.ball.r > b.y &&
              state.ball.y - state.ball.r < b.y + b.h
            ) {
              b.alive = false;
              state.cracked += 1;
              syncScore(state.cracked);
              const cx = b.x + b.w / 2;
              const cy = b.y + b.h / 2;
              state.popups.push({
                x: cx,
                y: cy,
                text: b.reward,
                life: 1.35,
                color: b.shadow || "#1a307b",
                glow: b.highlight || b.color,
              });
              state.ripples.push({ x: cx, y: cy, r: 4, life: 0.4, color: b.color });
              for (let i = 0; i < 10; i++) {
                const a = Math.random() * Math.PI * 2;
                const sp = 70 + Math.random() * 140;
                state.particles.push({
                  x: cx,
                  y: cy,
                  vx: Math.cos(a) * sp,
                  vy: Math.sin(a) * sp - 30,
                  life: 0.4 + Math.random() * 0.3,
                  color: b.color,
                  size: 2 + Math.random() * 2.5,
                });
              }
              const overlapL = state.ball.x + state.ball.r - b.x;
              const overlapR = b.x + b.w - (state.ball.x - state.ball.r);
              const overlapT = state.ball.y + state.ball.r - b.y;
              const overlapB = b.y + b.h - (state.ball.y - state.ball.r);
              const minX = Math.min(overlapL, overlapR);
              const minY = Math.min(overlapT, overlapB);
              if (minX < minY) state.ball.vx *= -1;
              else state.ball.vy *= -1;
              audioRef.current?.hit();
              hitBrick = true;
              break;
            }
          }
          if (hitBrick) break;
        }

        if (state.ball.y - state.ball.r > ch + 8) {
          state.paused = true;
          runningRef.current = false;
          setOverlay("miss");
        }

        if (state.bricks.every((b) => !b.alive)) {
          state.paused = true;
          runningRef.current = false;
          setOverlay("win");
        }
      }

      for (const b of state.bricks) {
        if (!b.alive) continue;
        drawBevelBlock(ctx, b.x, b.y, b.w, b.h, b);
      }

      // Logo is the paddle
      const px = state.paddle.x;
      const py = state.paddle.y;
      const pw = state.paddle.w;
      const ph = state.paddle.h;
      const logo = logoRef.current;
      if (logo && logo.complete) {
        ctx.drawImage(logo, px - pw / 2, py, pw, ph);
      } else {
        ctx.fillStyle = "#1a307b";
        pathRoundRect(ctx, px - pw / 2, py, pw, ph, 10);
        ctx.fill();
        ctx.fillStyle = "#fff4e0";
        ctx.font = '700 11px "Space Grotesk", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("STELORA", px, py + ph / 2);
      }

      // Solid brand ball + sticky external name label
      const br = state.ball.r;
      const bx = state.ball.x;
      const by = state.ball.y;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle = "#1a307b";
      ctx.fill();
      ctx.lineWidth = 2.25;
      ctx.strokeStyle = "#fff4e0";
      ctx.stroke();

      const tag = "brands";
      ctx.font = '700 14px "Space Grotesk", sans-serif';
      const tagW = ctx.measureText(tag).width;
      const padX = 11;
      const padY = 5;
      const tagH = 14 + padY * 2;
      const gap = 4;
      const pillW = tagW + padX * 2;
      const onRight = bx + br + gap + pillW < cw - 10;
      const tagX = onRight ? bx + br + gap : bx - br - gap - pillW;
      const tagY = by - tagH / 2;
      const tagCx = tagX + pillW / 2;

      // Full-round cream pill (no connector line)
      ctx.fillStyle = "#fff4e0";
      ctx.strokeStyle = "#1a307b";
      ctx.lineWidth = 1.5;
      pathRoundRect(ctx, tagX, tagY, pillW, tagH, tagH / 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1a307b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tag, tagCx, by + 0.5);

      state.ripples = state.ripples.filter((p) => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.r += 90 * dt;
        ctx.globalAlpha = p.life * 0.7;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        return true;
      });

      state.particles = state.particles.filter((p) => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 380 * dt;
        ctx.globalAlpha = Math.min(1, p.life * 1.5);
        ctx.fillStyle = p.color;
        pathRoundRect(ctx, p.x, p.y, p.size, p.size, 1.5);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      state.popups = state.popups.filter((p) => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.y -= 58 * dt;
        const t = 1 - p.life / 1.35;
        const scale = 0.92 + easeOut(Math.min(1, t * 1.8)) * 0.18;
        const alpha = p.life > 0.28 ? 1 : p.life / 0.28;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.scale(scale, scale);
        ctx.font = '700 20px "Space Grotesk", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // soft glow ring (game reward style — no pill)
        ctx.shadowColor = p.glow || "rgba(26,48,123,0.35)";
        ctx.shadowBlur = 18;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = p.glow || "#c4a574";
        ctx.strokeText(p.text, 0, 0);
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
        return true;
      });
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [syncScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    // Track pointer on window so paddle never freezes when cursor
    // leaves the stage / shell — still map X into canvas space + clamp.
    const setPointer = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      const state = stateRef.current;
      if (!state) return;
      state.pointerX = clientX - rect.left;
    };

    const onPointerMove = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen" || e.pointerType === "touch") {
        setPointer(e.clientX);
      }
    };
    const onMouseMove = (e) => setPointer(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches[0]) setPointer(e.touches[0].clientX);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const state = stateRef.current;
        if (!state || overlay || countdown) return;
        const wasPaused = state.paused;
        const cracked = state.cracked;
        buildRound();
        const next = stateRef.current;
        if (next) {
          next.paused = wasPaused;
          next.cracked = cracked;
          runningRef.current = !wasPaused;
          syncScore(cracked);
        }
      }, 180);
    });
    ro.observe(wrap);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      ro.disconnect();
      window.clearTimeout(resizeTimer);
    };
  }, [buildRound, overlay, countdown, syncScore]);

  const toggleMusic = () => {
    const audio = ensureAudio();
    if (!audio) return;
    audio.resume();
    if (musicOn) {
      audio.stopMusic();
      setMusicOn(false);
    } else {
      audio.startMusic();
      setMusicOn(true);
    }
  };

  const replay = async () => {
    ensureAudio()?.resume();
    setOverlay(null);
    await startWithCountdown();
  };

  return (
    <section
      id="lift"
      data-scroll-dwell
      className="stelora-breaker relative flex h-[100svh] max-h-[100svh] flex-col overflow-hidden border-t border-stelora-line bg-stelora-canvas"
      aria-labelledby="breaker-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 30%, rgba(26, 48, 123, 0.05) 0%, transparent 65%), linear-gradient(180deg, #f9f7f2 0%, #f4f2ec 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl shrink-0 px-5 pt-5 text-center md:px-8 md:pt-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="font-display text-[0.65rem] font-bold uppercase tracking-[0.26em] text-stelora-muted"
        >
          Brand lift
        </motion.p>
        <motion.h2
          id="breaker-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-1.5 font-display text-[clamp(1.45rem,3.8vw,2.35rem)] font-bold leading-[1.05] tracking-[-0.035em] text-stelora-navy"
        >
          Stelora lifts your brand
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-1 max-w-lg font-body text-[0.82rem] leading-relaxed text-stelora-muted"
        >
          Guide the brand with Stelora. Crack growth, sales, profit — every hit is a win.
        </motion.p>
      </div>

      <div className="relative z-10 min-h-0 flex-1 px-3 pb-3 pt-2 md:px-8 md:pb-4">
        <div className="stelora-breaker__shell h-full max-h-[min(720px,calc(100svh-200px))]">
          <div className="stelora-breaker__toolbar">
            <div className="stelora-breaker__stat">
              <span className="stelora-breaker__stat-label">Wins unlocked</span>
              <span className="stelora-breaker__stat-value">
                {score}
                <span style={{ opacity: 0.35, fontWeight: 600 }}> / {total || "—"}</span>
              </span>
            </div>
            <div className="stelora-breaker__toolbar-actions">
              <button
                type="button"
                className={`stelora-breaker__chip${musicOn ? " is-on" : ""}`}
                onClick={toggleMusic}
                aria-pressed={musicOn}
              >
                {musicOn ? "Music on" : "Music"}
              </button>
            </div>
          </div>

          <div ref={wrapRef} className="stelora-breaker__stage">
            <canvas ref={canvasRef} className="stelora-breaker__canvas" aria-label="Stelora brand lift game" />

            {countdown ? (
              <div className="stelora-breaker__countdown" aria-live="polite">
                <span key={countdown} className="stelora-breaker__countdown-num">
                  {countdown}
                </span>
              </div>
            ) : null}

            {overlay ? (
              <div className="stelora-breaker__overlay">
                <div className="stelora-breaker__replay-stack">
                  <button
                    type="button"
                    className="stelora-breaker__replay-arrow"
                    onClick={replay}
                    aria-label="Replay"
                  >
                    <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M32 10a22 22 0 0 0-18.7 10.4l-3.8-3.8V28h11.4l-3.6-3.6A16.5 16.5 0 1 1 15.5 32h-5.6A22 22 0 1 0 32 10z"
                      />
                    </svg>
                  </button>
                  <button type="button" className="stelora-breaker__replay" onClick={replay}>
                    Replay
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="stelora-breaker__legend" aria-hidden>
            {PACKS.map((b) => (
              <span key={b.name} className="stelora-breaker__legend-item">
                <span className="stelora-breaker__swatch" style={{ background: b.color }} />
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
