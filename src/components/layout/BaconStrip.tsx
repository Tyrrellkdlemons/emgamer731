'use client';

/**
 * BaconStrip — v4 (guaranteed-visible).
 *
 * Why v3 broke: I rendered the bacon photo as `<img objectFit="fill">`
 * which stretched the 1916×821 PNG into the nav's ~70px tall strip,
 * smearing the wavy bacon shape into a barely-visible smudge.
 *
 * v4 fix — two-layer skin that ALWAYS renders something visible:
 *
 *   Layer 1 (always visible) — SVG-painted bacon stripes via
 *     `repeating-linear-gradient`. Renders at any width/height. Uses the
 *     warm red-meat + cream-fat marbling palette. This is the v1.6.0
 *     approach that DID work — bringing it back as the always-on base.
 *
 *   Layer 2 (additive cover) — the photographic bacon-strip artwork
 *     painted as `background-image: cover`. On wide nav strips this
 *     shows the centre of the bacon photo cleanly. On narrow ones it
 *     crops naturally without smearing. If the image fails to load
 *     (network block, region restriction), Layer 1 still ships the
 *     bacon look.
 *
 *   Animated syrup drip beads stay (CSS keyframes only, GPU composited).
 *   Reduced-motion guarded.
 *
 * Skins: 'bacon' (red), 'french-toast' (caramel), 'waffle' (golden).
 */

type Props = {
  className?: string;
  skin?: 'bacon' | 'french-toast' | 'waffle';
  static?: boolean;
};

const SKIN: Record<NonNullable<Props['skin']>, {
  /** Painted CSS-gradient base (always renders). */
  paint: string;
  /** Photographic cover layer (additive, may not load). */
  photo: string;
  /** Border colour to wrap the strip. */
  rim: string;
  /** Syrup drip bead colour. */
  drip: string;
}> = {
  'bacon': {
    paint:
      'repeating-linear-gradient(105deg, #C0364A 0px, #C0364A 18px, #FFEFE0 18px, #FFEFE0 26px, #7E1F2C 26px, #7E1F2C 44px, #F5DEB7 44px, #F5DEB7 52px)',
    photo: '/images/nav/bacon-strip.webp',
    rim:   '#4A1414',
    drip:  '#FBC65A',
  },
  'french-toast': {
    paint:
      'repeating-linear-gradient(135deg, #C97B3D 0px, #C97B3D 16px, #E8A53C 16px, #E8A53C 32px, #B86A2D 32px, #B86A2D 48px, #FFD89C 48px, #FFD89C 60px)',
    photo: '/images/nav/french-toast-stick.webp',
    rim:   '#7A4318',
    drip:  '#A66B1B',
  },
  'waffle': {
    paint:
      'repeating-linear-gradient(0deg,  #E8A53C 0px, #E8A53C 12px, #C97B3D 12px, #C97B3D 14px),' +
      'repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(0,0,0,0.18) 12px, rgba(0,0,0,0.18) 14px)',
    photo: '/images/nav/waffle-stick.webp',
    rim:   '#7A4318',
    drip:  '#A66B1B',
  },
};

export function BaconStrip({ className, skin = 'bacon', static: isStatic }: Props) {
  const s = SKIN[skin];

  return (
    <div
      className={'bs-root relative w-full h-full overflow-hidden ' + (className ?? '')}
      aria-hidden
    >
      {/* Layer 1 — painted gradient base. ALWAYS visible. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: s.paint,
          backgroundSize: 'auto',
        }}
      />

      {/* Layer 2 — photographic skin overlay (cover-fit so it crops not
          stretches). Slight `mix-blend-multiply` so the photo's white
          background blends out and only the bacon outline shows. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${s.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'multiply',
          opacity: 0.85,
        }}
      />

      {/* Inner shadow ring — gives the strip a real "edible" depth */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px ${s.rim}, inset 0 -8px 16px rgba(0,0,0,0.18), inset 0 8px 16px rgba(255,255,255,0.18)`,
        }}
      />

      {/* Syrup drip beads — three positions, animated falling */}
      {!isStatic && (
        <>
          <span
            className="bs-drip bs-drip--1 absolute"
            style={{ left: '22%', bottom: '-4px', width: '8px', height: '8px', borderRadius: '999px', background: s.drip }}
          />
          <span
            className="bs-drip bs-drip--2 absolute"
            style={{ left: '52%', bottom: '-4px', width: '9px', height: '9px', borderRadius: '999px', background: s.drip }}
          />
          <span
            className="bs-drip bs-drip--3 absolute"
            style={{ left: '78%', bottom: '-4px', width: '7px', height: '7px', borderRadius: '999px', background: s.drip }}
          />
        </>
      )}

      <style jsx>{`
        .bs-drip {
          opacity: 0;
          box-shadow: 0 0 4px rgba(0,0,0,0.25);
        }
        .bs-drip--1 { animation: bsDrip 4.4s ease-in-out 0.1s infinite; }
        .bs-drip--2 { animation: bsDrip 5.2s ease-in-out 1.2s infinite; }
        .bs-drip--3 { animation: bsDrip 3.8s ease-in-out 2.0s infinite; }

        @keyframes bsDrip {
          0%   { transform: translateY(0);   opacity: 0; }
          25%  { opacity: 0.95; }
          80%  { opacity: 0.95; }
          100% { transform: translateY(18px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-drip { animation: none !important; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
