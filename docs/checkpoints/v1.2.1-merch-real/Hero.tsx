'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '@/lib/utils';
import { LiveHero } from '@/components/live/LiveHero';
import { BreakfastWorldHero } from '@/components/sections/BreakfastWorldHero';

export function Hero() {
  const reduce = useReducedMotion();
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

  const wordVariants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  const slogan = ['What', 'did', 'you', 'guys', 'eat', 'for', 'breakfast', 'today?'];

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* Layer 0 — animated SVG ambient (parallax pillars + sparkles + clouds) */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <BreakfastWorldHero />
      </div>

      {/* Layer 1 — REAL hero photo: the candy-city breakfast world with the avatar.
          Mobile uses the centered-crop 2nd image for the avatar to read tall;
          desktop uses the wide 1st image. Hidden on save-data networks. */}
      <div className="absolute inset-0 z-[1] hero-photo-layer">
        {/* Mobile/portrait — the alternate hero crop reads better on tall screens */}
        <Image
          src="/images/hero/breakfast-world-2.png"
          alt="EMM in the breakfast world — pastel candy city with floating waffles, pancake stack, sunny egg, donut tower"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        {/* sm+ — the wide hero, anchored right so the avatar shows */}
        <Image
          src="/images/hero/breakfast-world-1.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 100vw"
          className="hidden sm:block object-cover"
          style={{ objectPosition: '70% 50%' }}
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
    