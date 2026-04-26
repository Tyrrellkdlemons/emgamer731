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
          <linearGradient id="em-pancake-edge" x1="0" x2