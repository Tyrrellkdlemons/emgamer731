/**
 * Logo system — v1.2.0
 *
 * Three lockups:
 *   <Logo variant="full"  />  — wordmark + cap mark + handle, used in hero/footer
 *   <Logo variant="stacked" /> — wordmark + cap mark, used in nav header
 *   <Logo variant="mark" />   — cap mark only, used as favicon-style avatar
 *
 * Hand-crafted SVG. The "M" cap badge ties to the avatar. The 731 is set in JetBrains Mono
 * to differentiate it from the wordmark and emphasize the gamer-numerical accent.
 */

import { cn } from '@/lib/utils';

type Variant = 'full' | 'stacked' | 'mark';

export function Logo({ variant = 'stacked', className }: { variant?: Variant; className?: string }) {
  if (variant === 'mark') {
    return <CapMark className={className} />;
  }
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <CapMark size={variant === 'full' ? 44 : 36} />
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

function CapMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn('inline-grid place-items-center rounded-2xl shadow-soft', className)}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(180deg, #2A1E18 0%, #0F0905 100%)',
      }}
      aria-label="EMG731 cap mark"
    >
      <svg viewBox="0 0 64 64" width={size * 0.7} height={size * 0.7} aria-hidden>
        {/* Cap brim */}
        <path d="M6,42 Q32,52 58,42 L58,46 Q32,56 6,46 Z" fill="#FFFCF5" opacity="0.85"/>
        {/* Crown */}
        <path d="M14,38 Q14,18 32,16 Q50,18 50,38 Z" fill="none" stroke="#FFFCF5" strokeWidth="2" opacity="0.5"/>
        {/* Embroidered M */}
        <g fill="#FFFCF5">
          <path d="M22,38 L22,22 L26,22 L32,30 L38,22 L42,22 L42,38 L38,38 L38,28 L32,36 L26,28 L26,38 Z"/>
        </g>
        {/* Top button */}
        <circle cx="32" cy="14" r="2" fill="#E8A53C"/>
        {/* Tiny bear charm dot — avatar callback */}
        <circle cx="54" cy="50" r="3" fill="#E63946" opacity="0.95"/>
      </svg>
    </span>
  );
}

export { CapMark };
