/**
 * Loose scrapbook stickers — edges only, keeps the ring clear.
 */
const STICKERS = [
  { id: "star", top: "14%", left: "6%", rotate: -18, scale: 1, delay: 0 },
  { id: "pill", top: "22%", right: "7%", rotate: 8, scale: 0.95, delay: 0.4 },
  { id: "spark", top: "58%", left: "4%", rotate: 12, scale: 0.88, delay: 0.2 },
  { id: "tag", top: "72%", left: "11%", rotate: -6, scale: 1, delay: 0.6 },
  { id: "arrow", top: "18%", right: "14%", rotate: 22, scale: 0.9, delay: 0.15 },
  { id: "smile", top: "68%", right: "5%", rotate: -14, scale: 0.92, delay: 0.5 },
  { id: "dots", top: "42%", left: "7%", rotate: 4, scale: 0.85, delay: 0.35 },
  { id: "wave", top: "48%", right: "6%", rotate: -10, scale: 0.9, delay: 0.25 },
  { id: "cam", top: "82%", right: "12%", rotate: 6, scale: 0.82, delay: 0.45 },
  { id: "heart", top: "36%", right: "9%", rotate: -20, scale: 0.78, delay: 0.55 },
];

function StickerArt({ id }) {
  switch (id) {
    case "star":
      return (
        <svg viewBox="0 0 64 64" className="orbit-sticker__svg" aria-hidden>
          <path
            fill="#fff4e0"
            stroke="#1a307b"
            strokeWidth="2.2"
            d="M32 6l7.2 16.8L58 26l-14 12.2 4.2 18.6L32 48.8 15.8 56.8 20 38.2 6 26l18.8-3.2L32 6z"
          />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 120 44" className="orbit-sticker__svg orbit-sticker__svg--wide" aria-hidden>
          <rect x="2" y="2" width="116" height="40" rx="20" fill="#1a307b" />
          <text x="60" y="28" textAnchor="middle" fill="#fff4e0" fontSize="13" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
            ON BRAND
          </text>
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 48 48" className="orbit-sticker__svg orbit-sticker__svg--sm" aria-hidden>
          <path fill="#1a307b" d="M24 2l3 12 12-3-8 10 10 8-12-3-3 12-3-12-12 3 8-10-10-8 12 3 3-12z" opacity="0.9" />
          <circle cx="24" cy="24" r="4" fill="#fff4e0" />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 72 72" className="orbit-sticker__svg" aria-hidden>
          <path fill="#c4a574" stroke="#1a307b" strokeWidth="1.5" d="M8 12h36l20 20-20 20H8V12z" />
          <circle cx="22" cy="22" r="5" fill="#1a307b" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 80 48" className="orbit-sticker__svg orbit-sticker__svg--wide" aria-hidden>
          <path
            fill="none"
            stroke="#1a307b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 24h52M48 12l16 12-16 12"
          />
        </svg>
      );
    case "smile":
      return (
        <svg viewBox="0 0 56 56" className="orbit-sticker__svg orbit-sticker__svg--sm" aria-hidden>
          <circle cx="28" cy="28" r="24" fill="#fff4e0" stroke="#1a307b" strokeWidth="2" />
          <circle cx="20" cy="24" r="2.5" fill="#1a307b" />
          <circle cx="36" cy="24" r="2.5" fill="#1a307b" />
          <path fill="none" stroke="#1a307b" strokeWidth="2" strokeLinecap="round" d="M18 34c4 6 16 6 20 0" />
        </svg>
      );
    case "dots":
      return (
        <svg viewBox="0 0 52 52" className="orbit-sticker__svg orbit-sticker__svg--sm" aria-hidden>
          <rect x="4" y="4" width="44" height="44" rx="8" fill="#fff4e0" stroke="#1a307b" strokeWidth="1.8" strokeDasharray="4 3" />
          {[14, 26, 38].map((x) =>
            [14, 26, 38].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#1a307b" opacity="0.55" />
            ))
          )}
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 100 36" className="orbit-sticker__svg orbit-sticker__svg--wide" aria-hidden>
          <path
            fill="#1a307b"
            d="M4 22c12-14 24-14 36 0s24 14 36 0 24-14 36 0v10H4V22z"
            opacity="0.92"
          />
          <text x="50" y="16" textAnchor="middle" fill="#fff4e0" fontSize="9" fontWeight="700" fontFamily="Space Grotesk, sans-serif" letterSpacing="0.12em">
            CREATIVE
          </text>
        </svg>
      );
    case "cam":
      return (
        <svg viewBox="0 0 64 52" className="orbit-sticker__svg" aria-hidden>
          <rect x="6" y="14" width="52" height="32" rx="6" fill="#1a307b" />
          <circle cx="32" cy="30" r="10" fill="#fff4e0" stroke="#0c1638" strokeWidth="2" />
          <path fill="#1a307b" d="M22 14l6-8h8l6 8H22z" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 48 48" className="orbit-sticker__svg orbit-sticker__svg--sm" aria-hidden>
          <path
            fill="none"
            stroke="#1a307b"
            strokeWidth="2.5"
            d="M24 38s-14-9-14-18a8 8 0 0114-5 8 8 0 0114 5c0 9-14 18-14 18z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function OrbitStickers() {
  return (
    <div className="orbit-stickers" aria-hidden>
      {STICKERS.map((s) => (
        <div
          key={s.id}
          className="orbit-sticker"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            ["--orbit-rot"]: `${s.rotate}deg`,
            ["--orbit-scale"]: String(s.scale),
          }}
        >
          <div className="orbit-sticker__inner" style={{ animationDelay: `${s.delay}s` }}>
            <StickerArt id={s.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
