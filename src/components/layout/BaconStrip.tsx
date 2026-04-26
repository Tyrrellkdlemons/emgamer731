'use client';

/**
 * BaconStrip — SVG-rendered crispy bacon used as the outer skin of the
 * floating nav (and reusable as a decorative motif elsewhere).
 *
 * The bacon is built from layered paths so it actually looks like fried
 * bacon: a dark cured-edge under-layer, a streaky meat layer (deep red
 * with curl shadow), and three undulating fat marbling ribbons that wave
 * gently. The whole thing has slightly pinched ends ("crispy curl"). On
 * top, an animated golden syrup drizzle drips downward and pools at the
 * lower-left corner, then a slow shine pass sweeps left-to-right to
 * suggest glistening glaze.
 *
 * All the motion is pure CSS keyframes (GPU-composited, no JS per frame)
 * and pauses for prefers-reduced-motion.
 *
 * Usage:
 *   <BaconStrip className="absolute inset-0" />
 * The component fills its parent — clipping with `border-radius: 9999px`
 * on the parent gives the capsule-shaped bacon nav look.
 */

type Props = {
  className?: string;
  /** Disable the syrup + shine animations (e.g. inside a static thumbnail). */
  static?: boolean;
};

export function BaconStrip({ className, static: isStatic }: Props) {
  return (
    <div className={'bacon-strip relative w-full h-full overflow-hidden ' + (className ?? '')} aria-hidden>
      {/* SVG bacon canvas — viewBox is wide so it stretches across any width. */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Meat gradient — three reds for depth */}
          <linearGradient id="bacon-meat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor="#E66060" />
            <stop offset="0.55" stopColor="#C0364A" />
            <stop offset="1"   stopColor="#7E1F2C" />
          </linearGradient>
          {/* Fat marbling — cream with subtle warm tint */}
          <linearGradient id="bacon-fat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor="#FFF1DD" />
            <stop offset="0.5" stopColor="#F5DEB7" />
            <stop offset="1"   stopColor="#E2BE93" />
          </linearGradient>
          {/* Syrup gradient — translucent honey amber */}
          <linearGradient id="bacon-syrup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0"   stopColor="#FBC65A" stopOpacity="0.95" />
            <stop offset="1"   stopColor="#A66B1B" stopOpacity="0.95" />
          </linearGradient>
          {/* Shine sweep gradient */}
          <linearGradient id="bacon-shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"    stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="1"    stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          {/* Soft inner shadow filter — gives the meat a slight curl */}
          <filter id="bacon-shadow" x="-2%" y="-10%" width="104%" height="120%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Cured edge underlayer — the dark crispy rim peeking out around
            the meat. Slightly bigger than the meat so a 2-3px halo shows. */}
        <path
          d="M 0,30 C 200,8 400,52 600,30 C 800,8 1000,52 1200,30 L 1200,90 C 1000,112 800,68 600,90 C 400,112 200,68 0,90 Z"
          fill="#4A1414"
          opacity="0.95"
        />

        {/* Main meat ribbon — slightly inset */}
        <path
          d="M 0,38 C 200,18 400,58 600,38 C 800,18 1000,58 1200,38 L 1200,82 C 1000,102 800,62 600,82 C 400,102 200,62 0,82 Z"
          fill="url(#bacon-meat)"
        />

        {/* Fat marbling ribbon 1 — top wave (animated) */}
        <path
          className="bacon-marble bacon-marble--1"
          d="M 0,46 C 200,28 400,62 600,46 C 800,28 1000,62 1200,46 L 1200,54 C 1000,72 800,38 600,54 C 400,72 200,38 0,54 Z"
          fill="url(#bacon-fat)"
        />
        {/* Fat marbling ribbon 2 — middle */}
        <path
          className="bacon-marble bacon-marble--2"
          d="M 0,62 C 200,46 400,78 600,62 C 800,46 1000,78 1200,62 L 1200,66 C 1000,82 800,50 600,66 C 400,82 200,50 0,66 Z"
          fill="url(#bacon-fat)"
          opacity="0.85"
        />
        {/* Fat marbling ribbon 3 — bottom thinner */}
        <path
          className="bacon-marble bacon-marble--3"
          d="M 0,72 C 200,58 400,86 600,72 C 800,58 1000,86 1200,72 L 1200,76 C 1000,90 800,60 600,76 C 400,90 200,60 0,76 Z"
          fill="url(#bacon-fat)"
          opacity="0.75"
        />

        {/* Crispy speckle dots — subtle texture */}
        <g fill="#5C1F26" opacity="0.45">
          <circle cx="80"   cy="42" r="1.6" />
          <circle cx="220"  cy="76" r="1.2" />
          <circle cx="380"  cy="48" r="1.8" />
          <circle cx="540"  cy="70" r="1.3" />
          <circle cx="700"  cy="44" r="1.6" />
          <circle cx="860"  cy="74" r="1.4" />
          <circle cx="1020" cy="50" r="1.7" />
          <circle cx="1140" cy="68" r="1.3" />
        </g>

        {/* Syrup drizzle — three drips at staggered positions, animated
            falling with translateY + opacity. */}
        {!isStatic && (
          <>
            <g className="bacon-drip bacon-drip--1">
              <path
                d="M 220,14 C 218,28 224,40 222,52 C 220,62 226,72 222,82"
                stroke="url(#bacon-syrup)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="222" cy="86" r="6" fill="#FBC65A" opacity="0.9" />
            </g>
            <g className="bacon-drip bacon-drip--2">
              <path
                d="M 600,8 C 598,22 604,36 602,50 C 600,64 606,76 604,86"
                stroke="url(#bacon-syrup)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="604" cy="92" r="7" fill="#A66B1B" opacity="0.9" />
            </g>
            <g className="bacon-drip bacon-drip--3">
              <path
                d="M 980,18 C 978,32 984,44 982,56 C 980,66 986,76 984,84"
                stroke="url(#bacon-syrup)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="984" cy="88" r="5" fill="#FBC65A" opacity="0.9" />
            </g>

            {/* Shine sweep — moves left to right slowly */}
            <rect
              className="bacon-shine"
              x="-200"
              y="0"
              width="400"
              height="120"
              fill="url(#bacon-shine)"
              transform="skewX(-12)"
            />
          </>
        )}
      </svg>

      {/* Local styles — colocated so the animation is easy to tune. */}
      <style jsx>{`
        .bacon-marble {
          transform-origin: 50% 50%;
          animation: marbleWobble 6s ease-in-out infinite;
        }
        .bacon-marble--2 { animation-duration: 7.5s; animation-delay: -1.5s; }
        .bacon-marble--3 { animation-duration: 9s;   animation-delay: -3s; }

        .bacon-drip {
          transform-origin: top;
          animation: dripDown 3.6s cubic-bezier(0.55, 0.06, 0.68, 0.19) infinite;
          opacity: 0;
        }
        .bacon-drip--2 { animation-duration: 4.4s; animation-delay: 0.9s; }
        .bacon-drip--3 { animation-duration: 3.2s; animation-delay: 1.7s; }

        .bacon-shine {
          animation: shineSweep 7s linear infinite;
        }

        @keyframes marbleWobble {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(0.8px); }
        }
        @keyframes dripDown {
          0%   { transform: translateY(-4px); opacity: 0; }
          15%  { opacity: 0.95; }
          85%  { opacity: 0.95; }
          100% { transform: translateY(8px);  opacity: 0; }
        }
        @keyframes shineSweep {
          0%   { transform: translateX(-200px) skewX(-12deg); }
          100% { transform: translateX(1500px) skewX(-12deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bacon-marble, .bacon-drip, .bacon-shine { animation: none !important; }
          .bacon-drip { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
