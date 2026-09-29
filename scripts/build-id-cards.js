const fs = require("fs");
const path = require("path");

const dest = path.join("public", "images", "collage");
fs.mkdirSync(dest, { recursive: true });

const portraitSrc =
  "C:/Users/rohan/.cursor/projects/c-Projects-Stelora/assets/founder-portrait.jpg";
const logoSrc = path.join("public", "logo.webp");

fs.copyFileSync(portraitSrc, path.join(dest, "founder-portrait.jpg"));

const portraitB64 = fs.readFileSync(portraitSrc).toString("base64");
const logoB64 = fs.readFileSync(logoSrc).toString("base64");

const front = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#1A307B"/>
  <defs>
    <clipPath id="c"><circle cx="300" cy="280" r="118"/></clipPath>
  </defs>
  <circle cx="300" cy="280" r="122" fill="none" stroke="#FFF4E0" stroke-width="4" opacity="0.55"/>
  <image href="data:image/jpeg;base64,${portraitB64}" x="182" y="162" width="236" height="236" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="460" text-anchor="middle" fill="#FFF4E0" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" opacity="0.9">founder</text>
  <text x="300" y="510" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">Divya Chauhan</text>
  <text x="300" y="740" text-anchor="middle" fill="#FFF4E0" font-family="Arial, Helvetica, sans-serif" font-size="14" opacity="0.75">@ copyright stelora media</text>
</svg>`;

const back = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#1A307B"/>
  <image href="data:image/webp;base64,${logoB64}" x="150" y="260" width="300" height="280" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

fs.writeFileSync(path.join(dest, "id-front.svg"), front);
fs.writeFileSync(path.join(dest, "id-back.svg"), back);

// Also copy generated PNGs as raster fallbacks
const frontPng = "C:/Users/rohan/.cursor/projects/c-Projects-Stelora/assets/id-card-front.png";
const backPng = "C:/Users/rohan/.cursor/projects/c-Projects-Stelora/assets/id-card-back.png";
if (fs.existsSync(frontPng)) fs.copyFileSync(frontPng, path.join(dest, "id-front.png"));
if (fs.existsSync(backPng)) fs.copyFileSync(backPng, path.join(dest, "id-back.png"));

console.log("ok", {
  frontSvg: fs.statSync(path.join(dest, "id-front.svg")).size,
  backSvg: fs.statSync(path.join(dest, "id-back.svg")).size,
});
