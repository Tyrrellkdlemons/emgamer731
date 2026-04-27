'use client';

/**
 * CatchTheLiveButton — the primary CTA on the home hero.
 *
 * Emphasis logic (per creator feedback "put emphasis on the catch the live
 * its giving button"):
 *   - Always pops harder than a normal button: bigger pill, gradient pink→
 *     red base, soft live-red glow ring, micro-bounce on the play triangle.
 *   - When EMM is actually LIVE, swap to the live-red base + add a hard
 *     pulsing aura, a "● LIVE" pip, and faster breathing animation.
 *   - When offline, the breathing is gentle and the play triangle nudges on
 *     hover so visitors notice it.
 *
 * The component reads `useLiveStatus()` so it auto-updates within ~60s of
 * the API flipping (no page refresh needed).
 *
 * Accessibility:
 *   - Uses `aria-live="polite"` on the LIVE pip so screen readers announce
 *     when EMM goes live.
 *   - Respects prefers-reduced-motion (animations stop, but visual emphasis
 *     stays via gradient + ring).
 */

import Link from 'next/link';
import { useLiveStatus } from './LiveStatusProvider';

export function CatchTheLiveButton() {
  const { summary } = useLiveStatus();
  const live = !!summary?.isLive;

  return (
    <Link
      href="/live"
      aria-label={live ? 'EMM is LIVE — catch the stream' : "Catch the live (it's giving)"}
      className={
        'cta-live group relative inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-4 text-base sm:text-lg font-bold transition-all duration-300 ease-morning ' +
        (live ? 'cta-live--on text-white' : 'cta-live--off text-cocoa')
      }
    >
      {/* Soft outer ring — always present, brighter when live. */}
      <span aria-hidden className="cta-live__ring" />

      {/* "▶" play triangle — micro-bounces on hover, slightly larger. */}
      <span aria-hidden className="cta-live__play inline-flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <span className="relative">
        {live ? 'EMM is LIVE — pull up' : "Catch the live (it's giving)"}
      </span>

      {/* "● LIVE" pip — only when actually live, with screen-reader announce. */}
      {live && (
        <span
          className="cta-live__pip relative inline-flex items-center gap-1 rounded-full bg-white/95 text-liveRed px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest shadow-soft"
          aria-live="polite"
        >
          <span className="cta-live__dot" /> Live
        </span>
      )}

      {/* Local component styles — kept colocated so the emphasis logic is
          easy to tune in one place. */}
      <style jsx>{`
        /* OFF state — pop colour, soft glow, gentle breathing */
        .cta-live--off {
          background: linear-gradient(120deg, #FFD89C 0%, #FF9EC0 55%, #FF7AB6 100%);
          box-shadow:
            0 0 0 4px rgba(255, 158, 192, 0.35),
            0 14px 32px rgba(255, 71, 87, 0.25);
          animation: ctaBreathe 4.6s ease-in-out infinite;
        }
        .cta-live--off:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 0 0 6px rgba(255, 158, 192, 0.45),
            0 22px 44px rgba(255, 71, 87, 0.32);
        }

        /* ON state — flame red, hard glow, fast breathing */
        .cta-live--on {
          background: linear-gradient(120deg, #FF4757 0%, #FF1F39 55%, #E5143A 100%);
          box-shadow:
            0 0 0 6px rgba(255, 71, 87, 0.55),
            0 18px 40px rgba(255, 71, 87, 0.55);
          animation: ctaPulse 1.6s ease-in-out infinite;
        }
        .cta-live--on:hover {
          transform: translateY(-2px) scale(1.03);
        }

        /* The decorative ring uses a separate element so we can scale it
           without affecting the button's hit area. */
        .cta-live__ring {
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          background: radial-gradient(closest-side, rgba(255, 71, 87, 0.18), transparent 70%);
          opacity: 0.85;
          pointer-events: none;
          animation: ctaRingPulse 2.6s ease-out infinite;
        }
        .cta-live--on .cta-live__ring {
          background: radial-gradient(closest-side, rgba(255, 71, 87, 0.55), transparent 65%);
          animation-duration: 1.4s;
        }

        /* Play triangle — small chip on the left */
        .cta-live__play {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: rgba(255, 252, 245, 0.95);
          color: #3B2A22;
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .group:hover .cta-live__play {
          transform: translateX(2px) scale(1.08);
        }
        .cta-live--on .cta-live__play {
          color: #E5143A;
          animation: ctaPlayBeat 1.4s ease-in-out infinite;
        }

        /* LIVE pip dot */
        .cta-live__dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #E5143A;
          box-shadow: 0 0 0 0 rgba(229, 20, 58, 0.6);
          animation: dotPulse 1.2s ease-out infinite;
        }

        @keyframes ctaBreathe {
          0%, 100% { transform: translateY(0)    scale(1); }
          50%      { transform: translateY(-1px) scale(1.012); }
        }
        @keyframes ctaPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255,71,87,0.55), 0 18px 40px rgba(255,71,87,0.55); }
          50%      { transform: scale(1.025); box-shadow: 0 0 0 12px rgba(255,71,87,0.25), 0 26px 56px rgba(255,71,87,0.62); }
        }
        @keyframes ctaRingPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.06); opacity: 1; }
        }
        @keyframes ctaPlayBeat {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.18); }
        }
        @keyframes dotPulse {
          0%   { box-shadow: 0 0 0 0 rgba(229,20,58,0.7); }
          70%  { box-shadow: 0 0 0 12px rgba(229,20,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(229,20,58,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-live--off, .cta-live--on, .cta-live__ring,
          .cta-live__play, .cta-live__dot { animation: none !important; }
        }
      `}</style>
    </Link>
  );
}
