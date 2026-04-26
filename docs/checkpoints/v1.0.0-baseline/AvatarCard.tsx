'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * SVG illustration of the avatar (sage cardigan + black cap + bear-charm purse + jeans).
 * Originally drawn — does not copy any first-party Roblox key art.
 */
export function AvatarCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: reduce ? 0 : -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[440px]"
    >
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-mood-mint shadow-lifted ring-1 ring-creamShade">
        {/* Backdrop */}
        <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" aria-hidden>
          <defs>
            <radialGradient id="bg" cx="50%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#FFFCF5"/>
              <stop offset="55%" stopColor="#A8E6CF"/>
              <stop offset="100%" stopColor="#BDE3FF"/>
            </radialGradient>
            <linearGradient id="cap" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2A1E18"/>
              <stop offset="100%" stopColor="#1F1611"/>
            </linearGradient>
            <linearGradient id="cardigan" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#C7E9C0"/>
              <stop offset="100%" stopColor="#A8E6CF"/>
            </linearGradient>
          </defs>

          <rect width="400" height="500" fill="url(#bg)"/>

          {/* clouds */}
          <g opacity="0.9">
            <ellipse cx="60"  cy="80"  rx="46" ry="14" fill="#FFFCF5"/>
            <ellipse cx="340" cy="100" rx="56" ry="16" fill="#FFFCF5"/>
            <ellipse cx="120" cy="430" rx="80" ry="20" fill="#FFFCF5" opacity="0.8"/>
          </g>

          {/* Avatar — stylized blocky-cute */}
          {/* Body (cardigan + tee) */}
          <rect x="130" y="240" width="140" height="140" rx="20" fill="url(#cardigan)"/>
          <rect x="170" y="260" width="60" height="100" rx="10" fill="#FFFCF5"/>

          {/* Jeans */}
          <rect x="135" y="370" width="60" height="100" rx="14" fill="#BDE3FF"/>
          <rect x="205" y="370" width="60" height="100" rx="14" fill="#BDE3FF"/>
          <line x1="155" y1="395" x2="170" y2="430" stroke="#7AB7E8" strokeWidth="2" opacity="0.7"/>
          <line x1="220" y1="400" x2="240" y2="440" stroke="#7AB7E8" strokeWidth="2" opacity="0.7"/>

          {/* Shoes */}
          <rect x="130" y="465" width="65" height="20" rx="8" fill="#3B2A22"/>
          <rect x="205" y="465" width="65" height="20" rx="8" fill="#3B2A22"/>
          <rect x="130" y="476" width="65" height="9" rx="4" fill="#FFFCF5"/>
          <rect x="205" y="476" width="65" height="9" rx="4" fill="#FFFCF5"/>

          {/* Head */}
          <rect x="155" y="120" width="90" height="120" rx="22" fill="#F4D7B4"/>

          {/* Hair (long wavy brown) */}
          <path d="M150,135 Q150,90 200,90 Q250,90 250,135 L250,260 Q230,300 220,260 L220,180 L180,180 L180,260 Q170,300 150,260 Z" fill="#5A3A26"/>
          {/* Front bangs */}
          <path d="M165,140 Q200,115 235,140 Q220,160 200,158 Q180,160 165,140 Z" fill="#5A3A26"/>

          {/* Cap */}
          <path d="M153,118 Q200,90 247,118 L247,140 L153,140 Z" fill="url(#cap)"/>
          <path d="M148,140 L252,140 L262,150 L138,150 Z" fill="url(#cap)"/>
          <circle cx="200" cy="118" r="5" fill="#FF9EC0"/>

          {/* Face */}
          <circle cx="180" cy="178" r="3" fill="#3B2A22"/>
          <circle cx="220" cy="178" r="3" fill="#3B2A22"/>
          <path d="M188,200 Q200,210 212,200" stroke="#3B2A22" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          <ellipse cx="172" cy="195" rx="6" ry="3" fill="#FFB1A1" opacity="0.55"/>
          <ellipse cx="228" cy="195" rx="6" ry="3" fill="#FFB1A1" opacity="0.55"/>

          {/* Bag (white purse + bear charm) */}
          <rect x="265" y="305" width="58" height="46" rx="10" fill="#FFFCF5" stroke="#3B2A22" strokeWidth="1.5"/>
          <path d="M275,305 Q280,290 295,290 Q310,290 315,305" stroke="#3B2A22" strokeWidth="1.8" fill="none"/>
          {/* bear charm */}
          <circle cx="320" cy="358" r="9" fill="#F4D7B4" stroke="#3B2A22" strokeWidth="1.2"/>
          <circle cx="316" cy="354" r="2" fill="#3B2A22"/>
          <circle cx="324" cy="354" r="2" fill="#3B2A22"/>
          <circle cx="320" cy="362" r="1.4" fill="#3B2A22"/>

          {/* Speech: tiny waffle */}
          <g transform="translate(80,260) rotate(-8)">
            <rect width="50" height="50" rx="8" fill="#FFD89C" stroke="#C97B3D" strokeWidth="1.6"/>
            <g stroke="#C97B3D" strokeWidth="1.4" opacity="0.8">
              <line x1="0" y1="16" x2="50" y2="16"/>
              <line x1="0" y1="34" x2="50" y2="34"/>
              <line x1="16" y1="0" x2="16" y2="50"/>
              <line x1="34" y1="0" x2="34" y2="50"/>
            </g>
          </g>
        </svg>

        {/* Cap label badge */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-cocoa text-eggshell px-3 py-1 text-xs font-semibold shadow-soft">
          <span aria-hidden>🧢</span> EMG731
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-cream/90 backdrop-blur text-cocoa px-3 py-1 text-xs font-semibold ring-1 ring-creamShade">
          Avatar drop · sage cardigan
        </div>
      </div>

      {/* floating mini-cards */}
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
