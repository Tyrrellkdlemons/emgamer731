'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SITE } from '@/lib/utils';
import { LiveHero } from '@/components/live/LiveHero';

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
      {/*
        Layer 0 was the BreakfastWorldHero SVG ambient (parallax pillars +
        floating waffles + sparkles). It was painting OVER the real
        breakfast-world banner photo on the live site even though the photo
        had a higher z-index — same stacking context, last-paint wins.
        v1.4.0 hotfix: drop the SVG ambient on home. The candy-city banner
        photo is already rich and the user explicitly asked for it to be
        visible. We keep `bgRef` declared so the visibility-pause useEffect
        stays harmless (queries return null, the early-return triggers).
      */}
      <div ref={bgRef} aria-hidden />

      {/* Layer 1 — REAL hero photo: candy-city breakfast world with the
          "WHAT DID YOU EAT FOR BREAKFAST?" banner sky and the avatar.
          Mobile uses the alternate centered crop; desktop uses the new banner image.
          IMG SOURCES are the optimized .webp files (~10× smaller than the source PNGs)
          so LCP stays fast on mobile + retina without losing visual fidelity. */}
      <div className="absolute inset-0 z-[1] hero-photo-layer">
        <Image
          src="/images/hero/breakfast-world-2.webp"
          alt="EMM in the breakfast world — pastel candy city with floating waffles, pancake stack, sunny egg, donut tower"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        <Image
          src="/images/hero/breakfast-world-banner.webp"
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
       