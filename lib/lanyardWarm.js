const CARD_GLB = "/lanyard/card.glb";
const LANYARD_TEX = "/lanyard/lanyard.png";
const FRONT = "/founder.jpeg";
const BACK = "/logo.webp";

export const LANYARD_ASSETS = { CARD_GLB, LANYARD_TEX, FRONT, BACK };
export const INTRO_SESSION_KEY = "stelora-entered";

const HIGH =
  typeof Request !== "undefined"
    ? { cache: "force-cache", priority: "high", mode: "cors" }
    : { cache: "force-cache", mode: "cors" };

let LanyardComponent = null;
let warmPromise = null;

export function getLanyard() {
  return LanyardComponent;
}

function warmImage(src) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const done = () => resolve(true);
      if (img.decode) img.decode().then(done).catch(done);
      else done();
    };
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function warmFetch(url) {
  return fetch(url, HIGH)
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .catch(() => null);
}

/**
 * One-shot warm: GLB bytes, textures decoded, Lanyard chunk, drei GLTF cache.
 */
export function warmLanyardPipeline() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (warmPromise) return warmPromise;

  warmPromise = (async () => {
    const glb = warmFetch(CARD_GLB);
    const images = Promise.all([
      warmImage(LANYARD_TEX),
      warmImage(FRONT),
      warmImage(BACK),
    ]);
    const chunk = import("@/components/Lanyard")
      .then((mod) => {
        LanyardComponent = mod.default;
        return mod.default;
      })
      .catch(() => null);
    const drei = import("@react-three/drei")
      .then((mod) => {
        try {
          mod.useGLTF.preload(CARD_GLB);
        } catch {
          /* ignore */
        }
        return mod;
      })
      .catch(() => null);

    await Promise.all([glb, images, chunk, drei]);
    return LanyardComponent;
  })();

  return warmPromise;
}
