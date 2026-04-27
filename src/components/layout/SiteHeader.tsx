'use client';

/**
 * SiteHeader — v1.4.1: floating "bacon strip" nav.
 *
 * The previous nav was a plain top bar. The user wanted something on-brand
 * and breakfast-themed, so this is shaped like a curved strip of bacon: an
 * outer capsule painted with a warm pink → caramel bacon gradient (the
 * "rind"), with a cream "fat marbling" overlay; the actual nav links sit on
 * a backdrop-blurred cream pill INSIDE the capsule so contrast stays high
 * and text is fully legible. The whole thing FLOATS — there's a top margin
 * and a soft drop-shadow so it reads as a separate object hovering above
 * the page (mobile-friendly + PWA-safe via env(safe-area-inset-top)).
 *
 * Behaviour preserved from the prior version:
 *   - Sticky to top of viewport (z-50).
 *   - Active route gets the existing `nav-active` motion pill so the
 *     framer-motion shared layoutId animation still works.
 *   - LiveBadge stays at the right end.
 *   - Mobile: hamburger toggles the existing dropdown sheet (now also
 *     dressed in cream + bacon ring for visual cohesion).
 *   - On scroll past 8px, the bacon shadow gets stronger (lifted feel).
 *
 * Why CSS-painted bacon vs an SVG sprite: zero extra payload, scales with
 * the viewport, and CSS gradients are GPU-composited on hover.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRIMARY_NAV } from '@/data/nav';
import { cn } from '@/lib/utils';
import { useLiveStatus } from '@/components/live/LiveStatusProvider';
import { LiveBadge } from '@/components/live/LiveBadge';
import { Logo } from '@/components/layout/Logo';
import { BaconStrip } from '@/components/layout/BaconStrip';

export function SiteHeader() {
  const pathname = usePathname();
  const { summary } = useLiveStatus();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 pointer-events-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
    >
      <div className="container-soft pointer-events-none">
        {/* Outer floating capsule — v1.6.5 fix: rounded-full + overflow-
            hidden so the bacon skin is clipped to a clean pill shape and
            the inner cream area sits cleanly inside. The BaconStrip now
            has a guaranteed-visible CSS-painted base so the bacon look
            never disappears even if the photo overlay fails to load. */}
        <div
          className={cn(
            'relative pointer-events-auto rounded-full overflow-hidden transition-all duration-300 ease-morning',
            scrolled ? 'shadow-lifted' : 'shadow-soft',
          )}
          style={{
            padding: '10px',
            border: '2px solid #4A1414',
          }}
        >
          {/* Real-photo bacon skin (covers the whole capsule shape) */}
          <BaconStrip className="absolute inset-0" skin="bacon" />
          {/* Inner cream pill — capsule-shaped for text legibility, sits
              inside the bacon's natural pill-cutout area. */}
          <div
            className="relative rounded-full backdrop-blur-xl shadow-soft"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,252,245,0.97), rgba(255,248,238,0.93))',
              border: '1px solid rgba(74,20,20,0.4)',
            }}
          >
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2">
              {/* Logo — bigger than before so the EM mark reads at a glance */}
              <Link href="/" aria-label="EMGamer731 home" className="group flex-none">
                <span className="block scale-110 sm:scale-125 origin-left transition-transform group-hover:scale-[1.15] sm:group-hover:scale-[1.32]">
                  <Logo variant="stacked" />
                </span>
              </Link>

              {/* Desktop primary nav */}
              <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
                {PRIMARY_NAV.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative rounded-full px-3.5 py-2 text-sm font-semibold text-cocoa/85 transition-colors hover:text-cocoa',
                        active && 'text-cocoa',
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-mint/70"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <LiveBadge compact summary={summary} />
                <button
                  type="button"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                  className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-creamShade bg-cream"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    {open ? (
                      <path d="M6 6l12 12M18 6L6 18" stroke="#3B2A22" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <path d="M4 7h16M4 12h16M4 17h16" stroke="#3B2A22" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dropdown sheet — also wrapped in a small bacon strip for
            visual continuity */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden mt-2 pointer-events-auto relative overflow-hidden rounded-3xl"
              style={{ padding: '10px', border: '2px solid #4A1414' }}
            >
              <BaconStrip className="absolute inset-0" skin="bacon" />
              <div className="relative rounded-3xl bg-eggshell/95 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {PRIMARY_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl bg-cream px-4 py-3 text-cocoa font-semibold ring-1 ring-creamShade text-center"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
