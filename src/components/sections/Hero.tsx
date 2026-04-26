'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SITE } from '@/lib/utils';
import { LiveHero } from '@/components/live/LiveHero';
import { BreakfastWorldHero } from '@/components/sections/BreakfastWorldHero';

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Pause SVG animations when tab is hidden
  useEffect(() => {
    const onVis = () => {
      const root = bgRef.current?.querySelector('.bwh-root') as HTMLElement | null;
      if (root) root.dataset.paused = document.hidden ? 'true' : 'false';
    };
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Slogan rendered as INVISIBLE spaceholders behind the background banner —
  // see the comment block on the <h1> below. The text content is preserved
  // for the sr-only line so screen readers still hear it.
  const slogan = ['What', 'did', 'you', 'guys', 'eat', 'for', 'breakfast', 'today?'];

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* Layer 0 — animated SVG ambient (parallax pillars + sparkles + clouds) */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <BreakfastWorldHero />
      </div>

      {/* Layer 1 — REAL hero photo: candy-city breakfast world with the
          "WHAT DID YOU EAT FOR BREAKFAST?" banner sky and the avatar.
          Mobile uses the alternate centered crop; desktop uses the new banner image. */}
      <div className="absolute inset-0 z-[1] hero-photo-layer">
        <Image
          src="/images/hero/breakfast-world-2.png"
          alt="EMM in the breakfast world — pastel candy city with floating waffles, pancake stack, sunny egg, donut tower"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        <Image
          src="/images/hero/breakfast-world-banner.png"
          alt="EMM in the breakfast world — golden banner stretched across the sky reads What did you eat for breakfast"
          fill
          priority
          sizes="100vw"
          className="hidden sm:block object-cover"
          style={{ objectPosition: '50% 35%' }}
        />
        {/* Soft fade gradient — vertical on mobile (text overlay top), horizontal on desktop (text overlay left) */}
        <div
          aria-hidden
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,252,245,0.95) 0%, rgba(255,252,245,0.72) 35%, rgba(255,252,245,0.18) 60%, rgba(255,252,245,0) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,252,245,0.85) 0%, rgba(255,252,245,0.55) 28%, rgba(255,252,245,0.05) 55%, rgba(255,252,245,0) 100%)',
          }}
        />
        {/* Bottom fade into page */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 sm:h-40"
          style={{ background: 'linear-gradient(180deg, rgba(255,252,245,0) 0%, var(--bg) 100%)' }}
        />
      </div>

      {/* Foreground content */}
      <div className="container-soft pt-10 sm:pt-16 lg:pt-24 pb-24 sm:pb-32 grid gap-10 lg:gap-14 lg:grid-cols-[1.15fr_1fr] items-center relative z-10 min-h-[640px]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="inline-flex items-center gap-2 rounded-full ring-1 ring-creamShade bg-cream/85 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-cocoa shadow-soft"
          >
            <span className="text-base">🥞</span> Welcome to EMGamer731 · the breakfast HQ · iykyk
          </motion.div>

          {/*
            Hero title — kept as a SCREEN-READER ONLY h1 so SEO + a11y still work.
            The visible foreground words used to overlap the gold "WHAT DID YOU EAT
            FOR BREAKFAST?" banner that's already painted into the background photo.
            We now render an invisible spaceholder block that preserves the same
            vertical footprint (so the layout below — paragraph, CTAs, LiveHero —
            doesn't shift up into the banner area) without painting any glyphs over
            the artwork. Mobile keeps the same height; desktop keeps the same height.
          */}
          <h1 id="hero-title" className="display text-display-xl text-cocoa mt-5 leading-[0.98]">
            <span className="sr-only">{SITE.slogan}</span>
            <span
              aria-hidden
              className="flex flex-wrap gap-x-3 gap-y-1 select-none pointer-events-none invisible"
            >
              {slogan.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mt-6 max-w-xl text-cocoa/85 text-lg backdrop-blur-sm bg-cream/40 rounded-2xl px-4 py-3 -mx-4"
          >
            EMM is your morning host — Roblox fits with main-character aura, breakfast plates that ate, and the cozy stream the squad shows up for. No cap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link href="/live" className="btn-primary">▶ Catch the live (it&apos;s giving)</Link>
            <Link href="/shop" className="btn-ghost">Shop the merch · slay</Link>
            <Link href="/gallery" className="btn-ghost">Explore the avatar fits</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="mt-10 max-w-xl"
          >
            <LiveHero />
          </motion.div>
        </div>

        {/* Right column intentionally empty — the avatar is in the background image itself */}
        <div aria-hidden />
      </div>
    </section>
  );
}
