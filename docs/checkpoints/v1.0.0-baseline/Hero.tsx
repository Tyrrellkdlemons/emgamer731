'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '@/lib/utils';
import { LiveHero } from '@/components/live/LiveHero';
import { BreakfastFloaters } from '@/components/sections/BreakfastFloaters';
import { AvatarCard } from '@/components/sections/AvatarCard';

export function Hero() {
  const reduce = useReducedMotion();

  const wordVariants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  const slogan = ['What', 'did', 'you', 'guys', 'eat', 'for', 'breakfast', 'today?'];

  return (
    <section className="relative overflow-hidden noise" aria-labelledby="hero-title">
      <BreakfastFloaters />
      <div className="container-soft pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 grid gap-10 lg:gap-14 lg:grid-cols-[1.15fr_1fr] items-center relative">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="inline-flex items-center gap-2 rounded-full ring-1 ring-creamShade bg-cream px-3.5 py-1.5 text-xs font-semibold text-cocoa shadow-soft"
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
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link href="/live" className="btn-primary">▶ Watch live</Link>
            <Link href="/shop" className="btn-ghost">Shop the brand</Link>
            <Link href="/gallery" className="btn-ghost">Explore gallery</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="mt-10"
          >
            <LiveHero />
          </motion.div>
        </div>

        <div className="relative">
          <AvatarCard />
        </div>
      </div>
    </section>
  );
}
