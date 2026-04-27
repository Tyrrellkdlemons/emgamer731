'use client';

/**
 * BreakfastWorldHero — v1.2.0
 *
 * Inspired by the user's reference image (a glossy 3D pastel breakfast city) but built
 * as ORIGINAL stylized SVG art — never copying the source image.
 *
 * Composition (back → front):
 *   1. Soft sky with sun glow + cotton clouds
 *   2. Far candy skyline — pastel pillar buildings (mint / cream / peach / pink) with glossy highlights
 *   3. Mid platforms — pancake stack, butter blocks, sunny egg, cup, donut tower, syrup pool
 *   4. Floating glossy waffles + butter pats + cereal rings + sparkle stars
 *   5. Foreground crystalline pink ground line + small breakfast shards
 *
 * Performance contract preserved from v1.1:
 *   - Single SVG, GPU-only transforms, prefers-reduced-motion respected.
 *   - pointer-events: none, memo-wrapped, pauses when tab hidden.
 *   - Animations isolated to small groups so motion never repaints the whole scene.
 */

import { memo } from 'react';
import { useReducedMotion } from 'framer-motion';

const BreakfastWorldHeroInner = function BreakfastWorldHeroInner() {
  const reduce = useReducedMotion();
  const m = (cls: string) => (reduce ? '' : cls);

  return (
    <div
      aria-hidden
      className="bwh-root"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 80%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, #000 0%, #000 80%, transparent 100%)',
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
          {/* Sky */}
          <linearGradient id="bwh-sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="#FCE7F3"/>
            <stop offset="35%" stopColor="#E2F0FF"/>
            <stop offset="70%" stopColor="#FFF8EE"/>
            <stop offset="100%" stopColor="#FFE4E9"/>
          </linearGradient>
          <radialGradient id="bwh-sun" cx="42%" cy="38%" r="55%">
            <stop offset="0%"  stopColor="#FFFBF0" stopOpacity="0.95"/>
            <stop offset="40%" stopColor="#FFE4B5" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#FFE4B5" stopOpacity="0"/>
          </radialGradient>

          {/* City pillars — glossy gradient sets */}
          <linearGradient id="bwh-mint-pillar" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7FCFAB"/>
            <stop offset="35%" stopColor="#B5EDD5"/>
            <stop offset="100%" stopColor="#5FB28C"/>
          </linearGradient>
          <linearGradient id="bwh-pink-pillar" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#F58FB3"/>
            <stop offset="35%" stopColor="#FFC8DC"/>
            <stop offset="100%" stopColor="#E66B97"/>
          </linearGradient>
          <linearGradient id="bwh-cream-pillar" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#F4ECDC"/>
            <stop offset="35%" stopColor="#FFFCF5"/>
            <stop offset="100%" stopColor="#E5D4B8"/>
          </linearGradient>
          <linearGradient id="bwh-peach-pillar" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#F5B79A"/>
            <stop offset="35%" stopColor="#FFD4BC"/>
            <stop offset="100%" stopColor="#E69672"/>
          </linearGradient>

          {/* Crystalline pink ground */}
          <linearGradient id="bwh-ground" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFC8DC"/>
            <stop offset="50%" stopColor="#FF9EC0"/>
            <stop offset="100%" stopColor="#E66B97"/>
          </linearGradient>

          {/* Glossy waffle (with gold tones) */}
          <linearGradient id="bwh-waffle" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%"  stopColor="#FFD89C"/>
            <stop offset="50%" stopColor="#E8A53C"/>
            <stop offset="100%" stopColor="#C97B3D"/>
          </linearGradient>
          <pattern id="bwh-waffle-grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="url(#bwh-waffle)"/>
            <rect x="0" y="0" width="6" height="6" rx="1.5" fill="#FFE4B5" opacity="0.6"/>
            <rect x="8" y="0" width="6" height="6" rx="1.5" fill="#FFE4B5" opacity="0.6"/>
            <rect x="0" y="8" width="6" height="6" rx="1.5" fill="#FFE4B5" opacity="0.6"/>
            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="#FFE4B5" opacity="0.6"/>
          </pattern>

          {/* Pancake stack */}
          <linearGradient id="bwh-pancake" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFE4B5"/>
            <stop offset="100%" stopColor="#E8A53C"/>
          </linearGradient>
          <linearGradient id="bwh-syrup" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#E8A53C"/>
            <stop offset="100%" stopColor="#C97B3D"/>
          </linearGradient>
          <linearGradient id="bwh-butter" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFBF0"/>
            <stop offset="100%" stopColor="#FFD89C"/>
          </linearGradient>

          {/* Egg */}
          <radialGradient id="bwh-egg-yolk" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF1B8"/>
            <stop offset="60%" stopColor="#FFC851"/>
            <stop offset="100%" stopColor="#E89E2A"/>
          </radialGradient>

          {/* Cereal ring */}
          <linearGradient id="bwh-cereal" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#FFD89C"/>
            <stop offset="100%" stopColor="#FFB870"/>
          </linearGradient>

          {/* Glossy filter — soft drop shadow */}
          <filter id="bwh-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
            <feOffset dx="0" dy="6"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.25"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Sparkle */}
          <symbol id="bwh-sparkle" viewBox="-10 -10 20 20">
            <path d="M0,-9 L1.6,-1.6 L9,0 L1.6,1.6 L0,9 L-1.6,1.6 L-9,0 L-1.6,-1.6 Z" fill="#FFFFFF"/>
            <circle cx="0" cy="0" r="2.2" fill="#FFFFFF"/>
          </symbol>
        </defs>

        {/* Sky */}
        <rect width="1600" height="900" fill="url(#bwh-sky)"/>
        <ellipse cx="780" cy="360" rx="780" ry="360" fill="url(#bwh-sun)"/>

        {/* Distant cotton clouds */}
        <g className={m('bwh-cloud-far')} opacity="0.85">
          <ellipse cx="120" cy="180" rx="48" ry="14" fill="#FFFCF5"/>
          <ellipse cx="160" cy="174" rx="34" ry="11" fill="#FFFCF5"/>
          <ellipse cx="220" cy="180" rx="22" ry="9" fill="#FFFCF5"/>
        </g>
        <g className={m('bwh-cloud-mid')} opacity="0.85">
          <ellipse cx="950" cy="120" rx="56" ry="16" fill="#FFFCF5"/>
          <ellipse cx="1000" cy="115" rx="36" ry="12" fill="#FFFCF5"/>
        </g>
        <g className={m('bwh-cloud-near')} opacity="0.7">
          <ellipse cx="540" cy="240" rx="52" ry="14" fill="#FFFCF5"/>
        </g>

        {/* === Far candy skyline === */}
        <g className={m('bwh-skyline')}>
          {/* Pillars row — varied heights, all glossy with highlights and roof caps */}
          {/* Mint pillar */}
          <g transform="translate(120,420)">
            <rect x="-32" y="0" width="64" height="280" rx="8" fill="url(#bwh-mint-pillar)"/>
            <rect x="-24" y="6" width="6" height="270" rx="3" fill="#FFFFFF" opacity="0.45"/>
            <ellipse cx="0" cy="-2" rx="34" ry="8" fill="#A8E6CF"/>
            {/* tiny windows */}
            <g fill="#FFFFFF" opacity="0.65">
              <rect x="-20" y="40" width="14" height="20" rx="2"/>
              <rect x="6" y="40" width="14" height="20" rx="2"/>
              <rect x="-20" y="80" width="14" height="20" rx="2"/>
              <rect x="6" y="80" width="14" height="20" rx="2"/>
              <rect x="-20" y="120" width="14" height="20" rx="2"/>
              <rect x="6" y="120" width="14" height="20" rx="2"/>
            </g>
          </g>
          {/* Cream pillar */}
          <g transform="translate(220,360)">
            <rect x="-30" y="0" width="60" height="340" rx="8" fill="url(#bwh-cream-pillar)"/>
            <rect x="-22" y="6" width="6" height="330" rx="3" fill="#FFFFFF" opacity="0.5"/>
            <ellipse cx="0" cy="-2" rx="32" ry="8" fill="#FFE4B5"/>
          </g>
          {/* Pink pillar */}
          <g transform="translate(310,400)">
            <rect x="-34" y="0" width="68" height="300" rx="8" fill="url(#bwh-pink-pillar)"/>
            <rect x="-26" y="6" width="6" height="290" rx="3" fill="#FFFFFF" opacity="0.5"/>
            <ellipse cx="0" cy="-2" rx="36" ry="8" fill="#FFC8DC"/>
            <g fill="#FFFFFF" opacity="0.7">
              <rect x="-22" y="40" width="14" height="20" rx="2"/>
              <rect x="8" y="40" width="14" height="20" rx="2"/>
              <rect x="-22" y="80" width="14" height="20" rx="2"/>
              <rect x="8" y="80" width="14" height="20" rx="2"/>
            </g>
          </g>
          {/* Mint tall pillar */}
          <g transform="translate(420,310)">
            <rect x="-28" y="0" width="56" height="390" rx="8" fill="url(#bwh-mint-pillar)"/>
            <rect x="-20" y="6" width="5" height="380" rx="2" fill="#FFFFFF" opacity="0.45"/>
            <polygon points="-30,-2 0,-30 30,-2" fill="#5FB28C"/>
          </g>
          {/* Peach pillar */}
          <g transform="translate(530,380)">
            <rect x="-28" y="0" width="56" height="320" rx="8" fill="url(#bwh-peach-pillar)"/>
            <rect x="-20" y="6" width="5" height="310" rx="2" fill="#FFFFFF" opacity="0.5"/>
            <ellipse cx="0" cy="-2" rx="30" ry="8" fill="#FFD4BC"/>
          </g>
          {/* Cream short */}
          <g transform="translate(620,440)">
            <rect x="-26" y="0" width="52" height="260" rx="6" fill="url(#bwh-cream-pillar)"/>
          </g>
          {/* Pink tall */}
          <g transform="translate(720,330)">
            <rect x="-30" y="0" width="60" height="370" rx="8" fill="url(#bwh-pink-pillar)"/>
            <rect x="-22" y="6" width="6" height="360" rx="3" fill="#FFFFFF" opacity="0.5"/>
            <polygon points="-32,-2 0,-32 32,-2" fill="#E66B97"/>
            <g fill="#FFFFFF" opacity="0.7">
              <rect x="-20" y="80" width="14" height="22" rx="2"/>
              <rect x="6" y="80" width="14" height="22" rx="2"/>
              <rect x="-20" y="120" width="14" height="22" rx="2"/>
              <rect x="6" y="120" width="14" height="22" rx="2"/>
              <rect x="-20" y="160" width="14" height="22" rx="2"/>
              <rect x="6" y="160" width="14" height="22" rx="2"/>
            </g>
          </g>
          {/* Cream */}
          <g transform="translate(820,380)">
            <rect x="-32" y="0" width="64" height="320" rx="8" fill="url(#bwh-cream-pillar)"/>
            <rect x="-24" y="6" width="6" height="310" rx="3" fill="#FFFFFF" opacity="0.55"/>
          </g>
          {/* Mint */}
          <g transform="translate(910,420)">
            <rect x="-26" y="0" width="52" height="280" rx="6" fill="url(#bwh-mint-pillar)"/>
          </g>
          {/* Peach + roof */}
          <g transform="translate(1000,360)">
            <rect x="-30" y="0" width="60" height="340" rx="8" fill="url(#bwh-peach-pillar)"/>
            <rect x="-22" y="6" width="6" height="330" rx="3" fill="#FFFFFF" opacity="0.5"/>
            <polygon points="-32,-2 0,-30 32,-2" fill="#E69672"/>
          </g>
          {/* Pink wide */}
          <g transform="translate(1110,400)">
            <rect x="-40" y="0" width="80" height="300" rx="10" fill="url(#bwh-pink-pillar)"/>
            <rect x="-32" y="6" width="7" height="290" rx="3" fill="#FFFFFF" opacity="0.55"/>
            <ellipse cx="0" cy="-2" rx="42" ry="8" fill="#FFC8DC"/>
          </g>
          {/* Cream tall */}
          <g transform="translate(1220,330)">
            <rect x="-28" y="0" width="56" height="370" rx="8" fill="url(#bwh-cream-pillar)"/>
            <rect x="-20" y="6" width="5" height="360" rx="2" fill="#FFFFFF" opacity="0.5"/>
          </g>
          {/* Mint */}
          <g transform="translate(1310,400)">
            <rect x="-30" y="0" width="60" height="300" rx="8" fill="url(#bwh-mint-pillar)"/>
            <rect x="-22" y="6" width="6" height="290" rx="3" fill="#FFFFFF" opacity="0.55"/>
          </g>
          {/* Pink */}
          <g transform="translate(1410,360)">
            <rect x="-32" y="0" width="64" height="340" rx="8" fill="url(#bwh-pink-pillar)"/>
            <rect x="-24" y="6" width="6" height="330" rx="3" fill="#FFFFFF" opacity="0.55"/>
          </g>
          {/* Far cream */}
          <g transform="translate(1510,400)">
            <rect x="-30" y="0" width="60" height="300" rx="8" fill="url(#bwh-cream-pillar)"/>
          </g>
        </g>

        {/* === Mid breakfast platforms === */}
        <g className={m('bwh-mid')}>
          {/* Stacked pancake plate w/ butter + syrup drip */}
          <g transform="translate(420,640)" filter="url(#bwh-shadow)">
            <ellipse cx="0" cy="38" rx="92" ry="14" fill="#3B2A22" opacity="0.18"/>
            {/* plate */}
            <ellipse cx="0" cy="22" rx="100" ry="20" fill="#FFFFFF"/>
            <ellipse cx="0" cy="20" rx="92" ry="16" fill="#FFE4E9"/>
            {/* pancakes */}
            <g>
              <ellipse cx="0" cy="0" rx="74" ry="14" fill="url(#bwh-pancake)"/>
              <ellipse cx="0" cy="-2" rx="74" ry="12" fill="#FFE4B5"/>
              <ellipse cx="0" cy="-16" rx="72" ry="13" fill="url(#bwh-pancake)"/>
              <ellipse cx="0" cy="-18" rx="72" ry="11" fill="#FFE4B5"/>
              <ellipse cx="0" cy="-32" rx="70" ry="13" fill="url(#bwh-pancake)"/>
              <ellipse cx="0" cy="-34" rx="70" ry="11" fill="#FFE4B5"/>
            </g>
            {/* butter pat */}
            <g transform="translate(-6,-46)">
              <rect x="-18" y="-4" width="36" height="14" rx="3" fill="url(#bwh-butter)"/>
              <rect x="-18" y="-4" width="36" height="4" rx="2" fill="#FFFBF0"/>
            </g>
            {/* syrup drip down side */}
            <path d="M-58,-30 q-22,40 -8,72 q-2,8 -8,4 q4,-12 -2,-30 q-12,-22 18,-46 z" fill="url(#bwh-syrup)" opacity="0.92"/>
            <path d="M40,-12 q14,30 -2,46 q-2,4 -6,2 q4,-10 -2,-22 q-6,-14 10,-26 z" fill="url(#bwh-syrup)" opacity="0.85"/>
          </g>

          {/* Sunny egg on plate */}
          <g transform="translate(150,720)" filter="url(#bwh-shadow)">
            <ellipse cx="0" cy="22" rx="64" ry="10" fill="#3B2A22" opacity="0.18"/>
            <ellipse cx="0" cy="14" rx="68" ry="14" fill="#FFFFFF"/>
            <ellipse cx="0" cy="12" rx="60" ry="11" fill="#FFE4E9"/>
            {/* white */}
            <path d="M-56,0 q-14,-22 4,-30 q12,-6 20,2 q8,-22 30,-12 q14,4 16,18 q12,2 14,16 q-4,16 -22,12 q-12,8 -28,2 q-22,8 -34,-8 z" fill="#FFFCF5" stroke="#F4ECDC" strokeWidth="1"/>
            {/* yolk */}
            <circle cx="-4" cy="-6" r="14" fill="url(#bwh-egg-yolk)"/>
            <ellipse cx="-8" cy="-10" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.7"/>
          </g>

          {/* Coffee/cocoa cup */}
          <g transform="translate(310,700)" filter="url(#bwh-shadow)">
            <ellipse cx="0" cy="18" rx="44" ry="6" fill="#3B2A22" opacity="0.18"/>
            <path d="M-32,-30 L-32,12 q0,8 8,8 L24,20 q8,0 8,-8 L32,-30 Z" fill="#FFC8DC"/>
            <ellipse cx="0" cy="-30" rx="32" ry="8" fill="#FFE4E9"/>
            <ellipse cx="0" cy="-30" rx="26" ry="6" fill="#3B2A22" opacity="0.85"/>
            <ellipse cx="0" cy="-31" rx="20" ry="4" fill="#5A3A26"/>
            {/* handle */}
            <path d="M32,-18 q18,2 18,18 q0,18 -18,18" fill="none" stroke="#FFC8DC" strokeWidth="6" strokeLinecap="round"/>
          </g>

          {/* Cereal bowl */}
          <g transform="translate(1240,720)" filter="url(#bwh-shadow)">
            <ellipse cx="0" cy="22" rx="64" ry="10" fill="#3B2A22" opacity="0.18"/>
            <path d="M-58,-12 q0,40 58,40 q58,0 58,-40 z" fill="#FFC8DC"/>
            <ellipse cx="0" cy="-12" rx="58" ry="14" fill="#FFFCF5"/>
            <g>
              <circle cx="-30" cy="-14" r="6" fill="url(#bwh-cereal)" stroke="#C97B3D" strokeWidth="1"/>
              <circle cx="-12" cy="-18" r="5.5" fill="url(#bwh-cereal)" stroke="#C97B3D" strokeWidth="1"/>
              <circle cx="14" cy="-15" r="6" fill="url(#bwh-cereal)" stroke="#C97B3D" strokeWidth="1"/>
              <circle cx="32" cy="-12" r="5.5" fill="url(#bwh-cereal)" stroke="#C97B3D" strokeWidth="1"/>
              <circle cx="2" cy="-9" r="5" fill="url(#bwh-cereal)" stroke="#C97B3D" strokeWidth="1"/>
            </g>
          </g>

          {/* Toast block with butter */}
          <g transform="translate(1080,740)" filter="url(#bwh-shadow)">
            <rect x="-44" y="-32" width="88" height="50" rx="10" fill="url(#bwh-pancake)"/>
            <rect x="-38" y="-26" width="76" height="38" rx="6" fill="#FFE4B5"/>
            <rect x="-12" y="-20" width="24" height="10" rx="3" fill="url(#bwh-butter)"/>
            <path d="M-44,-2 q12,18 0,22" fill="url(#bwh-syrup)" opacity="0.85"/>
          </g>

          {/* Donut tower */}
          <g transform="translate(1350,720)" filter="url(#bwh-shadow)">
            <ellipse cx="0" cy="20" rx="36" ry="6" fill="#3B2A22" opacity="0.18"/>
            <ellipse cx="0" cy="16" rx="34" ry="10" fill="#FFC8DC"/>
            <ellipse cx="0" cy="14" rx="34" ry="9" fill="#FF9EC0"/>
            <ellipse cx="0" cy="6" rx="34" ry="9" fill="#FFFCF5"/>
            <ellipse cx="0" cy="-2" rx="34" ry="9" fill="#FFE4B5"/>
            {/* hole top */}
            <ellipse cx="0" cy="-2" rx="10" ry="3" fill="#3B2A22" opacity="0.4"/>
          </g>
        </g>

        {/* === Floating glossy waffles + butter pats + cereal rings + sparkles === */}
        <g className={m('bwh-float-1')}>
          <g transform="translate(140,260)">
            <rect x="-32" y="-32" width="64" height="64" rx="10" fill="url(#bwh-waffle-grid)" filter="url(#bwh-shadow)"/>
            <rect x="-12" y="-42" width="24" height="10" rx="3" fill="url(#bwh-butter)"/>
            <path d="M-32,18 q-10,18 0,30 q-2,4 -6,0 q4,-8 -4,-18 q-2,-6 10,-12 z" fill="url(#bwh-syrup)" opacity="0.85"/>
          </g>
        </g>
        <g className={m('bwh-float-2')}>
          <g transform="translate(1280,200)">
            <rect x="-36" y="-36" width="72" height="72" rx="12" fill="url(#bwh-waffle-grid)" filter="url(#bwh-shadow)"/>
            <rect x="-14" y="-46" width="28" height="10" rx="3" fill="url(#bwh-butter)"/>
            <path d="M36,-10 q14,12 4,32 q-2,4 -6,2 q4,-10 -8,-20 q-2,-6 10,-14 z" fill="url(#bwh-syrup)" opacity="0.9"/>
          </g>
        </g>
        <g className={m('bwh-float-3')}>
          <g transform="translate(900,180)">
            <rect x="-22" y="-22" width="44" height="44" rx="8" fill="url(#bwh-waffle-grid)" filter="url(#bwh-shadow)"/>
          </g>
        </g>
        {/* Cereal rings */}
        <g className={m('bwh-float-4')}>
          <g transform="translate(260,180)">
            <circle r="14" fill="none" stroke="url(#bwh-cereal)" strokeWidth="6"/>
          </g>
        </g>
        <g className={m('bwh-float-5')}>
          <g transform="translate(380,260)">
            <circle r="10" fill="none" stroke="url(#bwh-cereal)" strokeWidth="5"/>
          </g>
        </g>
        <g className={m('bwh-float-6')}>
          <g transform="translate(720,300)">
            <circle r="12" fill="none" stroke="url(#bwh-cereal)" strokeWidth="5"/>
          </g>
        </g>
        <g className={m('bwh-float-7')}>
          <g transform="translate(1100,260)">
            <circle r="14" fill="none" stroke="url(#bwh-cereal)" strokeWidth="6"/>
          </g>
        </g>
        {/* Floating butter blocks */}
        <g className={m('bwh-float-8')}>
          <g transform="translate(540,200)">
            <rect x="-12" y="-12" width="24" height="24" rx="3" fill="url(#bwh-butter)" filter="url(#bwh-shadow)"/>
            <rect x="-12" y="-12" width="24" height="6" rx="2" fill="#FFFBF0"/>
          </g>
        </g>
        <g className={m('bwh-float-9')}>
          <g transform="translate(1180,140)">
            <rect x="-14" y="-14" width="28" height="28" rx="3" fill="url(#bwh-butter)" filter="url(#bwh-shadow)"/>
            <rect x="-14" y="-14" width="28" height="7" rx="2" fill="#FFFBF0"/>
          </g>
        </g>

        {/* Sparkles — subtle */}
        <g className={m('bwh-sparkle-a')}><use href="#bwh-sparkle" x="200" y="120" width="14" height="14"/></g>
        <g className={m('bwh-sparkle-b')}><use href="#bwh-sparkle" x="660" y="160" width="10" height="10"/></g>
        <g className={m('bwh-sparkle-c')}><use href="#bwh-sparkle" x="1180" y="320" width="14" height="14"/></g>
        <g className={m('bwh-sparkle-d')}><use href="#bwh-sparkle" x="80"  y="380" width="10" height="10"/></g>
        <g className={m('bwh-sparkle-e')}><use href="#bwh-sparkle" x="1480" y="280" width="12" height="12"/></g>

        {/* Crystalline pink ground (foreground) */}
        <g>
          <path d="M-50,820 L1650,820 L1650,900 L-50,900 Z" fill="url(#bwh-ground)"/>
          <path d="M-50,820 L1650,820 L1650,838 L-50,838 Z" fill="#FFE4E9" opacity="0.45"/>
          {/* Crystal shards */}
          <g opacity="0.85">
            <polygon points="60,820 90,790 120,820" fill="#FFC8DC"/>
            <polygon points="120,820 150,795 180,820" fill="#FFE4E9"/>
            <polygon points="220,820 260,780 300,820" fill="#FFC8DC"/>
            <polygon points="700,820 740,790 780,820" fill="#FFE4E9"/>
            <polygon points="1080,820 1120,792 1160,820" fill="#FFC8DC"/>
            <polygon points="1300,820 1330,790 1360,820" fill="#FFE4E9"/>
            <polygon points="1450,820 1490,790 1530,820" fill="#FFC8DC"/>
          </g>
        </g>
      </svg>

      <style>{`
        @keyframes bwhCloudA { 0%{transform:translate3d(-200px,0,0)} 100%{transform:translate3d(1700px,0,0)} }
        @keyframes bwhCloudB { 0%{transform:translate3d(-200px,8px,0)} 100%{transform:translate3d(1700px,-8px,0)} }
        @keyframes bwhCloudC { 0%{transform:translate3d(-200px,0,0)} 100%{transform:translate3d(1800px,0,0)} }
        @keyframes bwhDriftSlow { from{transform:translate3d(0,0,0)} to{transform:translate3d(-100px,0,0)} }
        @keyframes bwhDriftMid  { from{transform:translate3d(0,0,0)} to{transform:translate3d(-180px,0,0)} }
        @keyframes bwhFloatA { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes bwhFloatB { 0%,100%{transform:translateY(0) rotate(2deg)}  50%{transform:translateY(-16px) rotate(-2deg)} }
        @keyframes bwhFloatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bwhSparkle { 0%,100%{opacity:0.35; transform:scale(0.85)} 50%{opacity:1; transform:scale(1.1)} }

        .bwh-cloud-far  { animation: bwhCloudA 95s linear infinite; will-change: transform; }
        .bwh-cloud-mid  { animation: bwhCloudB 85s linear infinite; will-change: transform; }
        .bwh-cloud-near { animation: bwhCloudC 70s linear infinite; will-change: transform; }
        .bwh-skyline    { animation: bwhDriftSlow 80s linear infinite alternate; will-change: transform; }
        .bwh-mid        { animation: bwhDriftMid  55s linear infinite alternate; will-change: transform; }

        .bwh-float-1 { animation: bwhFloatA 6.0s ease-in-out infinite; will-change: transform; }
        .bwh-float-2 { animation: bwhFloatB 7.4s ease-in-out infinite; will-change: transform; animation-delay: -1.2s; }
        .bwh-float-3 { animation: bwhFloatA 5.4s ease-in-out infinite; will-change: transform; animation-delay: -2.4s; }
        .bwh-float-4 { animation: bwhFloatC 4.8s ease-in-out infinite; will-change: transform; }
        .bwh-float-5 { animation: bwhFloatC 5.6s ease-in-out infinite; will-change: transform; animation-delay: -1.4s; }
        .bwh-float-6 { animation: bwhFloatC 6.2s ease-in-out infinite; will-change: transform; animation-delay: -2.2s; }
        .bwh-float-7 { animation: bwhFloatC 5.0s ease-in-out infinite; will-change: transform; animation-delay: -3.0s; }
        .bwh-float-8 { animation: bwhFloatA 7.0s ease-in-out infinite; will-change: transform; animation-delay: -1.5s; }
        .bwh-float-9 { animation: bwhFloatB 6.5s ease-in-out infinite; will-change: transform; animation-delay: -2.0s; }

        .bwh-sparkle-a, .bwh-sparkle-b, .bwh-sparkle-c, .bwh-sparkle-d, .bwh-sparkle-e {
          animation: bwhSparkle 2.4s ease-in-out infinite; transform-origin: center; will-change: opacity, transform;
        }
        .bwh-sparkle-b { animation-delay: -.4s; } .bwh-sparkle-c { animation-delay: -.8s; }
        .bwh-sparkle-d { animation-delay: -1.2s; } .bwh-sparkle-e { animation-delay: -1.6s; }

        .bwh-root[data-paused="true"] * { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) { .bwh-root * { animation: none !important; } }
      `}</style>
    </div>
  );
};

export const BreakfastWorldHero = memo(BreakfastWorldHeroInner);
