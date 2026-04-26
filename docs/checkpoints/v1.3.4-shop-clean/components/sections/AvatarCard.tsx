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
        <line x1="150" y1="376" x2=