'use client';

/**
 * ButterToastFrame — decorative breakfast-themed wrapper for the live
 * video player. The video plays inside a stylized "buttered toast" frame
 * with caramel ridges, a melting butter pat in the corner, animated
 * syrup drips trickling off the bottom, and a few stray crumbs for
 * personality.
 *
 * Design notes:
 *   - The actual video is INSET inside a rectangular cutout in the toast.
 *     Padding values are tuned so a 9:16 TikTok stream fits naturally.
 *   - Pure CSS / SVG decorative layer — no extra image assets to load.
 *   - All animations respect prefers-reduced-motion.
 *   - The toast colour palette echoes the rest of the breakfast theme
 *     (caramel + butter yellow + dark syrup) so it doesn't clash.
 */

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Override the inner content padding if your video has its own frame. */
  padding?: number;
  className?: string;
};

export function ButterToastFrame({ children, padding = 22, className }: Props) {
  return (
    <div className={'btf-root relative ' + (className ?? '')}>
      <div
        className="btf-toast relative rounded-[28px]"
        style={{
          padding,
          background:
            'radial-gradient(120% 60% at 50% 0%, #F4D086 0%, #E8A53C 38%, #C97B3D 70%, #8E4F1A 100%)',
          boxShadow:
            'inset 0 -10px 22px rgba(91,44,15,0.40), inset 0 8px 16px rgba(255,236,194,0.55), 0 18px 36px rgba(91,44,15,0.30)',
          border: '2px solid #6B3A14',
        }}
      >
        {/* Toast crust speckle texture */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[28px] pointer-events-none opacity-50"
          style={{
            background:
              'repeating-radial-gradient(circle at 20% 30%, rgba(91,44,15,0.18) 0, rgba(91,44,15,0.18) 1.5px, transparent 1.5px, transparent 6px),' +
              'repeating-radial-gradient(circle at 70% 60%, rgba(91,44,15,0.12) 0, rgba(91,44,15,0.12) 1.2px, transparent 1.2px, transparent 7px)',
          }}
        />

        {/* Butter pat — top-left corner, slightly melting */}
        <div
          aria-hidden
          className="btf-butter absolute"
          style={{
            top: 6,
            left: 12,
            width: 56,
            height: 36,
            borderRadius: '10px 12px 16px 18px / 12px 10px 14px 18px',
            background: 'linear-gradient(160deg, #FFF5C2 0%, #FFE69A 40%, #F2C966 100%)',
            boxShadow: '0 4px 8px rgba(91,44,15,0.30), inset 0 -3px 4px rgba(180,130,50,0.40)',
            zIndex: 3,
            transform: 'rotate(-4deg)',
          }}
        />

        {/* Inner video cutout — child slot */}
        <div className="btf-inner relative rounded-[14px] overflow-hidden bg-cocoa shadow-soft">
          {children}
        </div>

        {/* Syrup drips — three positions, trickling off the bottom edge */}
        <span
          aria-hidden
          className="btf-syrup btf-syrup--1 absolute"
          style={{
            left: '24%', bottom: -18,
            width: 14, height: 26,
            borderRadius: '50% 50% 60% 60% / 30% 30% 90% 90%',
            background: 'linear-gradient(180deg, #C97B3D 0%, #7E3A0F 100%)',
          }}
        />
        <span
          aria-hidden
          className="btf-syrup btf-syrup--2 absolute"
          style={{
            left: '52%', bottom: -22,
            width: 18, height: 32,
            borderRadius: '50% 50% 60% 60% / 30% 30% 90% 90%',
            background: 'linear-gradient(180deg, #B86A2D 0%, #6F2E0A 100%)',
          }}
        />
        <span
          aria-hidden
          className="btf-syrup btf-syrup--3 absolute"
          style={{
            left: '78%', bottom: -16,
            width: 12, height: 22,
            borderRadius: '50% 50% 60% 60% / 30% 30% 90% 90%',
            background: 'linear-gradient(180deg, #C97B3D 0%, #7E3A0F 100%)',
          }}
        />

        {/* Crumbs — tiny dots scattered around */}
        {[
          { l: '5%',  t: '88%', s: 4 },
          { l: '92%', t: '8%',  s: 3 },
          { l: '95%', t: '85%', s: 5 },
          { l: '8%',  t: '12%', s: 3 },
          { l: '50%', t: '95%', s: 3 },
        ].map((c, i) => (
          <span
            key={i}
            aria-hidden
            className="btf-crumb absolute"
            style={{
              left: c.l, top: c.t,
              width: c.s, height: c.s,
              background: '#5B2C0F',
              borderRadius: '50%',
              boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .btf-butter {
          animation: btfButter 6s ease-in-out infinite;
        }
        .btf-syrup {
          opacity: 0.92;
          transform-origin: top center;
          animation: btfDrip 5s ease-in-out infinite;
        }
        .btf-syrup--2 { animation-delay: 1.4s; animation-duration: 6.4s; }
        .btf-syrup--3 { animation-delay: 2.8s; animation-duration: 4.6s; }
        @keyframes btfButter {
          0%, 100% { transform: rotate(-4deg) translateY(0); }
          50%      { transform: rotate(-2deg) translateY(2px); }
        }
        @keyframes btfDrip {
          0%   { transform: scaleY(0.85) translateY(0);  opacity: 0.4; }
          25%  { opacity: 0.95; }
          75%  { transform: scaleY(1.15) translateY(4px); opacity: 0.95; }
          100% { transform: scaleY(0.85) translateY(0);  opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .btf-butter, .btf-syrup { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
