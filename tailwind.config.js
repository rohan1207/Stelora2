/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        stelora: {
          canvas: "var(--stelora-canvas)",
          ink: "var(--stelora-ink)",
          navy: "var(--stelora-navy)",
          cream: "var(--stelora-cream)",
          muted: "var(--stelora-muted)",
          line: "var(--stelora-line)",
          accent: "var(--stelora-accent)",
          surface: "var(--stelora-surface)",
          "on-image": "var(--stelora-on-image)",
          black: "var(--stelora-black)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      letterSpacing: {
        brand: "-0.04em",
        hero: "-0.035em",
        label: "0.18em",
      },
      lineHeight: {
        crush: "0.88",
      },
    },
  },
  plugins: [],
};
