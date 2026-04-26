'use client';

/**
 * RobloxWorldBackground
 *
 * An ORIGINAL stylized isometric blocky world — inspired by the playful blocky-creator
 * aesthetic but never copying any first-party Roblox key art or characters.
 *
 * Performance contract:
 * - Single SVG, no JS animation loop.
 * - All motion is CSS keyframes on `transform` only (GPU layer).
 * - prefers-reduced-motion: motion fully disabled, scene remains as a static painting.
 * - pointer-events: none — never blocks interaction with overlying content.
 * - Lazy-rendered: parent decides when to mount; OK to mount on any page.
 *
 * Layered for parallax depth: sky → distant islands → mid islands → foreground walkers.
 */

import { memo } from 'react';
import { useReducedMotion } from 'framer-motion';

const PALETTE = {
  sky1: '#BDE3FF',
  sky2: '#E2D6FF',
  sun:  '#FFD89C',
  cloud:'#FFFCF5',
  green1:'#A8E6CF',
  green2:'#7FCFAB',
  green3:'#5FB28C',
  ground:'#FFF8EE',
  groundDark:'#F4ECDC',
  syrup:'#C97B3D',
  syrupDeep:'#8E5326',
  butter:'#FFD89C',
  pancake:'#E8A53C',
  berry:'#FF9EC0',
  cap:'#1F1611',
  cocoa:'#3B2A22',
  sage:'#A8E6CF',
  jeans:'#7AB7E8',
  bag:'#FFFCF5',
};

type AvatarSpec = {
  hat: string;
  hair: string;
  shirt: string;
  pants: string;
  bag?: string;
};

const AVATARS: AvatarSpec[] = [
  // anchor avatar — black cap, sage cardigan, white bag
  { hat: PALETTE.cap, hair: '#5A3A26', shirt: PALETTE.sage, pants: PALETTE.jeans, bag: PALETTE.bag },
  // pink waffle hoodie squad
  { hat: PALETTE.berry, hair: '#3B2A22', shirt: PALETTE.berry, pants: '#3B2A22' },
  // morning spawn fit (mint cap)
  { hat: PALETTE.green2, hair: '#2A1810', shirt: PALETTE.butter, pants: '#3B2A22' },
  // cozy cream
  { hat: '#FFFCF5', hair: '#7B5A3C', shirt: '#FFFCF5', pants: PALETTE.jeans },
];

function BlockyAvatar({ spec, scale = 1 }: { spec: AvatarSpec; scale?: number }) {
  // 24x40 base unit avatar; scale is applied via parent transform
  const s = scale;
  return (
    <g style={{ transform: `scale(${s})`, transformOrigin: 'center bottom' }}>
      {/* shadow */}
      <ellipse cx="0" cy="2" rx="9" ry="2.2" fill="#3B2A22" opacity="0.18" />
      {/* legs */}
      <g className="walker-legs">
        <rect x="-7" y="-12" width="6" height="12" rx="1.5" fill={spec.pants} />
        <rect x="1"  y="-12" width="6" height="12" rx="1.5" fill={spec.pants} />
      </g>
      {/* shoes */}
      <rect x="-7.5" y="-2"  width="7" height="3" rx="1" fill={PALETTE.cocoa} />
      <rect x="0.5"  y="-2"  width="7" height="3" rx="1" fill={PALETTE.cocoa} />
      {/* body (shirt/cardigan) */}
      <rect x="-9" y="-26" width="18" height="14" rx="3" fill={spec.shirt} />
      {/* arms */}
      <rect x="-12" y="-25" width="3.5" height="11" rx="1.5" fill={spec.shirt} />
      <rect x="8.5"  y="-25" width="3.5" height="11" rx="1.5" fill={spec.shirt} />
      {/* bag */}
      {spec.bag && (
        <g>
          <rect x="9" y="-21" width="6" height="5" rx="1" fill={spec.bag} stroke={PALETTE.cocoa} strokeWidth="0.4"/>
          {/* bear charm */}
          <circle cx="14.5" cy="-15" r="1.4" fill="#F4D7B4" stroke={PALETTE.cocoa} strokeWidth="0.3"/>
        </g>
      )}
      {/* head */}
      <rect x="-7" y="-38" width="14" height="13" rx="3" fill="#F4D7B4" />
      {/* hair */}
      <path d="M-7,-36 Q-7,-42 0,-42 Q7,-42 7,-36 L7,-25 Q5,-22 4,-25 L4,-30 L-4,-30 L-4,-25 Q-5,-22 -7,-25 Z" fill={spec.hair} />
      {/* hat */}
      <path d={`M-7,-39 Q0,-43 7,-39 L7,-36 L-7,-36 Z`} fill={spec.hat}/>
      <path d={`M-9,-36 L9,-36 L10,-34.5 L-10,-34.5 Z`} fill={spec.hat}/>
      {/* eyes */}
      <rect x="-3.5" y="-32" width="1.4" height="1.6" rx="0.4" fill={PALETTE.cocoa}/>
      <rect x="2.1"  y="-32" width="1.4" height="1.6" rx="0.4" fill={PALETTE.cocoa}/>
      {/* tiny smile */}
      <path d="M-2,-29.5 Q0,-28.5 2,-29.5" stroke={PALETTE.cocoa} strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    </g>
  );
}

const RobloxWorldBackgroundInner = function RobloxWorldBackgroundInner() {
  const reduce = useReducedMotion();
  const m = (cls: string) => (reduce ? '' : cls);

  return (
    <div
      aria-hidden
      className="rwb-root"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // soft mask so the bottom edge fades into the page bg
        WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 78%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, #000 0%, #000 78%, transparent 100%)',
      }}
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        role="img"
        aria-label=""
      >
        <defs>
          <linearGradient id="rwb-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor={PALETTE.sky2} stopOpacity="0.85"/>
            <stop offset="60%" stopColor={PALETTE.sky1} stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#FFFCF5" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="rwb-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFCF5" stopOpacity="0.9"/>
            <stop offset="60%" stopColor={PALETTE.sun} stopOpacity="0.85"/>
            <stop offset="100%" stopColor={PALETTE.sun} stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="rwb-island-top" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.green1}/>
            <stop offset="100%" stopColor={PALETTE.green2}/>
          </linearGradient>
          <linearGradient id="rwb-island-side" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.green3}/>
            <stop offset="100%" stopColor="#3B7B5C"/>
          </linearGradient>
          <linearGradient id="rwb-syrup" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.pancake}/>
            <stop offset="100%" stopColor={PALETTE.syrupDeep}/>
          </linearGradient>
          <pattern id="rwb-waffle" width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill={PALETTE.butter}/>
            <line x1="0" y1="11" x2="22" y2="11" stroke={PALETTE.syrup} strokeWidth="1.4" opacity="0.6"/>
            <line x1="11" y1="0" x2="11" y2="22" stroke={PALETTE.syrup} strokeWidth="1.4" opacity="0.6"/>
          </pattern>
        </defs>

        {/* Sky */}
        <rect width="1600" height="900" fill="url(#rwb-sky)"/>
        {/* Sun */}
        <circle cx="1280" cy="180" r="160" fill="url(#rwb-sun)"/>

        {/* Drifting clouds */}
        <g className={m('rwb-cloud-track-a')}>
          <ellipse cx="200" cy="120" rx="60" ry="14" fill={PALETTE.cloud} opacity="0.95"/>
          <ellipse cx="240" cy="115" rx="32" ry="10" fill={PALETTE.cloud} opacity="0.95"/>
        </g>
        <g className={m('rwb-cloud-track-b')}>
          <ellipse cx="900" cy="80" rx="80" ry="16" fill={PALETTE.cloud} opacity="0.9"/>
          <ellipse cx="950" cy="75" rx="34" ry="11" fill={PALETTE.cloud} opacity="0.9"/>
        </g>
        <g className={m('rwb-cloud-track-c')}>
          <ellipse cx="500" cy="200" rx="50" ry="12" fill={PALETTE.cloud} opacity="0.7"/>
        </g>

        {/* Distant breakfast skyline (parallax slow) */}
        <g className={m('rwb-far-track')}>
          {/* Pancake tower far */}
          <g transform="translate(180,560)">
            <rect x="-44" y="-10" width="88" height="14" rx="3" fill={PALETTE.pancake}/>
            <rect x="-50" y="-22" width="100" height="14" rx="3" fill={PALETTE.butter}/>
            <rect x="-46" y="-34" width="92" height="14" rx="3" fill={PALETTE.pancake}/>
            <rect x="-52" y="-46" width="104" height="14" rx="3" fill={PALETTE.butter}/>
            {/* drip */}
            <path d="M-52,-32 q-4,12 0,18" fill="none" stroke={PALETTE.syrup} strokeWidth="3"/>
          </g>
          {/* Waffle castle far */}
          <g transform="translate(540,540)">
            <rect x="-90" y="-80" width="180" height="80" fill="url(#rwb-waffle)" stroke={PALETTE.syrup} strokeWidth="2"/>
            <polygon points="-90,-80 0,-130 90,-80" fill={PALETTE.berry} stroke={PALETTE.cocoa} strokeWidth="1.5"/>
            <rect x="-12" y="-30" width="24" height="30" fill={PALETTE.cocoa}/>
            <circle cx="-50" cy="-60" r="6" fill={PALETTE.cocoa}/>
            <circle cx="50"  cy="-60" r="6" fill={PALETTE.cocoa}/>
          </g>
          {/* Cereal silo far */}
          <g transform="translate(1100,560)">
            <rect x="-30" y="-110" width="60" height="110" rx="6" fill={PALETTE.berry}/>
            <ellipse cx="0" cy="-110" rx="30" ry="10" fill="#FFFCF5"/>
            <rect x="-30" y="-60" width="60" height="6" fill={PALETTE.cocoa} opacity="0.2"/>
          </g>
          {/* Egg dome far */}
          <g transform="translate(1380,580)">
            <ellipse cx="0" cy="-30" rx="60" ry="34" fill={PALETTE.cloud}/>
            <ellipse cx="0" cy="-22" rx="30" ry="18" fill={PALETTE.butter}/>
          </g>
        </g>

        {/* Ground/road plane (isometric look via skew) */}
        <g>
          <path d="M-100,720 L1700,720 L1700,900 L-100,900 Z" fill={PALETTE.ground}/>
          <path d="M-100,720 L1700,720 L1700,740 L-100,740 Z" fill={PALETTE.groundDark} opacity="0.55"/>
          {/* path lines */}
          <line x1="-100" y1="780" x2="1700" y2="780" stroke={PALETTE.cocoa} strokeWidth="1" strokeDasharray="6 14" opacity="0.18"/>
          <line x1="-100" y1="820" x2="1700" y2="820" stroke={PALETTE.cocoa} strokeWidth="1" strokeDasharray="4 12" opacity="0.12"/>
        </g>

        {/* Mid islands — closer + faster parallax */}
        <g className={m('rwb-mid-track')}>
          {/* Floating waffle island #1 */}
          <g transform="translate(360,470)">
            <ellipse cx="0" cy="38" rx="84" ry="14" fill={PALETTE.cocoa} opacity="0.16"/>
            {/* island slab */}
            <path d="M-90,0 L90,0 L70,40 L-70,40 Z" fill="url(#rwb-island-side)"/>
            <ellipse cx="0" cy="0" rx="90" ry="20" fill="url(#rwb-island-top)"/>
            {/* tree-waffle */}
            <g transform="translate(-40,-8)">
              <rect x="-3" y="-4" width="6" height="10" fill={PALETTE.syrup}/>
              <circle cx="0" cy="-12" r="11" fill="url(#rwb-waffle)" stroke={PALETTE.syrup} strokeWidth="1"/>
            </g>
            {/* berry */}
            <g transform="translate(35,-6)">
              <circle cx="0" cy="0" r="7" fill={PALETTE.berry}/>
              <path d="M-2,-6 L0,-9 L2,-6 Z" fill={PALETTE.green3}/>
            </g>
          </g>

          {/* Floating egg cloud island */}
          <g transform="translate(820,420)">
            <ellipse cx="0" cy="36" rx="76" ry="12" fill={PALETTE.cocoa} opacity="0.16"/>
            <ellipse cx="0" cy="0" rx="82" ry="22" fill={PALETTE.cloud}/>
            <ellipse cx="0" cy="-2" rx="20" ry="10" fill={PALETTE.butter}/>
          </g>

          {/* Pancake stack tower mid */}
          <g transform="translate(1160,450)">
            <ellipse cx="0" cy="56" rx="58" ry="10" fill={PALETTE.cocoa} opacity="0.18"/>
            <rect x="-46" y="20" width="92" height="14" rx="3" fill={PALETTE.pancake}/>
            <rect x="-50" y="6"  width="100" height="14" rx="3" fill={PALETTE.butter}/>
            <rect x="-46" y="-8" width="92" height="14" rx="3" fill={PALETTE.pancake}/>
            <rect x="-50" y="-22" width="100" height="14" rx="3" fill={PALETTE.butter}/>
            <rect x="-44" y="-36" width="88" height="14" rx="3" fill={PALETTE.pancake}/>
            {/* butter pat */}
            <rect x="-12" y="-46" width="24" height="10" rx="2" fill="#FFEFC8"/>
            {/* syrup drip */}
            <path d="M-50,-12 q-4,16 0,24" fill="none" stroke={PALETTE.syrup} strokeWidth="3"/>
          </g>
        </g>

        {/* WALKERS — blocky avatars walking the road */}
        {/* Walker A — anchor avatar (left → right, slow) */}
        <g className={m('rwb-walker-a')} transform="translate(0,800)">
          <BlockyAvatar spec={AVATARS[0]} scale={1.35} />
        </g>
        {/* Walker B — pink hoodie squad (left → right, mid speed, delayed) */}
        <g className={m('rwb-walker-b')} transform="translate(0,805)">
          <BlockyAvatar spec={AVATARS[1]} scale={1.2} />
        </g>
        {/* Walker C — opposite direction, faster */}
        <g className={m('rwb-walker-c')} transform="translate(0,798)">
          <BlockyAvatar spec={AVATARS[2]} scale={1.15} />
        </g>
        {/* Walker D — cozy cream, far back, slowest */}
        <g className={m('rwb-walker-d')} transform="translate(0,790)">
          <BlockyAvatar spec={AVATARS[3]} scale={0.9} />
        </g>

        {/* Tiny floating breakfast props in foreground */}
        <g className={m('rwb-prop-a')} transform="translate(120,620)">
          <text fontSize="32">🥞</text>
        </g>
        <g className={m('rwb-prop-b')} transform="translate(1480,640)">
          <text fontSize="36">🧇</text>
        </g>
        <g className={m('rwb-prop-c')} transform="translate(720,360)">
          <text fontSize="22">⭐</text>
        </g>
      </svg>

      <style>{`
        /* Layer parallax — slower for distant, faster for closer */
        @keyframes rwbDriftSlow { from { transform: translate3d(0,0,0); } to { transform: translate3d(-160px,0,0); } }
        @keyframes rwbDriftMid  { from { transform: translate3d(0,0,0); } to { transform: translate3d(-260px,0,0); } }
        @keyframes rwbDriftFast { from { transform: translate3d(0,0,0); } to { transform: translate3d(-380px,0,0); } }

        @keyframes rwbCloudA { 0% { transform: translate3d(-200px,0,0);} 100% { transform: translate3d(1700px,0,0);} }
        @keyframes rwbCloudB { 0% { transform: translate3d(-200px,8px,0);} 100% { transform: translate3d(1700px,-8px,0);} }
        @keyframes rwbCloudC { 0% { transform: translate3d(-200px,0,0);} 100% { transform: translate3d(1800px,0,0);} }

        @keyframes rwbWalkRight { 0% { transform: translate3d(-80px,0,0);} 100% { transform: translate3d(1700px,0,0);} }
        @keyframes rwbWalkLeft  { 0% { transform: translate3d(1700px,0,0);} 100% { transform: translate3d(-120px,0,0);} }

        /* Subtle bob — only on legs/body group via class on the avatar walker container */
        @keyframes rwbBob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-4px);} }

        @keyframes rwbFloat { 0%,100%{ transform: translateY(0) rotate(-3deg);} 50%{ transform: translateY(-12px) rotate(3deg);} }

        .rwb-far-track  { animation: rwbDriftSlow 60s linear infinite alternate; will-change: transform; }
        .rwb-mid-track  { animation: rwbDriftMid  40s linear infinite alternate; will-change: transform; }
        .rwb-cloud-track-a { animation: rwbCloudA 75s linear infinite; will-change: transform; }
        .rwb-cloud-track-b { animation: rwbCloudB 95s linear infinite; will-change: transform; }
        .rwb-cloud-track-c { animation: rwbCloudC 60s linear infinite; will-change: transform; }

        .rwb-walker-a { animation: rwbWalkRight 28s linear infinite, rwbBob 0.55s ease-in-out infinite; will-change: transform; }
        .rwb-walker-b { animation: rwbWalkRight 36s linear infinite, rwbBob 0.6s ease-in-out infinite; will-change: transform; animation-delay: -10s, 0s; }
        .rwb-walker-c { animation: rwbWalkLeft  24s linear infinite, rwbBob 0.5s ease-in-out infinite; will-change: transform; animation-delay: -6s, 0s; }
        .rwb-walker-d { animation: rwbWalkRight 50s linear infinite, rwbBob 0.7s ease-in-out infinite; will-change: transform; animation-delay: -22s, 0s; }

        .rwb-prop-a { animation: rwbFloat 5s ease-in-out infinite; will-change: transform; }
        .rwb-prop-b { animation: rwbFloat 6.4s ease-in-out infinite; will-change: transform; animation-delay: -1.6s; }
        .rwb-prop-c { animation: rwbFloat 4.2s ease-in-out infinite; will-change: transform; animation-delay: -0.8s; }

        /* Pause when tab is hidden — performance hygiene */
        .rwb-root[data-paused="true"] * { animation-play-state: paused !important; }

        @media (prefers-reduced-motion: reduce) {
          .rwb-root * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export const RobloxWorldBackground = memo(RobloxWorldBackgroundInner);
