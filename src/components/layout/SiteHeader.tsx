'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRIMARY_NAV } from '@/data/nav';
import { cn } from '@/lib/utils';
import { useLiveStatus } from '@/components/live/LiveStatusProvider';
import { LiveBadge } from '@/components/live/LiveBadge';
import { Logo } from '@/components/layout/Logo';

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

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 ease-morning',
        scrolled ? 'backdrop-blur-xl bg-eggshell/75 border-b border-creamShade' : 'bg-transparent',
      )}
      role="banner"
    >
      <div className="container-soft flex items-center justify-between py-3.5">
        <Link href="/" aria-label="EMGamer731 home" className="group">
          <Logo variant="stacked" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-sm font-medium text-cocoa/80 transition-colors hover:text-cocoa',
                  active && 'text-cocoa',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-mint/60"
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
                <path d="M6 6l12 12M18 6L6 18" stroke="#3B2A22" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="#3B2A22" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="lg:hidden border-t border-creamShade bg-eggshell"
          >
            <div className="container-soft grid grid-cols-2 gap-2 py-4">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl bg-cream px-4 py-3 text-cocoa font-medium ring-1 ring-creamShade"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
