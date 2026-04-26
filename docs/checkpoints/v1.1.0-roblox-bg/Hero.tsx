'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '@/lib/utils';
import { LiveHero } from '@/components/live/LiveHero';
import { RobloxWorldBackground } from '@/components/sections/RobloxWorldBackground';
import { AvatarCard } from '@/components/sections/AvatarCard';

export function Hero() {
  const reduce = useReducedMotion();
  const bgRef = useRef<HTMLDivElement>(null);

  // Pause background animations when the tab is hidden — saves battery + CPU on mobile
  useEffect(() => {
    const onVis = () => {
      const root = bgRef.current?.querySelector('.rwb-root') as HTMLElement | null;
      if (root) root.dataset.paused = document.hidden ? 'true' : 'false';
    };
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const wordVariants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  const slogan = ['What', 'did', 'you', 'guys', 'eat', 'for', 'breakfast', 'today?'];

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div ref={bgRef} className="absolute inset-0">
        <RobloxWorldBackground />
      </div>

      <div className="container-soft pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 grid gap-10 lg:gap-14 lg:grid-cols-[1.15fr_1fr] items-center relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="inline-flex items-center gap-2 rounded-full ring-1 ring-creamShade bg-cream/85 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-cocoa shadow-soft"
          >
            <span className="text-base">🥞</span> Welcome to EMGamer731 · the breakfast HQ
          </motion.div>

          <h1 id="hero-title" className="display text-display-xl text-cocoa mt-5 leading-[1.02]">
            <span className="sr-only">{SITE.slogan}</span>
            <span aria-hidden className="flex flex-wrap gap-x-3 gap-y-1">
              {slogan.map((w, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 6 ? 'text-syrup' : ''}
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mt-6 max-w-xl text-cocoa/80 text-lg"
          >
            EMM is your morning host — Roblox fits, breakfast plates, and the cozy stream the squad shows up for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-7 flex flex-wrap g