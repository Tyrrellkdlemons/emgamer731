'use client';

/**
 * OtherPagesBackground — fixed-position decorative background applied to every
 * page EXCEPT the home page (home keeps the breakfast-world banner photo).
 *
 * Layers (back → front):
 *   1. The "other pages bg.png" photo, served as a `<picture>` with WebP +
 *      JPG fallback for ~10× smaller payload than the source PNG.
 *   2. A soft cream wash to keep foreground text legible regardless of which
 *      part of the photo is showing through.
 *   3. A field of FLOATING BREAKFAST ITEMS — emoji "sprites" gently drifting
 *      across the viewport using CSS keyframe transforms. Why CSS instead of
 *      framer-motion: zero JS per frame, GPU-composited, no React re-renders.
 *      We respect prefers-reduced-motion (the `@media` rule below pauses
 *      every animation).
 *
 * Performance:
 *   - `position: fixed` so it doesn't trigger reflow on scroll.
 *   - Background image is `loading="eager"` only because it's the first paint
 *     on every non-home navigation; otherwise `decoding="async"`.
 *   - Floating sprites use `transform` + `opacity` only — both compositor-
 *     accelerated; no layout thrash.
 *   - `pointer-events: none` so the entire background never intercepts clicks.
 *   - `aria-hidden` so screen readers skip the entire decorative layer.
 *
 * Usage: rendered once at the layout level, conditionally — see
 * `BackgroundProvider.tsx` for the home/non-home split logic.
 */

import { useMemo } from 'react';

type FloatItem = {
  emoji: string;
  /** Approx left position 0–100 (% of viewport width). */
  x: number;
  /** Approx top position 0–100 (% of viewport height). */
  y: number;
  /** Font size in rem. */
  size: number;
  /** Animation duration in seconds — the bigger, the slower. */
  duration: number;
  /** Stagger delay in seconds. */
  delay: number;
  /** Drift direction in degrees (0 = right, 90 = down). */
  driftDeg: number;
  /** Opacity 0.05 – 0.35 — kept low so it's decorative, not loud. */
  opacity: number;
  /** Rotate this much over the cycle, in degrees. */
  rotate: number;
};

const ITEMS: FloatItem[] = [
  { emoji: '🥞', x:  6, y: 12, size: 2.4, duration: 26, delay:  0,  driftDeg:  20, opacity: 0.22, rotate:  18 },
  { emoji: '🧇', x: 22, y: 78, size: 2.0, duration: 32, delay:  3,  driftDeg: 200, opacity: 0.18, rotate: -22 },
  { emoji: '🍳', x: 88, y:  8, size: 2.6, duration: 30, delay:  1,  driftDeg: 240, opacity: 0.20, rotate:  14 },
  { emoji: '🥐', x: 72, y: 36, size: 2.2, duration: 28, delay:  5,  driftDeg:  60, opacity: 0.15, rotate: -30 },
  { emoji: '🍞', x: 34, y: 28, size: 1.8, duration: 36, delay:  2,  driftDeg: 160, opacity: 0.12, rotate:  10 },
  { emoji: '🥯', x: 58, y: 88, size: 2.0, duration: 34, delay:  6,  driftDeg: 320, opacity: 0.16, rotate: -16 },
  { emoji: '🍓', x: 12, y: 50, size: 1.6, duration: 24, delay:  4,  driftDeg:  90, opacity: 0.20, rotate:  24 },
  { emoji: '🥣', x: 92, y: 60, size: 2.4, duration: 38, delay:  7,  driftDeg: 180, opacity: 0.14, rotate: -12 },
  { emoji: '🍯', x: 46, y: 64, size: 1.7, duration: 30, delay:  8,  driftDeg: 110, opacity: 0.18, rotate:  20 },
  { emoji: '🧈', x: 78, y: 72, size: 1.5, duration: 26, delay:  3,  driftDeg: 280, opacity: 0.20, rotate: -18 },
  { emoji: '🍩', x: 18, y: 92, size: 2.2, duration: 40, delay:  9,  driftDeg:  40, opacity: 0.13, rotate:  28 },
  { emoji: '🍌', x: 62, y: 18, size: 1.8, duration: 30, delay:  4,  driftDeg: 220, opacity: 0.14, rotate: -24 },
  { emoji: '🥛', x: 50, y:  6, size: 2.0, duration: 28, delay: 10,  driftDeg: 150, opacity: 0.16, rotate:  12 },
  { emoji: '🫐', x:  4, y: 70, size: 1.4, duration: 22, delay:  2,  driftDeg:  70, opacity: 0.22, rotate: -10 },
  { emoji: '🍒', x: 86, y: 42, size: 1.4, duration: 24, delay:  6,  driftDeg: 300, opacity: 0.20, rotate:  18 },
  { emoji: '☕', x: 28, y:  4, size: 2.0, duration: 32, delay:  1,  driftDeg: 250, opacity: 0.15, rotate: -14 },
];

export function OtherPagesBackground() {
  // Build keyframes once on mount — each item gets its own keyframe set so
  // drift directions don't all sync up. Memoized so we don't regenerate on
  // every render.
  const keyframes = useMemo(() => {
    return ITEMS.map((it, i) => {
      // Convert drift angle to (dx, dy) offsets in vw/vh-equivalent rem.
      const rad = (it.driftDeg * Math.PI) / 180;
      const dist = 6; // rem per cycle — gentle, not chaotic
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist;
      return `
        @keyframes bgfloat-${i} {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%  { transform: translate3d(${dx.toFixed(2)}rem, ${dy.toFixed(2)}rem, 0) rotate(${it.rotate}deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }`;
    }).join('\n');
  }, []);

  return (
    <div
      aria-hidden
      className="opbg-root pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Background photo — WebP first, JPG fallback for older browsers */}
      <picture>
        <source srcSet="/images/bg/other-pages-bg.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg/other-pages-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
          loading="eager"
          // Tiny inline blur placeholder while the full image streams in
          style={{
            backgroundImage: 'url(/images/bg/other-pages-bg-tiny.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </picture>

      {/* Cream wash — keeps foreground content legible. Adjust opacity to
          taste; 0.65 is the sweet spot between "see the bg" and "read text". */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,252,245,0.75) 0%, rgba(255,252,245,0.55) 35%, rgba(255,252,245,0.65) 70%, rgba(255,252,245,0.85) 100%)',
        }}
      />

      {/* Floating breakfast items field */}
      <div className="absolute inset-0">
        {ITEMS.map((it, i) => (
          <span
            key={i}
            className="opbg-float absolute select-none"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              fontSize: `${it.size}rem`,
              opacity: it.opacity,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
              animation: `bgfloat-${i} ${it.duration}s ease-in-out ${it.delay}s infinite`,
              willChange: 'transform',
            }}
          >
            {it.emoji}
          </span>
        ))}
      </div>

      {/* Inject keyframes + reduced-motion guard */}
      <style>{`
        ${keyframes}
        @media (prefers-reduced-motion: reduce) {
          .opbg-float { animation: none !important; }
        }
        /* Pause when tab is hidden (visibility API doesn't pause CSS, but
           it does when the document is in the BFCache. This is a hint.) */
        .opbg-root[data-paused="true"] .opbg-float { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
