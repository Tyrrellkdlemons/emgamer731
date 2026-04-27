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

/**
 * v1.5.0 — many more items per creator request ("the theme to have many many
 * more of which are moving"). The field now has 32 sprites (up from 16),
 * better distributed across the viewport, with bacon, sausage, and waffle
 * sprite variety added. Densities per quadrant:
 *   - top-left (0–50% x, 0–50% y): 8
 *   - top-right (50–100% x, 0–50% y): 8
 *   - bottom-left (0–50% x, 50–100% y): 8
 *   - bottom-right (50–100% x, 50–100% y): 8
 */
const ITEMS: FloatItem[] = [
  // Top-left quadrant
  { emoji: '🥞', x:  6, y: 10, size: 2.4, duration: 26, delay:  0,  driftDeg:  20, opacity: 0.22, rotate:  18 },
  { emoji: '🥓', x: 18, y: 22, size: 2.2, duration: 30, delay:  2,  driftDeg: 110, opacity: 0.20, rotate: -16 },
  { emoji: '🍞', x: 34, y: 28, size: 1.8, duration: 36, delay:  3,  driftDeg: 160, opacity: 0.16, rotate:  10 },
  { emoji: '☕', x: 28, y:  4, size: 2.0, duration: 32, delay:  1,  driftDeg: 250, opacity: 0.18, rotate: -14 },
  { emoji: '🍓', x: 12, y: 38, size: 1.6, duration: 24, delay:  4,  driftDeg:  90, opacity: 0.22, rotate:  24 },
  { emoji: '🥯', x: 42, y: 14, size: 1.9, duration: 28, delay:  6,  driftDeg: 200, opacity: 0.16, rotate: -22 },
  { emoji: '🧈', x:  4, y: 22, size: 1.5, duration: 22, delay:  5,  driftDeg:  60, opacity: 0.18, rotate:  20 },
  { emoji: '🍯', x: 46, y: 42, size: 1.7, duration: 30, delay:  8,  driftDeg: 110, opacity: 0.18, rotate:  20 },

  // Top-right quadrant
  { emoji: '🍳', x: 88, y:  8, size: 2.6, duration: 30, delay:  1,  driftDeg: 240, opacity: 0.22, rotate:  14 },
  { emoji: '🧇', x: 64, y: 18, size: 2.0, duration: 32, delay:  3,  driftDeg: 200, opacity: 0.20, rotate: -22 },
  { emoji: '🥐', x: 76, y: 28, size: 2.2, duration: 28, delay:  5,  driftDeg:  60, opacity: 0.18, rotate: -30 },
  { emoji: '🥛', x: 52, y:  6, size: 1.9, duration: 28, delay: 10,  driftDeg: 150, opacity: 0.18, rotate:  12 },
  { emoji: '🍌', x: 60, y: 32, size: 1.8, duration: 30, delay:  4,  driftDeg: 220, opacity: 0.16, rotate: -24 },
  { emoji: '🫐', x: 96, y: 22, size: 1.4, duration: 22, delay:  2,  driftDeg:  70, opacity: 0.22, rotate: -10 },
  { emoji: '🥓', x: 82, y: 42, size: 2.0, duration: 26, delay:  7,  driftDeg: 300, opacity: 0.20, rotate:  20 },
  { emoji: '🌭', x: 70, y: 44, size: 1.8, duration: 34, delay:  9,  driftDeg: 130, opacity: 0.15, rotate: -18 },

  // Bottom-left quadrant
  { emoji: '🥣', x:  8, y: 60, size: 2.4, duration: 38, delay:  7,  driftDeg: 180, opacity: 0.18, rotate: -12 },
  { emoji: '🥞', x: 22, y: 78, size: 2.0, duration: 32, delay:  3,  driftDeg: 200, opacity: 0.18, rotate: -22 },
  { emoji: '🍩', x: 18, y: 92, size: 2.2, duration: 40, delay:  9,  driftDeg:  40, opacity: 0.16, rotate:  28 },
  { emoji: '🥯', x: 36, y: 88, size: 1.8, duration: 34, delay:  6,  driftDeg: 320, opacity: 0.16, rotate: -16 },
  { emoji: '🥓', x:  4, y: 70, size: 1.6, duration: 28, delay:  2,  driftDeg:  90, opacity: 0.20, rotate:  18 },
  { emoji: '🧇', x: 42, y: 64, size: 1.7, duration: 26, delay:  5,  driftDeg: 150, opacity: 0.18, rotate:  14 },
  { emoji: '🍓', x: 30, y: 96, size: 1.4, duration: 22, delay:  3,  driftDeg: 200, opacity: 0.22, rotate: -20 },
  { emoji: '🍳', x: 12, y: 86, size: 1.8, duration: 30, delay:  8,  driftDeg: 250, opacity: 0.18, rotate:  10 },

  // Bottom-right quadrant
  { emoji: '🥣', x: 92, y: 60, size: 2.0, duration: 38, delay:  7,  driftDeg: 180, opacity: 0.18, rotate: -12 },
  { emoji: '🍒', x: 86, y: 78, size: 1.4, duration: 24, delay:  6,  driftDeg: 300, opacity: 0.22, rotate:  18 },
  { emoji: '🍯', x: 58, y: 70, size: 1.7, duration: 30, delay:  8,  driftDeg: 110, opacity: 0.18, rotate:  20 },
  { emoji: '🧈', x: 78, y: 86, size: 1.5, duration: 26, delay:  3,  driftDeg: 280, opacity: 0.20, rotate: -18 },
  { emoji: '🥐', x: 70, y: 92, size: 2.0, duration: 34, delay: 10,  driftDeg:  40, opacity: 0.16, rotate:  24 },
  { emoji: '🌭', x: 96, y: 92, size: 1.8, duration: 36, delay:  4,  driftDeg: 160, opacity: 0.15, rotate: -22 },
  { emoji: '🥓', x: 64, y: 80, size: 2.2, duration: 30, delay:  2,  driftDeg: 220, opacity: 0.20, rotate:  16 },
  { emoji: '🍞', x: 88, y: 50, size: 1.7, duration: 28, delay: 11,  driftDeg:  10, opacity: 0.16, rotate: -10 },
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