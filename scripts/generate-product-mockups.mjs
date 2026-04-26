// Generates photo-realistic flat product mockups on white backgrounds.
// Style match for the user's real Canva product photos (mint slogan hoodie + pink waffle hoodie).
//
// Each mockup is composed of stylized SVG primitives — proper hoodie/sweatpant/cap/sock silhouettes
// with ribbed cuffs, kangaroo pockets, drawstrings, and a printed graphic on the chest.
// Run: node scripts/generate-product-mockups.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOP = path.resolve(__dirname, '..', 'public', 'shop');

function ensure(p) { fs.mkdirSync(p, { recursive: true }); }
function write(rel, content) {
  const full = path.join(SHOP, rel);
  ensure(path.dirname(full));
  fs.writeFileSync(full, content);
}

const W = 1200, H = 1200;
const SHADOW = `
  <defs>
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
`;

// === HOODIE ============================================================
function hoodieSVG({ body, accent = body, graphic, alt = 'Hoodie mockup' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-100}" rx="380" ry="36" fill="url(#floor)"/>
  <!-- Hoodie body -->
  <g filter="url(#soft)">
    <!-- Sleeves -->
    <path d="M260,360 Q200,440 180,640 Q170,760 200,830 L320,810 Q300,720 320,640 Q340,560 380,500 Z" fill="${body}"/>
    <path d="M${W-260},360 Q${W-200},440 ${W-180},640 Q${W-170},760 ${W-200},830 L${W-320},810 Q${W-300},720 ${W-320},640 Q${W-340},560 ${W-380},500 Z" fill="${body}"/>
    <!-- Body torso -->
    <path d="M380,360 Q380,300 470,290 L${W-470},290 Q${W-380},300 ${W-380},360 L${W-380},970 Q${W/2},1010 380,970 Z" fill="${body}"/>
    <!-- Hood (back layer) -->
    <path d="M460,300 Q480,170 ${W/2},150 Q${W-480},170 ${W-460},300 L${W-560},310 Q${W-540},220 ${W/2},210 Q560,220 580,310 Z" fill="${body}"/>
    <!-- Hood inner shadow -->
    <path d="M520,290 Q540,210 ${W/2},195 Q${W-540},210 ${W-520},290 L${W-580},300 Q${W-560},230 ${W/2},220 Q560,230 580,300 Z" fill="${accent}" opacity="0.18"/>
    <!-- Drawstrings -->
    <path d="M${W/2-30},250 Q${W/2-32},310 ${W/2-22},340 L${W/2-26},350 L${W/2-18},340" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.85"/>
    <path d="M${W/2+30},250 Q${W/2+32},310 ${W/2+22},340 L${W/2+18},350 L${W/2+10},340" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.85"/>
    <circle cx="${W/2-26}" cy="358" r="6" fill="#FFFFFF"/>
    <circle cx="${W/2+18}" cy="358" r="6" fill="#FFFFFF"/>
    <!-- Sleeve seam shading -->
    <path d="M260,360 Q230,440 220,640 Q215,760 230,830" stroke="rgba(0,0,0,0.06)" stroke-width="2" fill="none"/>
    <path d="M${W-260},360 Q${W-230},440 ${W-220},640 Q${W-215},760 ${W-230},830" stroke="rgba(0,0,0,0.06)" stroke-width="2" fill="none"/>
    <!-- Shoulder seams -->
    <path d="M380,360 Q420,330 470,330" stroke="rgba(0,0,0,0.07)" stroke-width="2" fill="none"/>
    <path d="M${W-380},360 Q${W-420},330 ${W-470},330" stroke="rgba(0,0,0,0.07)" stroke-width="2" fill="none"/>
    <!-- Kangaroo pocket -->
    <path d="M420,720 L${W-420},720 L${W-440},900 L440,900 Z" fill="${body}"/>
    <path d="M420,720 L${W-420},720" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>
    <line x1="430" y1="725" x2="${W-430}" y2="725" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
    <!-- Pocket hand openings -->
    <path d="M450,760 Q470,755 490,760" stroke="rgba(0,0,0,0.20)" stroke-width="2" fill="none"/>
    <path d="M${W-450},760 Q${W-470},755 ${W-490},760" stroke="rgba(0,0,0,0.20)" stroke-width="2" fill="none"/>
    <!-- Ribbed cuffs (sleeves) -->
    <rect x="195" y="820" width="135" height="32" rx="4" fill="${body}"/>
    <rect x="${W-330}" y="820" width="135" height="32" rx="4" fill="${body}"/>
    <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
      <line x1="200" y1="826" x2="325" y2="826"/>
      <line x1="200" y1="838" x2="325" y2="838"/>
      <line x1="200" y1="848" x2="325" y2="848"/>
      <line x1="${W-325}" y1="826" x2="${W-200}" y2="826"/>
      <line x1="${W-325}" y1="838" x2="${W-200}" y2="838"/>
      <line x1="${W-325}" y1="848" x2="${W-200}" y2="848"/>
    </g>
    <!-- Ribbed bottom hem -->
    <rect x="385" y="950" width="${W-770}" height="38" rx="4" fill="${body}"/>
    <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
      <line x1="395" y1="958" x2="${W-395}" y2="958"/>
      <line x1="395" y1="972" x2="${W-395}" y2="972"/>
      <line x1="395" y1="982" x2="${W-395}" y2="982"/>
    </g>
  </g>
  <!-- Chest graphic -->
  <g transform="translate(${W/2},540)">${graphic}</g>
</svg>`;
}

// === PANTS / SWEATS / JOGGERS =========================================
function pantsSVG({ body, accent = body, label = '', alt = 'Pants mockup', joggers = false }) {
  // Joggers have ribbed ankle cuffs; sweats have straight hems.
  const cuff = joggers
    ? `<rect x="320" y="1080" width="180" height="50" rx="6" fill="${body}"/>
       <rect x="${W-500}" y="1080" width="180" height="50" rx="6" fill="${body}"/>
       <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
         <line x1="330" y1="1090" x2="495" y2="1090"/>
         <line x1="330" y1="1104" x2="495" y2="1104"/>
         <line x1="330" y1="1116" x2="495" y2="1116"/>
         <line x1="${W-490}" y1="1090" x2="${W-325}" y2="1090"/>
         <line x1="${W-490}" y1="1104" x2="${W-325}" y2="1104"/>
         <line x1="${W-490}" y1="1116" x2="${W-325}" y2="1116"/>
       </g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-40}" rx="380" ry="32" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <!-- Waistband -->
    <rect x="380" y="160" width="${W-760}" height="48" rx="6" fill="${body}"/>
    <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
      <line x1="390" y1="170" x2="${W-390}" y2="170"/>
      <line x1="390" y1="184" x2="${W-390}" y2="184"/>
      <line x1="390" y1="196" x2="${W-390}" y2="196"/>
    </g>
    <!-- Drawstring -->
    <path d="M${W/2-40},190 Q${W/2-42},230 ${W/2-26},250 L${W/2-30},262 L${W/2-22},252" stroke="#FFFFFF" stroke-width="3" fill="none"/>
    <path d="M${W/2+40},190 Q${W/2+42},230 ${W/2+26},250 L${W/2+22},262 L${W/2+14},252" stroke="#FFFFFF" stroke-width="3" fill="none"/>
    <circle cx="${W/2-30}" cy="268" r="6" fill="#FFFFFF"/>
    <circle cx="${W/2+22}" cy="268" r="6" fill="#FFFFFF"/>
    <!-- Left leg -->
    <path d="M380,210 L${W/2-10},210 L${W/2-30},${joggers ? 1080 : 1140} L320,${joggers ? 1080 : 1140} Z" fill="${body}"/>
    <!-- Right leg -->
    <path d="M${W/2+10},210 L${W-380},210 L${W-320},${joggers ? 1080 : 1140} L${W/2+30},${joggers ? 1080 : 1140} Z" fill="${body}"/>
    <!-- Center seam shadow -->
    <line x1="${W/2}" y1="210" x2="${W/2}" y2="${joggers ? 1080 : 1140}" stroke="rgba(0,0,0,0.07)" stroke-width="2"/>
    <!-- Side pocket lines -->
    <path d="M420,300 q-30,40 -10,90" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none"/>
    <path d="M${W-420},300 q30,40 10,90" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none"/>
    ${cuff}
  </g>
  <!-- Hip/thigh graphic anchor -->
  <g transform="translate(${W/2-180},520)">
    <text font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="42" fill="${accent}" opacity="0.85">${label}</text>
  </g>
</svg>`;
}

// === DAD CAP ===========================================================
function capSVG({ body, accent = '#FFFFFF', label = 'EMG731', alt = 'Cap mockup' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-200}" rx="420" ry="38" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <!-- Crown -->
    <path d="M280,580 Q300,300 ${W/2},290 Q${W-300},300 ${W-280},580 Z" fill="${body}"/>
    <!-- Crown panels (subtle stitch lines) -->
    <g stroke="rgba(0,0,0,0.18)" stroke-width="1.6" fill="none">
      <path d="M${W/2-180},560 Q${W/2-180},370 ${W/2},310"/>
      <path d="M${W/2-60},580 Q${W/2-60},340 ${W/2},300"/>
      <path d="M${W/2+60},580 Q${W/2+60},340 ${W/2},300"/>
      <path d="M${W/2+180},560 Q${W/2+180},370 ${W/2},310"/>
    </g>
    <!-- Top button -->
    <circle cx="${W/2}" cy="305" r="10" fill="${body}"/>
    <circle cx="${W/2}" cy="305" r="5" fill="rgba(0,0,0,0.25)"/>
    <!-- Brim -->
    <path d="M180,580 Q${W/2},700 ${W-180},580 Q${W-180},620 ${W-220},680 Q${W/2},760 220,680 Q180,620 180,580 Z" fill="${body}"/>
    <!-- Brim stitch lines -->
    <path d="M210,620 Q${W/2},730 ${W-210},620" stroke="rgba(0,0,0,0.20)" stroke-width="1.6" fill="none"/>
    <path d="M230,640 Q${W/2},740 ${W-230},640" stroke="rgba(0,0,0,0.15)" stroke-width="1.4" fill="none"/>
    <!-- Embroidered front logo -->
    <g transform="translate(${W/2},460)">
      <text font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="64" fill="${accent}" text-anchor="middle">${label}</text>
    </g>
  </g>
</svg>`;
}

// === SOCKS =============================================================
function socksSVG({ body, stripe = '#FFFFFF', graphic, alt = 'Socks mockup' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-100}" rx="350" ry="28" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <!-- Sock A (left) -->
    <g transform="translate(${W/2-180},0)">
      <path d="M-90,180 L90,180 L90,820 Q90,890 30,890 Q-30,890 -50,820 Z" fill="${body}"/>
      <!-- Toe block -->
      <path d="M-50,820 Q-30,890 30,890 Q90,890 90,820 L120,820 L130,860 Q90,920 30,920 Q-30,920 -60,870 Z" fill="${body}"/>
      <!-- Heel -->
      <path d="M-50,720 Q-90,760 -50,820 L-30,820 Z" fill="${body}"/>
      <!-- Ribbed cuff -->
      <rect x="-90" y="180" width="180" height="50" rx="6" fill="${body}"/>
      <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
        <line x1="-86" y1="190" x2="86" y2="190"/>
        <line x1="-86" y1="204" x2="86" y2="204"/>
        <line x1="-86" y1="218" x2="86" y2="218"/>
      </g>
      <!-- Stripe band -->
      <rect x="-90" y="240" width="180" height="14" fill="${stripe}"/>
      <!-- Graphic -->
      <g transform="translate(0,400)">${graphic}</g>
    </g>
    <!-- Sock B (right) — mirrored -->
    <g transform="translate(${W/2+180},0) scale(-1,1)">
      <path d="M-90,180 L90,180 L90,820 Q90,890 30,890 Q-30,890 -50,820 Z" fill="${body}"/>
      <path d="M-50,820 Q-30,890 30,890 Q90,890 90,820 L120,820 L130,860 Q90,920 30,920 Q-30,920 -60,870 Z" fill="${body}"/>
      <path d="M-50,720 Q-90,760 -50,820 L-30,820 Z" fill="${body}"/>
      <rect x="-90" y="180" width="180" height="50" rx="6" fill="${body}"/>
      <g stroke="rgba(0,0,0,0.10)" stroke-width="1">
        <line x1="-86" y1="190" x2="86" y2="190"/>
        <line x1="-86" y1="204" x2="86" y2="204"/>
        <line x1="-86" y1="218" x2="86" y2="218"/>
      </g>
      <rect x="-90" y="240" width="180" height="14" fill="${stripe}"/>
      <g transform="translate(0,400) scale(-1,1)">${graphic}</g>
    </g>
  </g>
</svg>`;
}

// === TEE ===============================================================
function teeSVG({ body, graphic, alt = 'Tee mockup' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-60}" rx="380" ry="32" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <!-- Sleeves -->
    <path d="M280,300 Q220,360 200,460 L340,520 Q360,440 400,400 Z" fill="${body}"/>
    <path d="M${W-280},300 Q${W-220},360 ${W-200},460 L${W-340},520 Q${W-360},440 ${W-400},400 Z" fill="${body}"/>
    <!-- Body -->
    <path d="M400,300 Q400,250 480,240 L${W-480},240 Q${W-400},250 ${W-400},300 L${W-380},1020 Q${W/2},1060 380,1020 Z" fill="${body}"/>
    <!-- Crew neck -->
    <path d="M${W/2-80},240 Q${W/2},200 ${W/2+80},240 Q${W/2},280 ${W/2-80},240 Z" fill="#FFFFFF"/>
    <path d="M${W/2-80},240 Q${W/2},200 ${W/2+80},240" stroke="rgba(0,0,0,0.18)" stroke-width="2" fill="none"/>
    <!-- Sleeve hem stitch -->
    <line x1="200" y1="460" x2="340" y2="520" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>
    <line x1="${W-200}" y1="460" x2="${W-340}" y2="520" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>
    <!-- Bottom hem stitch -->
    <line x1="395" y1="1010" x2="${W-395}" y2="1010" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>
  </g>
  <g transform="translate(${W/2},580)">${graphic}</g>
</svg>`;
}

// === BEANIE ============================================================
function beanieSVG({ body, accent = '#FFFFFF', label = 'EMG', alt = 'Beanie mockup' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  ${SHADOW}
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="${W/2}" cy="${H-220}" rx="340" ry="34" fill="url(#floor)"/>
  <g filter="url(#soft)">
    <!-- Crown -->
    <path d="M340,580 Q360,260 ${W/2},250 Q${W-360},260 ${W-340},580 Z" fill="${body}"/>
    <!-- Knit lines -->
    <g stroke="rgba(0,0,0,0.10)" stroke-width="1.5" fill="none">
      ${Array.from({length: 16}, (_,i) => `<line x1="${340 + i*32}" y1="580" x2="${360 + i*30}" y2="270"/>`).join('')}
    </g>
    <!-- Folded cuff -->
    <rect x="320" y="560" width="${W-640}" height="120" rx="14" fill="${body}"/>
    <g stroke="rgba(0,0,0,0.14)" stroke-width="1.6">
      <line x1="330" y1="600" x2="${W-330}" y2="600"/>
      <line x1="330" y1="630" x2="${W-330}" y2="630"/>
      <line x1="330" y1="660" x2="${W-330}" y2="660"/>
    </g>
    <!-- Top pom -->
    <circle cx="${W/2}" cy="240" r="46" fill="${body}"/>
    <g stroke="rgba(255,255,255,0.45)" stroke-width="2">
      ${Array.from({length: 14}, (_,i) => {
        const a = (i/14) * Math.PI * 2;
        return `<line x1="${W/2}" y1="240" x2="${W/2 + Math.cos(a)*46}" y2="${240 + Math.sin(a)*46}"/>`;
      }).join('')}
    </g>
    <!-- Tab label -->
    <g transform="translate(${W/2},620)">
      <rect x="-60" y="-22" width="120" height="44" rx="8" fill="${accent}"/>
      <text font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="28" fill="${body === '#FFFFFF' ? '#3B2A22' : '#FFFFFF'}" text-anchor="middle" dy="10">${label}</text>
    </g>
  </g>
</svg>`;
}

// ===== Reusable graphics ==============================================

function eggsGraphic() {
  return `
    <g text-anchor="middle">
      <text font-family="Inter,sans-serif" font-weight="900" font-size="60" fill="#1F1611">WHAT DID YOU</text>
      <text font-family="Inter,sans-serif" font-weight="900" font-size="60" fill="#1F1611" y="70">GUYS</text>
      <g transform="translate(0,180)">
        <ellipse cx="-40" cy="0" rx="86" ry="64" fill="#FFFCF5" stroke="#1F1611" stroke-width="6"/>
        <circle cx="-40" cy="0" r="32" fill="#FFC851"/>
        <ellipse cx="40" cy="20" rx="86" ry="64" fill="#FFFCF5" stroke="#1F1611" stroke-width="6"/>
        <circle cx="40" cy="20" r="32" fill="#FFC851"/>
      </g>
      <text font-family="Inter,sans-serif" font-weight="900" font-size="60" fill="#1F1611" y="320">EAT FOR</text>
      <text font-family="Inter,sans-serif" font-weight="900" font-size="60" fill="#1F1611" y="390">BREAKFAST?</text>
    </g>`;
}

function waffleStackGraphic(scale = 1) {
  return `
    <g transform="scale(${scale})" text-anchor="middle">
      <!-- Base waffle -->
      <g transform="translate(0,80)">
        <rect x="-110" y="-40" width="220" height="80" rx="14" fill="#E8A53C"/>
        <g stroke="#C97B3D" stroke-width="3" opacity="0.55">
          <line x1="-110" y1="-12" x2="110" y2="-12"/>
          <line x1="-110" y1="12" x2="110" y2="12"/>
          <line x1="-50" y1="-40" x2="-50" y2="40"/>
          <line x1="0" y1="-40" x2="0" y2="40"/>
          <line x1="50" y1="-40" x2="50" y2="40"/>
        </g>
      </g>
      <!-- Mid waffle -->
      <g transform="translate(0,-20)">
        <rect x="-115" y="-44" width="230" height="80" rx="14" fill="#E8A53C"/>
        <g stroke="#C97B3D" stroke-width="3" opacity="0.55">
          <line x1="-115" y1="-16" x2="115" y2="-16"/>
          <line x1="-115" y1="8" x2="115" y2="8"/>
          <line x1="-55" y1="-44" x2="-55" y2="36"/>
          <line x1="0" y1="-44" x2="0" y2="36"/>
          <line x1="55" y1="-44" x2="55" y2="36"/>
        </g>
      </g>
      <!-- Top waffle -->
      <g transform="translate(0,-130)">
        <rect x="-105" y="-44" width="210" height="80" rx="14" fill="#FFD89C"/>
        <g stroke="#C97B3D" stroke-width="3" opacity="0.55">
          <line x1="-105" y1="-16" x2="105" y2="-16"/>
          <line x1="-105" y1="8" x2="105" y2="8"/>
          <line x1="-50" y1="-44" x2="-50" y2="36"/>
          <line x1="0" y1="-44" x2="0" y2="36"/>
          <line x1="50" y1="-44" x2="50" y2="36"/>
        </g>
      </g>
      <!-- Butter pat -->
      <g transform="translate(-10,-180)">
        <rect x="-26" y="-12" width="52" height="22" rx="3" fill="#FFFBF0"/>
        <rect x="-26" y="-12" width="52" height="6" rx="2" fill="#FFFFFF"/>
      </g>
      <!-- Syrup drips -->
      <path d="M-110,-30 q-26,40 -8,72 q-2,8 -8,4 q4,-12 -2,-30 q-12,-22 18,-46 z" fill="#C97B3D" opacity="0.95"/>
      <path d="M90,30 q24,40 -2,68 q-2,4 -6,2 q4,-10 -2,-22 q-6,-14 10,-48 z" fill="#C97B3D" opacity="0.9"/>
    </g>`;
}

function sloganShortGraphic(line1, line2 = '') {
  return `
    <g text-anchor="middle">
      <text font-family="Inter,sans-serif" font-weight="900" font-size="68" fill="#1F1611">${line1}</text>
      ${line2 ? `<text y="84" font-family="Inter,sans-serif" font-weight="900" font-size="68" fill="#1F1611">${line2}</text>` : ''}
    </g>`;
}

function pancakeStackGraphic() {
  return `
    <g text-anchor="middle">
      <ellipse cx="0" cy="60" rx="120" ry="22" fill="#E8A53C"/>
      <ellipse cx="0" cy="50" rx="120" ry="18" fill="#FFE4B5"/>
      <ellipse cx="0" cy="0" rx="124" ry="22" fill="#E8A53C"/>
      <ellipse cx="0" cy="-10" rx="124" ry="18" fill="#FFE4B5"/>
      <ellipse cx="0" cy="-60" rx="120" ry="22" fill="#E8A53C"/>
      <ellipse cx="0" cy="-70" rx="120" ry="18" fill="#FFE4B5"/>
      <rect x="-25" y="-92" width="50" height="20" rx="3" fill="#FFFBF0"/>
      <path d="M-100,-30 q-30,46 -6,76 q-2,4 -6,2 q4,-10 -4,-22 q-12,-22 16,-56 z" fill="#C97B3D"/>
    </g>`;
}

function sunnyEggGraphic() {
  return `
    <g text-anchor="middle">
      <ellipse cx="0" cy="0" rx="140" ry="106" fill="#FFFCF5" stroke="#1F1611" stroke-width="6"/>
      <circle cx="0" cy="0" r="56" fill="#FFC851"/>
      <ellipse cx="-12" cy="-12" rx="14" ry="8" fill="#FFFFFF" opacity="0.7"/>
    </g>`;
}

function cerealGraphic() {
  return `
    <g text-anchor="middle">
      <circle cx="-60" cy="-30" r="22" fill="none" stroke="#FFD89C" stroke-width="10"/>
      <circle cx="0" cy="-50" r="22" fill="none" stroke="#FF9EC0" stroke-width="10"/>
      <circle cx="60" cy="-30" r="22" fill="none" stroke="#A8E6CF" stroke-width="10"/>
      <circle cx="-30" cy="40" r="22" fill="none" stroke="#FFD89C" stroke-width="10"/>
      <circle cx="40" cy="40" r="22" fill="none" stroke="#FF9EC0" stroke-width="10"/>
      <text y="120" font-family="Inter,sans-serif" font-weight="900" font-size="56" fill="#1F1611">CEREAL CHAOS</text>
    </g>`;
}

function logoBadgeGraphic() {
  return `
    <g text-anchor="middle">
      <rect x="-160" y="-50" width="320" height="100" rx="50" fill="#1F1611"/>
      <text font-family="Inter,sans-serif" font-weight="900" font-size="64" fill="#FFFCF5" dy="22">EMG<tspan fill="#E8A53C">731</tspan></text>
    </g>`;
}

// ====== WRITE PRODUCTS ================================================

// Hoodies (existing two — replace SVG variants with proper photoreal versions)
write('hoodie-mint-breakfast.svg', hoodieSVG({ body: '#A8E6CF', graphic: eggsGraphic(), alt: 'Mint slogan hoodie with sunny egg trio' }));
write('hoodie-pink-waffle.svg',    hoodieSVG({ body: '#F4B7D6', graphic: waffleStackGraphic(0.95), alt: 'Pink waffle stack hoodie' }));
write('hoodie-zip-syrup.svg',      hoodieSVG({ body: '#E8A53C', graphic: sloganShortGraphic('SYRUP', 'DRIP'), alt: 'Syrup amber zip hoodie' }));
write('hoodie-cream-classic.svg',  hoodieSVG({ body: '#F4ECDC', graphic: logoBadgeGraphic(), alt: 'Cream EMG731 classic hoodie' }));
write('hoodie-lavender-cereal.svg',hoodieSVG({ body: '#E2D6FF', graphic: cerealGraphic(), alt: 'Lavender Cereal Chaos hoodie' }));
write('hoodie-butter-pancake.svg', hoodieSVG({ body: '#FFD89C', graphic: pancakeStackGraphic(), alt: 'Butter pancake stack hoodie' }));
write('hoodie-black-cap.svg',      hoodieSVG({ body: '#1F1611', graphic: `<g text-anchor="middle"><text font-family="Inter,sans-serif" font-weight="900" font-size="80" fill="#FFFCF5">EMG<tspan fill="#E8A53C">731</tspan></text></g>`, alt: 'Black EMG731 hoodie' }));

// Crewnecks (no hood — use teeSVG style w/ longer body? — generate as hoodie minus hood for visual)
write('crewneck-cream.svg',        teeSVG({ body: '#F4ECDC', graphic: logoBadgeGraphic(), alt: 'Cream crewneck' }));
write('crewneck-pancake.svg',      teeSVG({ body: '#FFD89C', graphic: pancakeStackGraphic(), alt: 'Pancake crewneck' }));

// Sweatpants (matching hoodies)
write('sweatpants-mint-breakfast.svg', pantsSVG({ body: '#A8E6CF', accent: '#1F1611', label: '', alt: 'Mint sweatpants matching breakfast hoodie', joggers: false }));
write('sweatpants-pink-waffle.svg',    pantsSVG({ body: '#F4B7D6', accent: '#1F1611', label: '', alt: 'Pink sweatpants matching waffle hoodie', joggers: false }));
write('sweatpants-cream.svg',          pantsSVG({ body: '#F4ECDC', accent: '#1F1611', label: '', alt: 'Cream sweatpants', joggers: false }));
write('sweatpants-morning.svg',        pantsSVG({ body: '#3B2A22', accent: '#A8E6CF', label: 'EMG731', alt: 'Morning Spawn sweatpants', joggers: false }));

// Joggers (with cuff)
write('joggers-mint-tapered.svg',  pantsSVG({ body: '#A8E6CF', accent: '#1F1611', label: '', alt: 'Mint tapered joggers', joggers: true }));
write('joggers-pink-tapered.svg',  pantsSVG({ body: '#F4B7D6', accent: '#1F1611', label: '', alt: 'Pink tapered joggers', joggers: true }));
write('joggers-cocoa-tapered.svg', pantsSVG({ body: '#3B2A22', accent: '#A8E6CF', label: '', alt: 'Cocoa tapered joggers', joggers: true }));

// Caps (dad hat)
write('cap-black-emg731.svg', capSVG({ body: '#1F1611', accent: '#FFFCF5', label: 'EMG731', alt: 'Black EMG731 dad cap' }));
write('cap-mint-breakfast.svg', capSVG({ body: '#A8E6CF', accent: '#1F1611', label: 'BREAKFAST', alt: 'Mint Breakfast dad cap' }));
write('cap-pink-waffle.svg',    capSVG({ body: '#F4B7D6', accent: '#1F1611', label: 'WAFFLE', alt: 'Pink Waffle dad cap' }));
write('cap-cream-emg.svg',      capSVG({ body: '#F4ECDC', accent: '#3B2A22', label: 'EMG', alt: 'Cream EMG cap' }));

// Beanies
write('beanie-mint.svg',  beanieSVG({ body: '#A8E6CF', accent: '#FFFCF5', label: 'SQUAD', alt: 'Mint Squad beanie with pom' }));
write('beanie-pink.svg',  beanieSVG({ body: '#F4B7D6', accent: '#FFFCF5', label: 'EMG',   alt: 'Pink EMG beanie with pom' }));
write('beanie-cocoa.svg', beanieSVG({ body: '#3B2A22', accent: '#A8E6CF', label: '731',   alt: 'Cocoa 731 beanie with pom' }));

// Socks
write('socks-mint-breakfast.svg', socksSVG({ body: '#A8E6CF', stripe: '#1F1611', graphic: `<g text-anchor="middle"><text font-family="Inter,sans-serif" font-weight="900" font-size="36" fill="#1F1611">EMG731</text></g>`, alt: 'Mint EMG731 crew socks' }));
write('socks-pink-waffle.svg',    socksSVG({ body: '#F4B7D6', stripe: '#1F1611', graphic: `<g text-anchor="middle">${waffleStackGraphic(0.35)}</g>`, alt: 'Pink waffle stack crew socks' }));
write('socks-3pack.svg',          socksSVG({ body: '#FFD89C', stripe: '#3B2A22', graphic: `<g text-anchor="middle"><text font-family="Inter,sans-serif" font-weight="900" font-size="40" fill="#1F1611">SQUAD</text></g>`, alt: 'Butter Squad crew socks' }));

// Tees
write('tee-breakfast-boss.svg',     teeSVG({ body: '#A8E6CF', graphic: sloganShortGraphic('BREAKFAST', 'BOSS'), alt: 'Mint Breakfast Boss tee' }));
write('tee-cropped-eatwithemm.svg', teeSVG({ body: '#FFFCF5', graphic: sloganShortGraphic('eat with EMM'), alt: 'Cream Eat With EMM cropped tee' }));
write('tee-cereal-chaos.svg',       teeSVG({ body: '#E2D6FF', graphic: cerealGraphic(), alt: 'Lavender Cereal Chaos tee' }));
write('tee-pink-waffle.svg',        teeSVG({ body: '#F4B7D6', graphic: waffleStackGraphic(0.85), alt: 'Pink waffle tee' }));
write('tee-3pack.svg',              teeSVG({ body: '#FFFCF5', graphic: logoBadgeGraphic(), alt: 'Cream EMG731 tee — part of 3-pack' }));
write('tee-yellow-pancake.svg',     teeSVG({ body: '#FFD89C', graphic: pancakeStackGraphic(), alt: 'Butter pancake tee' }));
write('tee-syrup-amber.svg',        teeSVG({ body: '#E8A53C', graphic: sloganShortGraphic('POUR IT', 'ON.'), alt: 'Syrup amber tee' }));

console.log('✓ Wrote photo-realistic flat product mockups');
