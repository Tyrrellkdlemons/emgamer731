'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentCard } from '@/data/latest-content';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { relativeTime, cn } from '@/lib/utils';

const TABS = [
  { id: 'all',       label: 'All' },
  { id: 'shorts',    label: 'Shorts' },
  { id: 'longform',  label: 'Long-form' },
  { id: 'live',      label: 'Live + Replays' },
  { id: 'gameplay',  label: 'Gameplay' },
  { id: 'fashion',   label: 'Avatar fits' },
  { id: 'breakfast', label: 'Breakfast' },
] as const;

export function WatchClient({ items: initial }: { items: ContentCard[] }) {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('all');
  const [active, setActive] = useState<ContentCard | null>(initial[0] ?? null);

  const items = useMemo(() => {
    if (tab === 'all') return initial;
    if (tab === 'shorts') return initial.filter((c) => c.isShort || c.category === 'short');
    if (tab === 'longform') return initial.filter((c) => !c.isShort && c.category !== 'short');
    return initial.filter((c) => c.category === tab);
  }, [tab, initial]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="display text-display-lg text-cocoa">Watch</h1>
          <p className="text-cocoa/70 mt-2 max-w-2xl">
            Every upload from{' '}
            <a href="https://www.youtube.com/@EmGamer731" className="text-syrup font-semibold hover:underline" target="_blank" rel="noopener noreferrer">@EmGamer731</a>
            {' '}— long-form videos AND{' '}
            <a href="https://www.youtube.com/@EmGamer731/shorts" className="text-syrup font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Shorts</a>
            {' '}— auto-pulled and playable inline. No leaving the site. New uploads appear within 30 minutes.
            {' '}For TikTok food posts, see{' '}
            <a href="/eats" className="text-syrup font-semibold hover:underline">/eats</a>.
          </p>
        </div>
        <div className="text-xs text-muted font-mono">
          {initial.length} item{initial.length === 1 ? '' : 's'} loaded
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn('pill', tab === t.id && 'bg-mint shadow-soft')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Featured player + up-next rail */}
      {active && (
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] mb-10">
          <div>
            <VideoPlayer
              platform={active.platform}
              embedId={active.embedId}
              url={active.url}
              title={active.title}
              thumbnail={active.thumbnail}
            />
            <h2 className="display text-display-md text-cocoa mt-4">{active.title}</h2>
            <div className="text-sm text-muted mt-1">
              {active.platform.toUpperCase()} · {relativeTime(active.publishedAt)}{active.duration ? ` · ${active.duration}` : ''}
            </div>
            {!active.embedId && (
              <div className="mt-3 rounded-xl bg-cream ring-1 ring-creamShade p-3 text-sm text-cocoa/80">
                Inline play unavailable for this item — click to open externally.
              </div>
            )}
          </div>
          <aside>
            <div className="text-xs uppercase tracking-widest text-syrup font-bold mb-2">Up next</div>
            <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {items
                .filter((c) => c.id !== active.id)
                .slice(0, 10)
                .map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActive(c);
                        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left flex gap-3 rounded-xl ring-1 ring-creamShade bg-cream p-2 hover:bg-pancake/40 transition-colors"
                    >
                      <span className="relative w-28 flex-none aspect-video rounded-md overflow-hidden bg-creamShade">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy"/>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-cocoa line-clamp-2">{c.title}</span>
                        <span className="block text-xs text-muted mt-0.5">
                          {c.platform.toUpperCase()} · {relativeTime(c.publishedAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </aside>
        </section>
      )}

      {/* Full grid */}
      <h2 className="display text-display-md text-cocoa mb-4">All videos</h2>
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <motion.button
              layout
              key={c.id}
              type="button"
              onClick={() => {
                setActive(c);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.4 }}
              className="group block text-left rounded-2xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
            >
              <div className={cn('relative bg-creamShade', c.isShort ? 'aspect-[9/16]' : 'aspect-video')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {c.platform}
                </span>
                {c.isShort && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-berry text-cocoa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    short
                  </span>
                )}
                {c.duration && (
                  <span className="absolute bottom-2 right-2 rounded bg-cocoa/85 text-eggshell px-1.5 py-0.5 text-xs font-mono">
                    {c.duration}
                  </span>
                )}
                <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity bg-cocoa/20">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cream/95 text-cocoa shadow-lifted">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
              <div className="p-3">
                <div className="font-semibold text-cocoa line-clamp-2">{c.title}</div>
                <div className="text-xs text-muted mt-1">{relativeTime(c.publishedAt)} · {c.category}</div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
