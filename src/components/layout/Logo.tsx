/**
 * Logo system — v1.3.0
 *
 * NEW MARK: "EM" breakfast monogram
 *   • The "E" is a stack of three waffle bars (golden, with grid texture)
 *   • The "M" is built from two pancake stacks joined by a butter-pat valley
 *   • Backed by a soft-cream rounded square with a tiny mint-mint sparkle
 *   • Tiny red bear-charm dot in the corner — avatar callback preserved
 *
 * Three lockups:
 *   <Logo variant="full"  /> — wordmark + EM mark + handle, used in hero/footer
 *   <Logo variant="stacked" /> — wordmark + EM mark, used in nav header
 *   <Logo variant="mark" /> — EM mark only, used as favicon-style avatar
 */

import { cn } from '@/lib/utils';

type Variant = 'full' | 'stacked' | 'mark';

export function Logo({ variant = 'stacked', className }: { variant?: Variant; className?: string }) {
  if (variant === 'mark') {
    return <EmMark className={className} />;
  }
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <EmMark size={variant === 'full' ? 48 : 38} />
      <div className="leading-tight">
        <div
          className={cn(
            'display text-cocoa font-extrabold tracking-tight',
            variant === 'full' ? 'text-xl sm:text-2xl' : 'text-base',
          )}
          style={{ letterSpacing: '-0.04em' }}
        >
          EMGamer<span className="font-mono text-syrup font-bold tracking-tighter">731</span>
        </div>
        {variant === 'full' ? (
          <div className="text-[11px] sm:text-xs text-muted font-mono tracking-tight -mt-0.5">
            @eatsswithemm · what did you guys eat for breakfast today?
          </div>
        ) : (
          <div className="text-[11px] text-muted font-mono tracking-tight -mt-0.5">
            @eatsswithemm
          </div>
        )}
      </div>
    </div>
  );
}

function EmMark({ size = 38, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn('inline-grid place-items-center rounded-2xl shadow-soft relative', className)}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(160deg, #FFF8EE 0%, #FFE9C7 60%, #FFD89C 100%)',
      }}
      aria-label="EM breakfast mark — EMGamer731 logo"
    >
      <svg viewBox="0 0 64 64" width={size * 0.78} height={size * 0.78} aria-hidden>
        <defs>
          <linearGradient id="em-waffle" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFD89C"/>
            <stop offset="100%" stopColor="#E8A53C"/>
          </linearGradient>
          <linearGradient id="em-pancake" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFE4B5"/>
            <stop offset="100%" stopColor="#E8A53C"/>
          </linearGradient>
          <linearGradient id="em-pancake-edge" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#E8A53C"/>
            <stop offset="100%" stopColor="#C97B3D"/>
          </linearGradient>
        </defs>

        {/* === E — three waffle bars === */}
        <g>
          {/* top bar */}
          <rect x="8" y="14" width="20" height="6" rx="1.4" fill="url(#em-waffle)" stroke="#C97B3D" strokeWidth="0.6"/>
          <line x1="14" y1="14" x2="14" y2="20" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="20" y1="14" x2="20" y2="20" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="8"  y1="17" x2="28" y2="17" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          {/* middle bar (shorter) */}
          <rect x="8" y="29" width="16" height="6" rx="1.4" fill="url(#em-waffle)" stroke="#C97B3D" strokeWidth="0.6"/>
          <line x1="14" y1="29" x2="14" y2="35" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="20" y1="29" x2="20" y2="35" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="8"  y1="32" x2="24" y2="32" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          {/* bottom bar */}
          <rect x="8" y="44" width="20" height="6" rx="1.4" fill="url(#em-waffle)" stroke="#C97B3D" strokeWidth="0.6"/>
          <line x1="14" y1="44" x2="14" y2="50" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="20" y1="44" x2="20" y2="50" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          <line x1="8"  y1="47" x2="28" y2="47" stroke="#C97B3D" strokeWidth="0.5" opacity="0.6"/>
          {/* spine */}
          <rect x="8" y="14" width="3" height="36" rx="1" fill="url(#em-waffle)" stroke="#C97B3D" strokeWidth="0.6"/>
        </g>

        {/* === M — two pancake stacks joined by a butter-pat valley === */}
        <g>
          {/* left pancake stack (3 pancakes) */}
          <ellipse cx="40" cy="44" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="40" cy="42" rx="6" ry="2" fill="url(#em-pancake)"/>
          <ellipse cx="40" cy="36" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="40" cy="34" rx="6" ry="2" fill="url(#em-pancake)"/>
          <ellipse cx="40" cy="28" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="40" cy="26" rx="6" ry="2" fill="url(#em-pancake)"/>

          {/* right pancake stack (3 pancakes) */}
          <ellipse cx="54" cy="44" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="54" cy="42" rx="6" ry="2" fill="url(#em-pancake)"/>
          <ellipse cx="54" cy="36" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="54" cy="34" rx="6" ry="2" fill="url(#em-pancake)"/>
          <ellipse cx="54" cy="28" rx="6" ry="2" fill="url(#em-pancake-edge)"/>
          <ellipse cx="54" cy="26" rx="6" ry="2" fill="url(#em-pancake)"/>

          {/* butter-pat valley between the stacks */}
          <path d="M40,26 L47,32 L54,26 L54,30 L47,36 L40,30 Z" fill="url(#em-pancake-edge)" opacity="0.85"/>
          <rect x="44" y="22" width="6" height="4" rx="1" fill="#FFFBF0"/>

          {/* syrup drip on right */}
          <path d="M59,38 q3,8 -1,16 q-1,2 -3,0 q2,-6 -1,-12 q-2,-4 5,-4 z" fill="#C97B3D"/>
        </g>

        {/* sparkle */}
        <g>
          <path d="M58,12 l1,2 l2,1 l-2,1 l-1,2 l-1,-2 l-2,-1 l2,-1 z" fill="#A8E6CF"/>
        </g>
      </svg>

      {/* Tiny red bear-charm dot — avatar callback preserved */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: Math.max(8, size * 0.18),
          height: Math.max(8, size * 0.18),
          borderRadius: '50%',
          background: '#E63946',
          border: '2px solid #FFFCF5',
        }}
      />
    </span>
  );
}

export { EmMark };
