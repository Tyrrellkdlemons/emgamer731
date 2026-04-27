'use client';

/**
 * RainOverlay — viewport-fixed decorative layer that drops breakfast emojis
 * AND stylized "67" tags from the top of the screen on every page. Adds a
 * playful theme touch without ever blocking interaction.
 *
 * Design constraints (per creator brief):
 *   - "Raining breakfast pieces and 67s" → mix of food emoji + the brand
 *     "67" wordmark.
 *   - "Cool animation touch" → smooth, varied speeds, slight rotation,
 *     fading at top + bottom so drops materialize / dissolve elegantly
 *     instead of teleporting at edges.
 *
 * Performance:
 *   - Pure CSS keyframe `translateY` per drop (compositor-only).
 *   - Drops live in a single fixed-position container with `pointer-events:
 *     none` and `aria-hidden`. No re-renders, no JS per frame.
 *   - Density auto-throttles on mobile and disables completely under
 *     prefers-reduced-motion.
 *   - Drops use `top: -10%` so they spawn above the viewport — no flash.
 *
 * Mounted from `BackgroundProvider` so it appears on EVERY route. Home and
 * inner routes both benefit; intensity tuned to "ambient" so it complements
 * (not competes with) the floating breakfast field on /about etc.
 */

import { useMemo } from 'react';

type Drop = {
  /** Either an emoji string or the literal "67" wordmark. */
  content: string;
  /** Is this a "67" tag (renders with display font + accent color). */
  isTag: boolean;
  /** Left position 0–100 (% of viewport). */
  left: number;
  /** Fall duration in seconds. */
  duration: number;
  /** Delay before first fall in seconds. Negative values offset start. */
  delay: number;
  /** Rotation amount over the cycle (deg). */
  rotate: number;
  /** Font size in rem. */
  size: number;
  /** Opacity 0–1. */
  opacity: number;
};

const EMOJIS = ['🥞', '🧇', '🍳', '🥓', '🥐', '🍞', '🥯', '🍓', '🥣', '🍯', '🧈', '🍩', '🌭', '☕', '🥛', '🫐', '🍒'];

/** Build a deterministic list of drops so SSR + hydration match. */
function buildDrops(count: number): Drop[] {
  const list: Drop[] = [];
  // Stable pseudo-random sequence (seeded) so server + client agree.
  let seed = 731;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 0x100000000;
    return seed / 0x100000000;
  };

  for (let i = 0; i < count; i++) {
    // Every ~6th drop is a "67" tag for brand personality.
    const isTag = i % 6 === 0;
    list.push({
      content: isTag ? '67' : EMOJIS[Math.floor(rand() * EMOJIS.length)],
      isTag,
      left: Math.round(rand() * 100),
      duration: 14 + rand() * 14,           // 14–28s
      delay: -rand() * 28,                  // negative offsets so we start mid-stream
      rotate: Math.round((rand() - 0.5) * 720), // -360..360 deg
      size: isTag ? 1.6 + rand() * 1.6 : 1.4 + rand() * 1.6, // 1.4–3.0rem (v1.6.3: bumped)
      opacity: 0.35 + rand() * 0.30,        // 0.35–0.65 (v1.6.3: more visible)
    });
  }
  return list;
}

type Props = {
  /** Number of drops on desktop. Mobile auto-cuts in half. Default 18. */
  density?: number;
};

export function RainOverlay({ density = 18 }: Props) {
  const drops = useMemo(() => buildDrops(density), [density]);
  const dropsMobile = useMemo(() => buildDrops(Math.max(6, Math.round(density / 2))), [density]);

  return (
    <div
      aria-hidden
      className="rain-root pointer-events-none fixed inset-0 -z-[1] overflow-hidden"
    >
      {/* Desktop / tablet density */}
      <div className="rain-desktop hidden sm:block absolute inset-0">
        {drops.map((d, i) => (
          <Bit key={'d' + i} d={d} idx={i} />
        ))}
      </div>
      {/* Mobile lighter density */}
      <div className="rain-mobile sm:hidden absolute inset-0">
        {dropsMobile.map((d, i) => (
          <Bit key={'m' + i} d={d} idx={i} />
        ))}
      </div>

      <style>{`
        .rain-bit {
          position: absolute;
          top: -10%;
          will-change: transform, opacity;
          user-select: none;
          /* Soft drop-shadow makes the floats pop on the bg image. */
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.18));
        }
        .rain-bit--tag {
          font-family: var(--font-display), ui-sans-serif, system-ui, sans-serif;
          font-weight: 800;
          color: #C97B3D;
          letter-spacing: -0.04em;
          text-shadow: 0 1px 0 rgba(255,252,245,0.85);
        }

        @keyframes rainFall {
          0%   { transform: translate3d(0, -10vh, 0) rotate(0deg);   opacity: 0; }
          8%   { opacity: var(--rain-op, 0.3); }
          92%  { opacity: var(--rain-op, 0.3); }
          100% { transform: translate3d(0, 115vh, 0) rotate(var(--rain-rot, 0deg)); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rain-bit { display: none !important; }
        }

        /* Save data: don't render any drops on metered networks */
        @media (prefers-reduced-data: reduce) {
          .rain-root { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Bit({ d, idx }: { d: Drop; idx: number }) {
  return (
    <span
      className={'rain-bit ' + (d.isTag ? 'rain-bit--tag' : '')}
      data-i={idx}
      style={{
        left: `${d.left}%`,
        fontSize: `${d.size}rem`,
        // Custom props the keyframe reads for opacity + rotate
        ['--rain-op' as string]: d.opacity,
        ['--rain-rot' as string]: `${d.rotate}deg`,
        animation: `rainFall ${d.duration}s linear ${d.delay}s infinite`,
      } as React.CSSProperties}
   