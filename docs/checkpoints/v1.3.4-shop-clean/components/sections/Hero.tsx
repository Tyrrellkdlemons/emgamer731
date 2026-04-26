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
          style={{ background: 'linear-gradient(180deg, rgba(255,252,245,0) 0%, var(--bg) 10