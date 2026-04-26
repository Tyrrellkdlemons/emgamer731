'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EATS_TIKTOKS, type ContentCard } from '@/data/latest-content';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { TikTokProfileEmbed } from '@/components/watch/TikTokProfileEmbed';
import { relativeTime } from '@/lib/utils';

/**
 * /eats — TikTok food page.
 *
 * Goal (per creator): EVERY TikTok plays INLINE so visitors never leave the site.
 * Three layers of inline TikTok playback:
 *   1. Profile feed (top)         — TikTok's official `<blockquote>` creator embed
 *                                    that auto-renders into a scrollable player of
 *                                    @eatsswithemm's latest videos.
 *   2. Curated featured player    — when a card has an `embedId`, plays via
 *                                    TikTok's video iframe (VideoPlayer facade).
 *   3. Per-card inline embed      — for cards WITH an embedId, the tile itself
 *                                    becomes a tiny inline blockquote player
 *                                    instead of an external link tile.
 * Cards without an `embedId` still render the curated thumbnail + open-on-TikTok.
 */
export default function EatsPage() {
  const [active, setActive] = useState<ContentCard | null>(EATS_TIKTOKS[0] ?? null);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-berry/40 ring-1 ring-creamShade px-3 py-1 text-xs font-semibold text-cocoa shadow-soft">
          <span aria-hidden>🍽️</span> eatsswithemm — TikTok food picks · plays inline, no leaving
        </div>
        <h1 className="display text-display-lg text-cocoa mt-4">Eats</h1>
        <p className="text-cocoa/80 mt-2">
          Hand-picked food TikToks from{' '}
          <a href="https://www.tiktok.com/@eatsswithemm" target="_blank" rel="noopener noreferrer" className="text-syrup font-semibold hover:underline">@eatsswithemm</a>
          . Every clip plays right here — TikTok&apos;s official embed pulls the latest videos straight into the page.
        </p>
        <p className="text-sm text-muted mt-2">
          For Roblox livestreams, head to{' '}
          <a href="/live" className="text-syrup font-semibold hover:underline">/live</a>
          {' '}— TikTok is mostly the live channel.
        </p>
      </header>

      {/* ───────────────────────────────────────────────────────
          LAYER 1 — Live profile feed embedded inline.
          TikTok's blockquote+embed.js renders @eatsswithemm's latest
          videos as a vertical scroller right here on the page. No
          third-party redirect, no leaving the site.
         ─────────────────────────────────────────────────────── */}
      <section className="mb-12" aria-labelledby="eats-feed-title">
        <h2 id="eats-feed-title" className="display text-display-md text-cocoa mb-4">
          Live feed — @eatsswithemm
        </h2>
        <div className="rounded-3xl bg-cream ring-1 ring-creamShade shadow-soft p-3 sm:p-5">
          <TikTokProfileEmbed handle="eatsswithemm" />
          <p className="text-xs text-muted mt-3 text-center">
            Powered by TikTok&apos;s official embed — every new post shows up here automatically.
          </p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────
          LAYER 2 — Curated featured player (when an embedId is set).
         ─────────────────────────────────────────────────────── */}
      {active && (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.6fr] mb-10" aria-labelledby="eats-featured-title">
          <div>
            {active.embedId ? (
              <TikTokProfileEmbed videoId={active.embedId} handle="eatsswithemm" />
            ) : (
              <VideoPlayer
                platform="tiktok"
                embedId={active.embedId}
                url={active.url}
                title={active.title}
                thumbnail={active.thumbnail}
              />
            )}
          </div>
          <aside>
            <div className="text-xs uppercase tracking-widest text-syrup font-bold">Now showing</div>
            <h2 id="eats-featured-title" className="display text-display-md text-cocoa mt-1">{active.title}</h2>
            <div className="text-sm text-muted mt-1">
              TIKTOK · {relativeTime(active.publishedAt)}{active.duration ? ` · ${active.duration}` : ''}
            </div>
            <p className="text-cocoa/80 mt-3">
              Pulled from the curated eats list. Tap any other tile below to swap the featured player — or just scroll the live feed above.
