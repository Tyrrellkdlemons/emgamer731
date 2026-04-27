'use client';

/**
 * BaconStrip — v3 (real bacon photo skin).
 *
 * v1.6.4 swap: replaces the painted CSS-gradient bacon with the actual
 * `navbar insp bacon.png` artwork (optimized to a 160KB WebP). The image
 * is a wavy crispy bacon strip with cream-coloured pill cutouts — perfect
 * frame for our floating nav. We use it as a `<picture>` background;
 * the real interactive nav (logo + links + LiveBadge) sits on top inside
 * the cream pill the SiteHeader renders.
 *
 * Three skins available via prop, all optimized to ~160-195KB:
 *   - "bacon"        (default)  red wavy strip with pill cutouts
 *   - "french-toast" golden caramel slab with butter + syrup
 *   - "waffle"       golden waffle with syrup drips
 *
 * The animated syrup drip beads stay (CSS keyframes, GPU-only) so even
 * the realistic-photo skin feels alive. Reduced-motion guarded.
 */

type Props = {
  className?: string;
  skin?: 'bacon' | 'french-toast' | 'waffle';
  static?: boolean;
};

const SKIN_PATH: Record<NonNullable<Props['skin']>, string> = {
  'bacon': '/images/nav/bacon-strip.webp',
  'french-toast': '/images/nav/french-toast-stick.webp',
  'waffle': '/images/nav/waffle-stick.webp',
};

const SKIN_DRIP: Record<NonNullable<Props['skin']>, string> = {
  'bacon': '#FBC65A',         // honey syrup over bacon
  'french-toast': '#A66B1B',  // dark caramel
  'waffle': '#A66B1B',        // dark caramel
};

export function BaconStrip({ className, skin = 'bacon', static: isStatic }: Props) {
  const drip = SKIN_DRIP[skin];
  const path = SKIN_PATH[skin];

  return (
    <div className={'bs-root relative w-full h-full overflow-hidden ' + (className ?? '')} aria-hidden>
      {/* Real-photo skin — covers the whole capsule. `object-fill` stretches
          to match the floating nav width; on a wavy bacon strip this gives
          us a continuous "ribbon" look at any width. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={path}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'fill' }}
        loading="eager"
        decoding="async"
      />

      {/* Animated syrup drip beads — lightweight CSS-only highlights so even
          the photographic skin feels alive without re-encoding video. */}
      {!isStatic && (
        <>
          <span
            className="bs-drip bs-drip--1 absolute"
            style={{ left: '24%', bottom: '-4px', width: '7px', height: '7px', borderRadius: '999px', background: drip }}
          />
          <span
            className="bs-drip bs-drip--2 absolute"
            style={{ left: '54%', bottom: '-4px', width: '8px', height: '8px', borderRadius: '999px', background: drip }}
          />
          <span
            className="bs-drip bs-drip--3 absolute"
            style={{ left: '78%', bottom: '-4px', width: '6px', height: '6px', borderRadius: '999px', background: drip }}
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
          100% { transform: translateY(16px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-drip { animation: none !important; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
