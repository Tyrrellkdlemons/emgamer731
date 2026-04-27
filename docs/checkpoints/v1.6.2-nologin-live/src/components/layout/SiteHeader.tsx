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
        {/* Outer floating capsule — the "FRENCH-TOAST STICK" frame.
            v1.6.0 fix: padding bumped to 9px (was 6) so the toast frame is
            actually visible rim-around-cream. The BaconStrip lives BEHIND
            the inner cream pill but the visible 9px ring proves the toast
            colour at every viewport. */}
        <div
          className={cn(
            'relative pointer-events-auto rounded-full transition-all duration-300 ease-morning',
            scrolled ? 'shadow-lifted' : 'shadow-soft',
          )}
          style={{
            border: '2px solid #7A4318',
            padding: '9px',
            overflow: 'hidden',
          }}
        >
          {/* French-toast painted skin (default). Pass skin="bacon" to
              switch back to the red-meat aesthetic. */}
          <BaconStrip className="absolute inset-0" skin="french-toast" />
          {/* Inner cream pill — sits inset by `padding` so a visible rim
              of toast shows around it. */}
          <div
            className="relative rounded-full backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,252,245,0.94), rgba(255,248,238,0.88))',
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
                        'relative rounded-full px-3.5 py-2 text-sm font-semibold text