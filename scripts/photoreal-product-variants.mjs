// Generate photo-real hoodie color variants by hue-shifting the two real JPEGs
// via SVG <feColorMatrix>. Output is SVG that embeds the real photo + applies a
// color-shift filter, so visually it reads as a real photo in a new colorway.
//
// Run: node scripts/photoreal-product-variants.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PUB = path.join(root, 'public', 'shop');

const mintJpg = fs.readFileSync(path.join(PUB, 'photo-hoodie-mint-breakfast.jpeg')).toString('base64');
const pinkJpg = fs.readFileSync(path.join(PUB, 'photo-hoodie-pink-waffle.jpeg')).toString('base64');

// HSL hue shifts in DEGREES applied to the base color (0 = identity).
// Using feColorMatrix `hueRotate` to recolor without losing photographic detail.
// We use the MINT base for cool colorways (mint→sky→lavender→butter)
// and the PINK base for warm colorways (pink→peach→syrup→berry).

function variantSVG({ baseB64, hue = 0, saturate = 1, label, alt }) {
  // hueRotate in SVG via matrix is 0-360 degrees
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254" role="img" aria-label="${alt}">
  <defs>
    <filter id="recolor" color-interpolation-filters="sRGB">
      <feColorMatrix type="hueRotate" values="${hue}"/>
      <feColorMatrix type="saturate" values="${saturate}"/>
    </filter>
  </defs>
  <image href="data:image/jpeg;base64,${baseB64}" width="1254" height="1254" filter="url(#recolor)" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
}

// Mint-base colorway shifts (mint hoodie photo -> other cool colors)
const mintVariants = [
  // hue 0 = identity (mint already), so we don't write the original here
  { slug: 'photo-hoodie-cream-classic',   hue:  20, saturate: 0.35, label: 'Cream Classic Hoodie', alt: 'Cream classic hoodie with EMG731 logo' },
  { slug: 'photo-hoodie-butter-pancake',  hue:  60, saturate: 1.10, label: 'Butter Pancake Hoodie', alt: 'Butter yellow pancake hoodie' },
  { slug: 'photo-hoodie-lavender-cereal', hue: 230, saturate: 0.55, label: 'Lavender Cereal Hoodie', alt: 'Lavender Cereal Chaos hoodie' },
  { slug: 'photo-hoodie-sky-morning',     hue: 180, saturate: 0.65, label: 'Sky Morning Hoodie',   alt: 'Sky-blue morning hoodie' },
  { slug: 'photo-hoodie-black-cap',       hue:   0, saturate: 0.05, label: 'Black EMG731 Hoodie', alt: 'Black EMG731 hoodie (avatar callback)' },
];

// Pink-base colorway shifts (pink waffle hoodie photo -> other warm colors)
const pinkVariants = [
  { slug: 'photo-hoodie-syrup-amber',    hue: 330, saturate: 1.10, label: 'Syrup Amber Zip',    alt: 'Honey-amber Syrup Drip zip hoodie with waffle' },
  { slug: 'photo-hoodie-berry-stack',    hue: 350, saturate: 1.15, label: 'Berry Waffle Stack', alt: 'Berry Waffle Stack hoodie' },
  { slug: 'photo-hoodie-coral-warm',     hue:  10, saturate: 0.95, label: 'Coral Warm Waffle',  alt: 'Coral waffle hoodie' },
];

// Sweatpants / joggers — composite the photo into a vertical crop layout
// with a "sweatpants" silhouette mask. Trick: tile the photo as the fabric
// texture so the color reads photographic.
function pantsSVG({ baseB64, hue, saturate, label, alt, joggers = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="${alt}">
  <defs>
    <filter id="recolor" color-interpolation-filters="sRGB">
      <feColorMatrix type="hueRotate" values="${hue}"/>
      <feColorMatrix type="saturate" values="${saturate}"/>
    </filter>
    <pattern id="fabric" patternUnits="userSpaceOnUse" width="600" height="600">
      <image href="data:image/jpeg;base64,${baseB64}" x="-200" y="-300" width="900" height="900" filter="url(#recolor)" preserveAspectRatio="xMidYMid slice"/>
    </pattern>
    <radialGradient id="floor" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
      <feOffset dx="0" dy="14"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="1200" fill="#FFFFFF"/>
  <ellipse cx="600" cy="1160" rx="380" ry="32" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <rect x="380" y="160" width="440" height="48" rx="6" fill="url(#fabric)"/>
    <path d="M380,210 L590,210 L570,${joggers ? 1080 : 1140} L320,${joggers ? 1080 : 1140} Z" fill="url(#fabric)"/>
    <path d="M610,210 L820,210 L880,${joggers ? 1080 : 1140} L630,${joggers ? 1080 : 1140} Z" fill="url(#fabric)"/>
    <line x1="600" y1="210" x2="600" y2="${joggers ? 1080 : 1140}" stroke="rgba(0,0,0,0.10)" stroke-width="2"/>
    ${joggers ? `
      <rect x="320" y="1080" width="250" height="48" rx="6" fill="url(#fabric)"/>
      <rect x="630" y="1080" width="250" height="48" rx="6" fill="url(#fabric)"/>
    ` : ''}
    <path d="M${600-40},190 Q${600-42},230 ${600-26},250 L${600-30},262 L${600-22},252" stroke="#FFFFFF" stroke-width="3" fill="none"/>
    <path d="M${600+40},190 Q${600+42},230 ${600+26},250 L${600+22},262 L${600+14},252" stroke="#FFFFFF" stroke-width="3" fill="none"/>
    <circle cx="${600-30}" cy="268" r="6" fill="#FFFFFF"/>
    <circle cx="${600+22}" cy="268" r="6" fill="#FFFFFF"/>
  </g>
</svg>`;
}

// Cap: tile photo as crown fabric
function capSVG({ baseB64, hue, saturate, label, alt }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="${alt}">
  <defs>
    <filter id="recolor"><feColorMatrix type="hueRotate" values="${hue}"/><feColorMatrix type="saturate" values="${saturate}"/></filter>
    <pattern id="fabric" patternUnits="userSpaceOnUse" width="800" height="800">
      <image href="data:image/jpeg;base64,${baseB64}" width="800" height="800" filter="url(#recolor)" preserveAspectRatio="xMidYMid slice"/>
    </pattern>
    <radialGradient id="floor" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
      <feOffset dx="0" dy="14"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="1200" fill="#FFFFFF"/>
  <ellipse cx="600" cy="1000" rx="420" ry="38" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <path d="M280,580 Q300,300 600,290 Q900,300 920,580 Z" fill="url(#fabric)"/>
    <path d="M180,580 Q600,700 1020,580 Q1020,620 980,680 Q600,760 220,680 Q180,620 180,580 Z" fill="url(#fabric)"/>
    <text x="600" y="480" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="64" fill="#FFFCF5">${label}</text>
  </g>
</svg>`;
}

function write(file, content) { fs.writeFileSync(path.join(PUB, file), content); }

// Hoodies — overwrite the SVG mockups with photo-real variants
mintVariants.forEach(v => write(`${v.slug}.svg`, variantSVG({ baseB64: mintJpg, ...v })));
pinkVariants.forEach(v => write(`${v.slug}.svg`, variantSVG({ baseB64: pinkJpg, ...v })));

// Sweatpants — recolor the photo as fabric
write('photo-sweatpants-mint-breakfast.svg', pantsSVG({ baseB64: mintJpg, hue: 0,   saturate: 1.0, label: '', alt: 'Mint breakfast sweatpants matching mint hoodie' }));
write('photo-sweatpants-pink-waffle.svg',    pantsSVG({ baseB64: pinkJpg, hue: 0,   saturate: 1.0, label: '', alt: 'Pink waffle sweatpants matching pink hoodie' }));
write('photo-sweatpants-cream.svg',          pantsSVG({ baseB64: mintJpg, hue: 20,  saturate: 0.35, label: '', alt: 'Cream classic sweatpants' }));
write('photo-sweatpants-cocoa.svg',          pantsSVG({ baseB64: mintJpg, hue: 30,  saturate: 0.10, label: '', alt: 'Cocoa Morning Spawn sweatpants', joggers: false }));
write('photo-joggers-mint-tapered.svg',      pantsSVG({ baseB64: mintJpg, hue: 0,   saturate: 1.0, label: '', alt: 'Mint tapered joggers', joggers: true }));
write('photo-joggers-pink-tapered.svg',      pantsSVG({ baseB64: pinkJpg, hue: 0,   saturate: 1.0, label: '', alt: 'Pink tapered joggers', joggers: true }));
write('photo-joggers-cocoa-tapered.svg',     pantsSVG({ baseB64: mintJpg, hue: 30,  saturate: 0.10, label: '', alt: 'Cocoa tapered joggers', joggers: true }));

// Caps — recolor the photo as crown fabric
write('photo-cap-black-emg731.svg',     capSVG({ baseB64: mintJpg, hue: 0,   saturate: 0.05, label: 'EMG731',    alt: 'Black EMG731 dad cap' }));
write('photo-cap-mint-breakfast.svg',   capSVG({ baseB64: mintJpg, hue: 0,   saturate: 1.0,  label: 'BREAKFAST', alt: 'Mint breakfast dad cap' }));
write('photo-cap-pink-waffle.svg',      capSVG({ baseB64: pinkJpg, hue: 0,   saturate: 1.0,  label: 'WAFFLE',    alt: 'Pink waffle dad cap' }));
write('photo-cap-cream-emg.svg',        capSVG({ baseB64: mintJpg, hue: 20,  saturate: 0.35, label: 'EMG',       alt: 'Cream EMG dad cap' }));

console.log('✓ Photo-real product variants generated');
