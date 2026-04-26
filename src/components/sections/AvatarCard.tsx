'use client';

/**
 * AvatarCard — v1.2.0
 *
 * Detailed SVG portrait of EMM's actual Roblox avatar (per the user-provided reference):
 * - Soft glam face — heavy lashes, full lips, alert eyes
 * - Black cap with embroidered "M" badge
 * - Long wavy brown hair flowing past shoulders
 * - Sage green off-shoulder cardigan with white inner top showing
 * - Distressed light-blue jeans with multiple knee tears
 * - Brown/white chunky sneakers
 * - White shoulder bag with red zipper-pull and a hanging bear charm with red M heart
 *
 * If the user later drops a real avatar PNG into /public/images/avatars/uploads/avatar.png,
 * the component will use that instead and fall back to the SVG only if the image is missing.
 *
 * No dependencies on Roblox first-party characters/key art — this is original illustration.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const REAL_AVATAR_SRC = '/images/avatars/uploads/character.jpeg';

export function AvatarCard() {
  const reduce = useReducedMotion();
  const [imageOk, setImageOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: reduce ? 0 : -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[460px]"
    >
      {/* Glow halo */}
      <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-mint/40 via-berry/30 to-pancake/40 blur-2xl opacity-70" aria-hidden />

      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#FCE7F3] via-[#E2F0FF] to-[#FFF8EE] shadow-lifted ring-1 ring-creamShade">
        {/* If a real avatar image has been dropped in, use it. Otherwise the SVG below renders. */}
        {imageOk && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={REAL_AVATAR_SRC}
            alt="EMM's Roblox avatar — black cap, sage cardigan, distressed jeans, white bag with bear charm"
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={() => setImageOk(false)}
            loading="eager"
            decoding="async"
          />
        )}

        {/* Hand-drawn SVG fallback / default — closely matches user's avatar reference */}
        {!imageOk && <AvatarSVG />}

        {/* Pills */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-cocoa text-eggshell px-3 py-1 text-xs font-bold shadow-soft">
          <span aria-hidden>🧢</span>
          <span className="font-mono tracking-tight">EMG731</span>
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-cream/90 backdrop-blur text-cocoa px-3 py-1 text-xs font-semibold ring-1 ring-creamShade">
          <span aria-hidden>✨</span>
          eatsswithemm
        </div>
      </div>

      {/* Floating mini-cards */}
      {!reduce && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -left-3 top-8 glass-card px-3 py-2 text-xs font-semibold flex items-center gap-2"
          >
            🧇 fan-fave
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -right-3 bottom-12 glass-card px-3 py-2 text-xs font-semibold flex items-center gap-2"
          >
            ⭐ squad icon
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function AvatarSVG() {
  return (
    <svg viewBox="0 0 460 575" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        {/* Soft pastel gradient backdrop */}
        <linearGradient id="av-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FCE7F3"/>
          <stop offset="50%" stopColor="#E2F0FF"/>
          <stop offset="100%" stopColor="#FFF8EE"/>
        </linearGradient>
        {/* Skin */}
        <linearGradient id="av-skin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F8DAB8"/>
          <stop offset="100%" stopColor="#EDC097"/>
        </linearGradient>
        {/* Hair */}
        <linearGradient id="av-hair" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5A3A26"/>
          <stop offset="100%" stopColor="#3B2418"/>
        </linearGradient>
        {/* Cardigan */}
        <linearGradient id="av-cardigan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#C7E9C0"/>
          <stop offset="100%" stopColor="#7FCFAB"/>
        </linearGradient>
        {/* Jeans */}
        <linearGradient id="av-jeans" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A8CFEB"/>
          <stop offset="100%" stopColor="#7AA8C9"/>
        </linearGradient>
        {/* Cap */}
        <linearGradient id="av-cap" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2A1E18"/>
          <stop offset="100%" stopColor="#0F0905"/>
        </linearGradient>
      </defs>

      <rect width="460" height="575" fill="url(#av-bg)"/>

      {/* Soft floor shadow */}
      <ellipse cx="230" cy="555" rx="120" ry="14" fill="#3B2A22" opacity="0.20"/>

      {/* === HAIR (back) === */}
      <path d="M150,170 Q140,120 200,100 Q230,90 260,100 Q320,120 320,170 L325,300 Q320,360 305,400 Q300,420 290,400 L290,260 L260,250 L260,310 Q255,330 245,310 L245,250 L215,250 L215,310 Q210,330 200,310 L200,260 L170,260 L170,400 Q160,420 155,400 Q140,360 145,300 Z"
            fill="url(#av-hair)"/>

      {/* === BODY === */}
      {/* Inner white top */}
      <rect x="180" y="240" width="100" height="120" rx="14" fill="#FFFCF5"/>
      {/* Sage cardigan — open / off-shoulder */}
      <path d="M150,260 Q150,240 180,235 L200,250 L260,250 L280,235 Q310,240 310,260 L320,360 L300,372 L290,260 L290,310 L170,310 L170,260 L160,372 L140,360 Z" fill="url(#av-cardigan)"/>
      {/* Cardigan ribbed band */}
      <g stroke="#5FB28C" strokeWidth="0.8" opacity="0.6">
        <line x1="150" y1="370" x2="310" y2="370"/>
        <line x1="150" y1="376" x2="310" y2="376"/>
      </g>
      {/* Cardigan strap line */}
      <path d="M200,250 Q200,232 220,232 L230,232 Q230,232 232,238 Q230,242 230,250" stroke="#FFFCF5" strokeWidth="3" fill="none" opacity="0.8"/>

      {/* Arms — sage cardigan sleeves */}
      <rect x="118" y="260" width="32" height="120" rx="14" fill="url(#av-cardigan)"/>
      <rect x="310" y="260" width="32" height="120" rx="14" fill="url(#av-cardigan)"/>
      {/* Hands */}
      <ellipse cx="134" cy="392" rx="14" ry="16" fill="url(#av-skin)"/>
      <ellipse cx="326" cy="392" rx="14" ry="16" fill="url(#av-skin)"/>

      {/* === LEGS — distressed jeans === */}
      <rect x="170" y="370" width="56" height="170" rx="10" fill="url(#av-jeans)"/>
      <rect x="234" y="370" width="56" height="170" rx="10" fill="url(#av-jeans)"/>
      {/* Distressed tears (white showing through) */}
      <g fill="#FFFCF5">
        <path d="M180,420 q12,-4 24,2 q-2,8 -10,9 q-8,1 -14,-6 z"/>
        <path d="M186,448 q14,-2 22,4 q-3,7 -10,8 q-8,0 -12,-8 z"/>
        <path d="M244,420 q14,-3 24,3 q-2,7 -10,9 q-8,0 -14,-7 z"/>
        <path d="M252,452 q14,-3 22,5 q-3,7 -11,7 q-7,-1 -11,-9 z"/>
      </g>
      {/* Tear stitching highlights */}
      <g stroke="#FFFCF5" strokeWidth="0.6" opacity="0.6">
        <path d="M180,420 q12,-4 24,2"/><path d="M186,448 q14,-2 22,4"/>
        <path d="M244,420 q14,-3 24,3"/><path d="M252,452 q14,-3 22,5"/>
      </g>

      {/* === SHOES — chunky brown/white sneakers === */}
      {/* Left shoe */}
      <g transform="translate(170,540)">
        <path d="M0,0 L60,0 L66,12 Q66,22 56,22 L-4,22 Q-10,22 -10,14 Z" fill="#FFFCF5"/>
        <path d="M-10,14 L66,14 L66,22 Q66,22 56,22 L-4,22 Q-10,22 -10,14 Z" fill="#5A3A26"/>
        <path d="M0,0 L40,0 L44,8 L4,8 Z" fill="#5A3A26"/>
        {/* laces */}
        <line x1="14" y1="6" x2="22" y2="2" stroke="#FFFCF5" strokeWidth="1.4"/>
        <line x1="22" y1="6" x2="14" y2="2" stroke="#FFFCF5" strokeWidth="1.4"/>
      </g>
      {/* Right shoe */}
      <g transform="translate(234,540)">
        <path d="M0,0 L60,0 L66,12 Q66,22 56,22 L-4,22 Q-10,22 -10,14 Z" fill="#FFFCF5"/>
        <path d="M-10,14 L66,14 L66,22 Q66,22 56,22 L-4,22 Q-10,22 -10,14 Z" fill="#5A3A26"/>
        <path d="M0,0 L40,0 L44,8 L4,8 Z" fill="#5A3A26"/>
        <line x1="14" y1="6" x2="22" y2="2" stroke="#FFFCF5" strokeWidth="1.4"/>
        <line x1="22" y1="6" x2="14" y2="2" stroke="#FFFCF5" strokeWidth="1.4"/>
      </g>

      {/* === HEAD === */}
      <ellipse cx="230" cy="180" rx="62" ry="76" fill="url(#av-skin)"/>

      {/* Hair (front bangs + side waves over face) */}
      <path d="M170,160 Q170,108 230,100 Q290,108 290,160 Q284,178 268,170 Q268,180 260,178 Q258,182 250,178 L250,160 L210,160 L210,178 Q202,182 200,178 Q192,180 192,170 Q176,178 170,160 Z"
            fill="url(#av-hair)"/>
      {/* Wavy long hair over shoulders, both sides */}
      <path d="M168,180 Q150,260 162,330 Q170,360 158,340 Q145,310 142,260 Q140,220 168,180 Z" fill="url(#av-hair)"/>
      <path d="M292,180 Q310,260 298,330 Q290,360 302,340 Q315,310 318,260 Q320,220 292,180 Z" fill="url(#av-hair)"/>

      {/* === CAP === */}
      {/* Crown */}
      <path d="M168,140 Q230,98 292,140 L292,170 L168,170 Z" fill="url(#av-cap)"/>
      {/* Brim */}
      <path d="M158,170 L302,170 L314,182 L146,182 Z" fill="url(#av-cap)"/>
      {/* Cap "M" badge — embroidered in white (small, centered above brim) */}
      <g transform="translate(230,150)" fill="#FFFCF5">
        <path d="M-10,4 L-10,-6 L-6,-6 L0,0 L6,-6 L10,-6 L10,4 L7,4 L7,-2 L1,4 L-1,4 L-7,-2 L-7,4 Z"/>
      </g>
      {/* Cap shine */}
      <path d="M180,128 Q220,108 260,124" stroke="#FFFFFF" strokeWidth="2" opacity="0.25" fill="none"/>

      {/* === FACE === */}
      {/* Cheek flush */}
      <ellipse cx="195" cy="200" rx="14" ry="7" fill="#FFB1A1" opacity="0.55"/>
      <ellipse cx="265" cy="200" rx="14" ry="7" fill="#FFB1A1" opacity="0.55"/>

      {/* Eyes — soft glam, alert */}
      <g>
        {/* Eye whites */}
        <ellipse cx="206" cy="186" rx="9" ry="6" fill="#FFFCF5"/>
        <ellipse cx="254" cy="186" rx="9" ry="6" fill="#FFFCF5"/>
        {/* Iris (light hazel/green) */}
        <circle cx="206" cy="187" r="5" fill="#9BC4A8"/>
        <circle cx="254" cy="187" r="5" fill="#9BC4A8"/>
        {/* Pupil */}
        <circle cx="206" cy="187" r="2.6" fill="#3B2A22"/>
        <circle cx="254" cy="187" r="2.6" fill="#3B2A22"/>
        {/* Highlight */}
        <circle cx="208" cy="185" r="0.9" fill="#FFFFFF"/>
        <circle cx="256" cy="185" r="0.9" fill="#FFFFFF"/>
        {/* Top lashes — heavy/dramatic */}
        <path d="M196,182 Q206,178 216,182" stroke="#1F1611" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M244,182 Q254,178 264,182" stroke="#1F1611" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Lash flicks */}
        <line x1="196" y1="182" x2="192" y2="178" stroke="#1F1611" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="216" y1="182" x2="220" y2="178" stroke="#1F1611" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="244" y1="182" x2="240" y2="178" stroke="#1F1611" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="264" y1="182" x2="268" y2="178" stroke="#1F1611" strokeWidth="1.2" strokeLinecap="round"/>
      </g>

      {/* Nose — subtle */}
      <path d="M228,202 Q230,210 232,202" stroke="#C99A78" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* Lips — full glossy berry */}
      <g>
        <path d="M218,220 Q230,216 242,220 Q236,228 230,228 Q224,228 218,220 Z" fill="#D55A77"/>
        <path d="M218,220 Q224,222 230,222 Q236,222 242,220 Q236,225 230,225 Q224,225 218,220 Z" fill="#FFFCF5" opacity="0.4"/>
      </g>

      {/* === BAG (right shoulder, hanging at hip with bear charm) === */}
      {/* Strap */}
      <path d="M300,250 Q336,260 348,338" stroke="#FFFCF5" strokeWidth="3.2" fill="none"/>
      {/* Bag body */}
      <g transform="translate(348,340)">
        <rect x="-22" y="0" width="44" height="34" rx="6" fill="#FFFCF5" stroke="#3B2A22" strokeWidth="1.5"/>
        {/* Top zipper */}
        <line x1="-22" y1="6" x2="22" y2="6" stroke="#3B2A22" strokeWidth="1"/>
        {/* Red zipper pull */}
        <circle cx="14" cy="6" r="2.4" fill="#E63946"/>
        <line x1="14" y1="8" x2="14" y2="14" stroke="#E63946" strokeWidth="1.4"/>
        {/* Bear charm hanging */}
        <line x1="0" y1="34" x2="0" y2="42" stroke="#E63946" strokeWidth="1.4"/>
        <g transform="translate(0,52)">
          {/* bear ears */}
          <circle cx="-7" cy="-7" r="3.5" fill="#FFFCF5" stroke="#3B2A22" strokeWidth="0.6"/>
          <circle cx="7"  cy="-7" r="3.5" fill="#FFFCF5" stroke="#3B2A22" strokeWidth="0.6"/>
          {/* head */}
          <circle cx="0" cy="0" r="9" fill="#FFFCF5" stroke="#3B2A22" strokeWidth="0.8"/>
          {/* eyes */}
          <circle cx="-3" cy="-1" r="1" fill="#3B2A22"/>
          <circle cx="3"  cy="-1" r="1" fill="#3B2A22"/>
          {/* body w/ red M sweater */}
          <rect x="-7" y="6" width="14" height="12" rx="3" fill="#E63946"/>
          <text x="0" y="16" fontSize="7" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle" fill="#FFFCF5">M</text>
          {/* arms */}
          <rect x="-11" y="7" width="4" height="9" rx="2" fill="#FFFCF5"/>
          <rect x="7"   y="7" width="4" height="9" rx="2" fill="#FFFCF5"/>
        </g>
      </g>
    </svg>
  );
}
