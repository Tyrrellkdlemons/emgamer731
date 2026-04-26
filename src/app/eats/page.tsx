'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EATS_TIKTOKS, type ContentCard } from '@/data/latest-content';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { relativeTime } from '@/lib/utils';

export default function EatsPage() {
  const [active, setActive] = useState<ContentCard | null>(EATS_TIKTOKS[0] ?? null);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-berry/40 ring-1 ring-creamShade px-3 py-1 text-xs font-semibold text-cocoa shadow-soft">
          <span aria-hidden>🍽️</span> eatsswithemm — TikTok food picks
        </div>
        <h1 className="display text-display-lg text-cocoa mt-4">Eats</h1>
        <p className="text-cocoa/80 mt-2">
          Hand-picked food TikToks from{' '}
          <a href="https://www.tiktok.com/@eatsswithemm" target="_blank" rel="noopener noreferrer" className="text-syrup font-semibold hover:underline">@eatsswithemm</a>
          . Curated, never auto-bulked — only perfect plates make this page.
        </p>
        <p className="text-sm text-muted mt-2">
          For Roblox livestreams, head to{' '}
          <a href="/live" className="text-syrup font-semibold hover:underline">/live</a>
          {' '}— TikTok is mostly the live channel.
        </p>
      </header>

      {/* Featured TikTok player (vertical) */}
      {active && (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.6fr] mb-10">
          <div>
            <VideoPlayer
              platform="tiktok"
              embedId={active.embedId}
              url={active.url}
              title={active.title}
              thumbnail={active.thumbnail}
            />
          </div>
          <aside>
            <div className="text-xs uppercase tracking-widest text-syrup font-bold">Now showing</div>
            <h2 className="display text-display-md text-cocoa mt-1">{active.title}</h2>
            <div className="text-sm text-muted mt-1">
              TIKTOK · {relativeTime(active.publishedAt)}{active.duration ? ` · ${active.duration}` : ''}
            </div>
            <p className="text-cocoa/80 mt-3">
              Pulled from the curated eats list. Tap any other tile below to swap the player.
            </p>
            {!active.embedId && (
              <div className="mt-3 rounded-xl bg-cream ring-1 ring-creamShade p-3 text-sm text-cocoa/80">
                Add the TikTok video ID (the long number after <code className="font-mono">/video/</code> in the URL) to{' '}
                <code className="font-mono">EATS_TIKTOKS</code> in{' '}
                <code className="font-mono">src/data/latest-content.ts</code> and the player will play in-page.{' '}
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="text-syrup underline">
                  Open on TikTok
                </a>{' '}
                until then.
              </div>
            )}
          </aside>
        </section>
      )}

      {/* Curated grid */}
      <h2 className="display text-display-md text-cocoa mb-4">Today's picks</h2>
      <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {EATS_TIKTOKS.map((c, i) => (
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
        ))}
      </div>

      <p className="text-xs text-muted mt-8 max-w-2xl">
        Curation note: the rule is "perfect food only." TikToks from non-food posts (live Roblox previews, fits, BTS) live on{' '}
        <a href="/live" className="text-syrup hover:underline">/live</a> or stay on TikTok directly.
      </p>
    </div>
  );
}
