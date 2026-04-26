// Generates SVG placeholder assets so the site renders end-to-end
// before the full image pipeline runs. Each placeholder is on-brand and
// reads as an "intentional sketch" until replaced with a final render.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.resolve(__dirname, '..', 'public');

function ensure(p) { fs.mkdirSync(p, { recursive: true }); }

function makeHeroSVG({ title, gradient, motif }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${gradient.map((c, i, a) => `<stop offset="${(i / (a.length - 1)) * 100}%" stop-color="${c}"/>`).join('')}</linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#FFFCF5" stop-opacity="0.5"/><stop offset="100%" stop-color="#FFFCF5" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  <g font-family="ui-serif, Georgia, serif" fill="#3B2A22" text-anchor="middle">
    <text x="800" y="480" font-size="220" font-weight="900" opacity="0.92">${motif}</text>
    <text x="800" y="600" font-size="42" font-weight="700">${title}</text>
    <text x="800" y="640" font-size="20" opacity="0.7">Replace with rendered image — see /content/images/master-image-manifest.json</text>
  </g>
</svg>`;
}

function makeCardSVG({ title, gradient, motif, ratio = '1' }) {
  const [w, h] = ratio === 'v' ? [800, 1000] : ratio === 'h' ? [1280, 720] : [1000, 1000];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${gradient.map((c, i, a) => `<stop offset="${(i/(a.length-1))*100}%" stop-color="${c}"/>`).join('')}</linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <text x="${w/2}" y="${h/2 - 40}" font-family="ui-serif, Georgia, serif" font-size="${Math.min(w,h)*0.36}" text-anchor="middle" fill="#3B2A22" opacity="0.9">${motif}</text>
  <text x="${w/2}" y="${h/2 + 40}" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="${Math.min(w,h)*0.045}" text-anchor="middle" fill="#3B2A22">${title}</text>
</svg>`;
}

function write(rel, content) {
  const full = path.join(PUB, rel);
  ensure(path.dirname(full));
  fs.writeFileSync(full, content);
}

// Hero placeholders
write('images/hero/hero-breakfast-castle.svg', makeHeroSVG({ title: 'Breakfast Castle Hero', gradient: ['#A8E6CF', '#FFD89C', '#FF9EC0'], motif: '🏰🥞🧇' }));
write('images/hero/hero-stream-room.svg',     makeHeroSVG({ title: 'Cozy Stream Room',     gradient: ['#A8E6CF', '#BDE3FF', '#FFFCF5'], motif: '🎮🥞☕' }));
write('images/hero/hero-cereal-galaxy.svg',   makeHeroSVG({ title: 'Cereal Galaxy',        gradient: ['#E2D6FF', '#A8E6CF', '#FFD89C'], motif: '🥣⭐🌌' }));

// Avatar placeholders
write('images/avatars/avatar-sage-cardigan.svg', makeCardSVG({ title: 'Avatar — Sage Cardigan', gradient: ['#A8E6CF', '#BDE3FF'], motif: '🧢', ratio: 'v' }));
write('images/avatars/avatar-pancake-plate.svg', makeCardSVG({ title: 'Avatar — Pancake Plate', gradient: ['#FFD89C', '#FFFCF5'], motif: '🥞' }));
write('images/avatars/avatar-squad-wave.svg',    makeCardSVG({ title: 'Avatar — Squad Wave',    gradient: ['#FF9EC0', '#FFFCF5'], motif: '👋', ratio: 'v' }));

// Gallery placeholders
const gallery = [
  ['breakfast-triple-waffle', 'Triple Waffle Stack', ['#FFD89C','#E8A53C'], '🧇'],
  ['breakfast-egg-trio',      'Sunny Egg Trio',      ['#FFD89C','#FFFCF5'], '🍳'],
  ['breakfast-pancake-tower', 'Pancake Tower',       ['#FFD89C','#FF9EC0'], '🥞'],
  ['thumb-cereal-galaxy',     'Cereal Galaxy',       ['#E2D6FF','#A8E6CF'], '🥣'],
  ['thumb-pancake-stream',    'Pancake Stream',      ['#FFD89C','#FFFCF5'], '🥞'],
  ['thumb-fits-sage',         'Sage Fits',           ['#A8E6CF','#FFFCF5'], '🧢'],
  ['thumb-tt-waffle',         'Waffle Tuesday',      ['#FFD89C','#FF9EC0'], '🧇'],
  ['thumb-tt-checklist',      'Breakfast Checklist', ['#A8E6CF','#FFD89C'], '✅'],
  ['thumb-tt-fit',            'Cap Fit Check',       ['#FF9EC0','#FFFCF5'], '🧢'],
  ['cover-breakfast-boss',    'Breakfast Boss',      ['#A8E6CF','#FFD89C'], '🥞'],
  ['cover-waffle-stack',      'Waffle Stack',        ['#FFD89C','#E8A53C'], '🧇'],
  ['cover-egg-drop',          'Egg Drop',            ['#FFD89C','#E8A53C'], '🍳'],
  ['cover-pancake-power-up',  'Pancake Power-Up',    ['#FFD89C','#A8E6CF'], '🥞'],
  ['cover-cereal-chaos',      'Cereal Chaos',        ['#E2D6FF','#A8E6CF'], '🥣'],
  ['cover-morning-spawn',     'Morning Spawn',       ['#A8E6CF','#FFD89C'], '🎮'],
  ['cover-syrup-drip',        'Syrup Drip',          ['#E8A53C','#C97B3D'], '🍯'],
  ['cover-cozy-breakfast-club', 'Cozy Breakfast Club', ['#FFD89C','#FFFCF5'], '☕'],
  ['cover-breakfast-gamer-essentials', 'Breakfast Gamer Essentials', ['#A8E6CF','#BDE3FF'], '🎒'],
  ['cover-eat-with-emm',      'Eat With EMM',        ['#FF9EC0','#FFD89C'], '🧢'],
];
gallery.forEach(([slug, title, grad, motif]) => write(`images/gallery/${slug}.svg`, makeCardSVG({ title, gradient: grad, motif })));

// Shop product placeholders (one per p001..p040)
const SHOP = [
  ['hoodie-mint-breakfast', 'Mint Breakfast Hoodie', ['#A8E6CF','#FFFCF5'], '🥞'],
  ['hoodie-pink-waffle',    'Pink Waffle Hoodie',    ['#FF9EC0','#FFFCF5'], '🧇'],
  ['hoodie-zip-syrup',      'Syrup Drip Zip Hoodie', ['#E8A53C','#C97B3D'], '🍯'],
  ['crewneck-cream',        'Cozy Cream Crewneck',   ['#FFFCF5','#FFD89C'], '☕'],
  ['crewneck-pancake',      'Pancake Crewneck',      ['#FFD89C','#FFFCF5'], '🥞'],
  ['sweatpants-morning',    'Morning Spawn Sweats',  ['#A8E6CF','#3B2A22'], '🎮'],
  ['pajamas-set',           'Pajama Set',            ['#FFD89C','#FF9EC0'], '🌙'],
  ['tee-cropped-eatwithemm','Cropped Tee',           ['#FFFCF5','#FF9EC0'], '✨'],
  ['tee-breakfast-boss',    'Breakfast Boss Tee',    ['#FFFCF5','#A8E6CF'], '🥞'],
  ['tee-cereal-chaos',      'Cereal Chaos Tee',      ['#E2D6FF','#FFFCF5'], '🥣'],
  ['tee-3pack',             'Tee 3-Pack',            ['#A8E6CF','#FF9EC0'], '👕'],
  ['cap-black-emg731',      'Black EMG731 Cap',      ['#1F1611','#FFFCF5'], '🧢'],
  ['beanie-mint',           'Mint Beanie',           ['#A8E6CF','#FFFCF5'], '🧶'],
  ['socks-3pack',           'Socks 3-Pack',          ['#FFD89C','#FF9EC0'], '🧦'],
  ['slippers-pancake',      'Pancake Slippers',      ['#FFD89C','#FFFCF5'], '🥞'],
  ['backpack-breakfast',    'Breakfast Backpack',    ['#A8E6CF','#FFD89C'], '🎒'],
  ['lunchbag-eatwithemm',   'Lunch Cooler',          ['#FF9EC0','#FFFCF5'], '🍱'],
  ['tote-waffle',           'Waffle Tote',           ['#FFFCF5','#FFD89C'], '🧇'],
  ['case-phone-egg',        'Egg Phone Case',        ['#FFD89C','#FFFCF5'], '🍳'],
  ['case-tablet-mint',      'Tablet Sleeve',         ['#A8E6CF','#FFFCF5'], '📱'],
  ['mug-morning',           'Morning Mug',           ['#FFFCF5','#FFD89C'], '☕'],
  ['tumbler-syrup',         'Syrup Tumbler',         ['#E8A53C','#C97B3D'], '🍯'],
  ['waterbottle-mint',      'Water Bottle',          ['#A8E6CF','#FFFCF5'], '💧'],
  ['deskmat-breakfastworld','Desk Mat',              ['#FFD89C','#FF9EC0'], '🗺️'],
  ['mousepad-egg',          'Egg Mouse Pad',         ['#FFD89C','#FFFCF5'], '🍳'],
  ['blanket-cozy',          'Cozy Blanket',          ['#FFD89C','#FF9EC0'], '🛌'],
  ['pillow-pancake',        'Pancake Pillow',        ['#FFD89C','#FFFCF5'], '🥞'],
  ['poster-cereal-galaxy',  'Cereal Galaxy Poster',  ['#E2D6FF','#A8E6CF'], '🥣'],
  ['journal-breakfast',     'Breakfast Journal',     ['#FFFCF5','#FFD89C'], '📓'],
  ['stickers-squad',        'Squad Stickers',        ['#FFD89C','#A8E6CF'], '🌟'],
  ['plush-waffle-wendy',    'Waffle Wendy Plush',    ['#FFD89C','#FFFCF5'], '🧇'],
  ['plush-eggy',            'Eggy Plush',            ['#FFD89C','#FFFCF5'], '🍳'],
  ['pins-breakfast',        'Pin Set',               ['#FFD89C','#FF9EC0'], '📌'],
  ['keychain-bear',         'Bear Keychain',         ['#FFFCF5','#FFD89C'], '🧸'],
  ['digital-wallpapers',    'Wallpaper Pack',        ['#A8E6CF','#FF9EC0'], '📱'],
  ['digital-overlays',      'Stream Overlays',       ['#A8E6CF','#FFD89C'], '📺'],
  ['digital-cards',         'Printable Cards',       ['#FFD89C','#FFFCF5'], '🃏'],
  ['digital-stickers',      'Digital Stickers',      ['#FF9EC0','#FFFCF5'], '🌟'],
  ['cardigan-sage',         'Sage Cardigan',         ['#A8E6CF','#FFFCF5'], '🧥'],
  ['purse-bear',            'Bear Charm Purse',      ['#FFFCF5','#A8E6CF'], '👜'],
];
SHOP.forEach(([slug, title, grad, motif]) => write(`shop/${slug}.svg`, makeCardSVG({ title, gradient: grad, motif })));

// Wallpapers
write('downloads/wallpaper-mint-morning.svg',  makeCardSVG({ title: 'Mint Morning · Phone',  gradient: ['#A8E6CF','#BDE3FF','#E2D6FF'], motif: '🌅', ratio: 'v' }));
write('downloads/wallpaper-berry-toast.svg',   makeCardSVG({ title: 'Berry Toast · Phone',   gradient: ['#FF9EC0','#FFD89C','#FFFCF5'], motif: '🍞', ratio: 'v' }));

// OG image
write('social-preview/og-default.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="EMGamer731 social preview">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#A8E6CF"/><stop offset="50%" stop-color="#FFD89C"/><stop offset="100%" stop-color="#FF9EC0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="200" font-family="ui-serif, Georgia, serif" font-size="92" font-weight="900" fill="#3B2A22">EMGamer731</text>
  <text x="80" y="280" font-family="ui-serif, Georgia, serif" font-size="44" font-weight="800" font-style="italic" fill="#3B2A22">"What did you guys eat for breakfast today?"</text>
  <text x="80" y="360" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" fill="#3B2A22" opacity="0.85">Roblox · breakfast · livestreaming · the cozy creator HQ</text>
  <text x="1100" y="540" text-anchor="end" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" font-size="24" fill="#3B2A22">eatsswithemm · @EMGamer731</text>
</svg>`);

// Favicon
write('favicons/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#A8E6CF"/>
  <path d="M14 38c0-8 6-14 14-14h8c8 0 14 6 14 14 0 4-3 7-7 7H21c-4 0-7-3-7-7z" fill="#3B2A22"/>
  <circle cx="26" cy="34" r="2" fill="#FFFCF5"/><circle cx="38" cy="34" r="2" fill="#FFFCF5"/>
</svg>`);

console.log('SVG placeholder assets generated.');
