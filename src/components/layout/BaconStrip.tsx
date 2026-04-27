'use client';

/**
 * BaconStrip — v2 (now actually visible).
 *
 * v1.5.0 painted SVG bacon as a `position:absolute` layer behind a near-
 * opaque cream pill — net visible bacon = 0%. v1.6.0 fix: render the
 * "bacon" as a thick visible BORDER FRAME around the cream pill (i.e.
 * the bacon IS the border, the cream nav sits inside it). This makes it
 * read at every viewport without needing the inner backdrop to be
 * transparent (which would hurt text legibility).
 *
 * Per creator: "it could even be a long french toast stick since it
 * matches the color scheme better." The default skin is now FRENCH TOAST
 * (golden caramel with cinnamon dust + glossy syrup drips) because it
 * harmonises with the cream/syrup palette of the rest of the site. A
 * `skin="bacon"` prop flips back to the original red-meat aesthetic.
 *
 * Both skins:
 *   - render two slim animated syrup drip beads (top + bottom edges)
 *   - have a slow shine sweep
 *   - respect prefers-reduced-motion
 */

type Props = {
  className?: string;
  skin?: 'french-toast' | 'bacon';
  static?: boolean;
};

export function BaconStrip({ className, skin = 'french-toast', static: isStatic }: Props) {
  const palette =
    skin === 'french-toast'
      ? {
          // golden caramel toast crust + cinnamon dust + syrup glaze
          base:
            'repeating-linear-gradient(135deg, #C97B3D 0px, #C97B3D 14px, #E8A53C 14px, #E8A53C 30px, #B86A2D 30px, #B86A2D 44px, #FFD89C 44px, #FFD89C 58px)',
          edge:  '#7A4318',
          shine: 'rgba(255,252,245,0.55)',
          drip:  '#A66B1B',
        }
      : {
          base:
            'repeating-linear-gradient(105deg, #E66060 0px, #E66060 14px, #F5DEB7 14px, #F5DEB7 24px, #C0364A 24px, #C0364A 38px, #FFEFE0 38px, #FFEFE0 46px)',
          edge:  '#4A1414',
          shine: 'rgba(255,252,245,0.4)',
          drip:  '#FBC65A',
        };

  return (
    <div className={'bs-root relative w-full h-full ' + (className ?? '')} aria-hidden>
      {/* The actual bacon/toast painted gradient — fills parent. The inner
          cream pill is rendered by the SiteHeader on top of this; we keep a
          ~6px visible rim around it via the parent's `padding`. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: palette.base,
          borderRadius: 'inherit',
        }}
      />
      {/* Crispy edge — slightly darker rim hugging the inner cream pill */}
      <div
        className="absolute inset-1 rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px ${palette.edge}`,
          borderRadius: 'inherit',
        }}
      />

      {/* Shine sweep — moves L→R every 7s */}
      {!isStatic && (
        <div
          className="bs-shine absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius: 'inherit' }}
        >
          <div
            className="bs-shine__bar absolute top-0 bottom-0"
            style={{
              left: '-30%',
              width: '30%',
              background: `linear-gradient(95deg, transparent, ${palette.shine}, transparent)`,
            }}
          />
        </div>
      )}

      {/* Syrup drip beads — top + bottom edges, animated falling */}
      {!isStatic && (
        <>
          <span
            className="bs-drip bs-drip--top absolute"
            style={{ left: '24%', top: '-3px', width: '7px', height: '7px', borderRadius: '999px', background: palette.drip }}
          />
          <span
            className="bs-drip bs-drip--top bs-drip--top-2 absolute"
            style={{ left: '70%', top: '-3px', width: '6px', height: '6px', borderRadius: '999px', background: palette.drip }}
          />
          <span
            className="bs-drip bs-drip--bot absolute"
            style={{ left: '40%', bottom: '-4px', width: '8px', height: '8px', borderRadius: '999px', background: palette.drip }}
          />
        </>
      )}

      <style jsx>{`
        .bs-shine__bar {
          animation: bsShine 7s linear infinite;
          transform: skewX(-12deg);
        }
        .bs-drip {
          opacity: 0;
          box-shadow: 0 0 4px rgba(0,0,0,0.12);
        }
        .bs-drip--top    { animation: dripFromTop 4.2s ease-in-out infinite; }
        .bs-drip--top-2  { animation: dripFromTop 5.6s ease-in-out 1.4s infinite; }
        .bs-drip--bot    { animation: dripFromBot 5.0s ease-in-out 2.1s infinite; }

        @keyframes bsShine {
          0%   { transform: translateX(0)     skewX(-12deg); }
          100% { transform: translateX(420%)  skewX(-12deg); }
        }
        @keyframes dripFromTop {
          0%   { transform: translateY(-2px); opacity: 0; }
          15%  { opacity: 0.95; }
          85%  { opacity: 0.95; }
          100% { transform: translateY(14px); opacity: 0; }
        }
        @keyframes dripFromBot {
          0%   { transform: translateY(2px);  opacity: 0; }
          20%  { opacity: 0.95; }
          85%  { opacity: 0.95; }
          100% { transform: translateY(-14px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-shine__bar, .bs-drip { animation: none !important; }
          .bs-drip { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
