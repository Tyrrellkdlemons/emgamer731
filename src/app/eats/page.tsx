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
            </p>
            {!active.embedId && (
              <div className="mt-3 rounded-xl bg-cream ring-1 ring-creamShade p-3 text-sm text-cocoa/80">
                <strong>Tip:</strong> add the TikTok video ID (the long number after <code className="font-mono">/video/</code> in the URL) to{' '}
                <code className="font-mono">EATS_TIKTOKS</code> in{' '}
                <code className="font-mono">src/data/latest-content.ts</code> and this card will play inline. The live feed above already shows every video.{' '}
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="text-syrup underline">
                  Open on TikTok
                </a>{' '}
                in the meantime.
              </div>
            )}
          </aside>
        </section>
      )}

      {/* ───────────────────────────────────────────────────────
          LAYER 3 — Curated grid. Cards WITH an embedId render an
          inline mini-player; cards without fall back to the
          tap-to-feature thumbnail tile.
         ─────────────────────────────────────────────────────── */}
      <h2 className="display text-display-md text-cocoa mb-4">Curated picks · perfect plates only</h2>
      <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {EATS_TIKTOKS.map((c, i) => {
          if (c.embedId) {
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="rounded-2xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
              >
                <div className="aspect-[9/16] overflow-hidden bg-cocoa">
                  <TikTokProfileEmbed videoId={c.embedId} handle="eatsswithemm" className="h-full" />
                </div>
                <div className="p-3">
                  <div className="font-semibold text-cocoa text-sm line-clamp-2">{c.title}</div>
                  <div className="text-[11px] text-muted mt-1">
                    TIKTOK · {relativeTime(c.publishedAt)}{c.duration ? ` · ${c.duration}` : ''}
                  </div>
                </div>
              </motion.div>
            );
          }
          // Fallback — tap to feature in player above
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => {
                setActive(c);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group block text-left rounded-2xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
            >
              <div className="relative aspect-[9/16] bg-creamShade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  tiktok
                </span>
                <span className="absolute top-2 right-2 rounded-full bg-berry text-cocoa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  eats
                </span>
              </div>
              <div className="p-3">
                <div className="font-semibold text-cocoa text-sm line-clamp-2">{c.title}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-8 max-w-2xl">
        Curation note: the rule is &quot;perfect food only.&quot; TikToks from non-food posts (live Roblox previews, fits, BTS) live on{' '}
        <a href="/live" className="text-syrup hover:underline">/live</a> or stay on TikTok directly. The live feed above will pull EVERY post from the channel — the curated grid filters down to food-only.
      </p>
    </div>
  );
}
