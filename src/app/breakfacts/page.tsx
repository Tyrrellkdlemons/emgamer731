'use client';

/**
 * /breakfacts — "Breakfacts" nav label.
 *
 * v1.6.3 routing rule (per creator):
 *   "the breakfacts should be remodeled with the 67 brainrot educational drops"
 * → THIS page is now the 67 educational facts across 11 categories
 *   (physics, tech, psychology, culture, math, biology, philosophy, music,
 *    economics, history, art) — packaged in meme-shaped cards so the squad
 *   actually reads them.
 *
 * The OLD visual archive (avatar art, mockups, wallpapers, stickers,
 * overlays) lives on at /archive — accessible from the footer for anyone
 * who still wants the original gallery.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BRAINROTS,
  BRAINROT_CATEGORIES,
  type Brainrot,
  type BrainrotCategory,
} from '@/data/brainrots';

// ─── Monetization defaults (kept for the v2 sticker bundle drop) ─────
const DEFAULT_PRICE_CENTS = 199;
const DEFAULT_FORMATS = ['Sticker', 'Wallpaper'];

function fmtPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

function useWaitlist(): [Set<string>, (id: string) => void] {
  const [list, setList] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = sessionStorage.getItem('emg731:brainrot:waitlist');
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      return new Set();
    }
  });
  const toggle = (id: string) => {
    setList((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        sessionStorage.setItem('emg731:brainrot:waitlist', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };
  return [list, toggle];
}

type Filter = 'all' | BrainrotCategory;

export default function BreakfactsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [waitlist, toggleWaitlist] = useWaitlist();

  const items = useMemo(() => {
    if (filter === 'all') return BRAINROTS;
    return BRAINROTS.filter((b) => b.category === filter);
  }, [filter]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint/70 ring-1 ring-creamShade px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa shadow-soft">
          <span aria-hidden>🧠</span> Breakfacts · 67 educational drops
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          Brainrot, but it makes you smarter. fr.
        </h1>
        <p className="text-cocoa/85 mt-3">
          67 actually-extraordinary facts across <strong>culture, physics, tech, psychology, math,
          biology, philosophy, music, economics, history, and art</strong> — packaged in
          meme-shaped cards so the squad reads them. Same dopamine hit, real learning underneath.
          It&apos;s giving aura.
        </p>
        <p className="text-sm text-cocoa/70 mt-2">
          Each fact drops as a <strong>sticker + lockscreen wallpaper</strong> bundle.
          Tap <em>Notify me</em> to lock in your spot — first dibs when the bundles drop.
        </p>
        <nav aria-label="Other surfaces" className="mt-3 flex flex-wrap gap-2 text-xs">
          <a className="pill bg-pancake/50 hover:bg-pancake" href="/gallery">
            🤖 67 Brot Figures · shop
          </a>
          <a className="pill bg-cream hover:bg-pancake/40" href="/lookbook">
            📷 The Lookbook
          </a>
          <a className="pill bg-syrup/30 hover:bg-syrup/60" href="/live">
            🔴 Catch the live
          </a>
        </nav>
      </header>

      <div
        className="flex flex-wrap gap-2 mb-6 sm:mb-8"
        role="tablist"
        aria-label="Filter brainrots by category"
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={
            'pill capitalize transition-all flex-none ' +
            (filter === 'all' ? 'bg-mint shadow-soft' : 'hover:bg-mint/40')
          }
        >
          All <span className="text-xs text-cocoa/60 ml-1">({BRAINROTS.length})</span>
        </button>
        {BRAINROT_CATEGORIES.map((c) => {
          const count = BRAINROTS.filter((b) => b.category === c.id).length;
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              aria-pressed={active}
              className={
                'pill capitalize transition-all flex-none ' +
                (active ? 'bg-mint shadow-soft' : 'hover:bg-mint/40')
              }
            >
              <span aria-hidden className="mr-1">{c.emoji}</span>
              {c.label}
              <span className="text-xs text-cocoa/60 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.ul
          layout
          className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((b, i) => {
            const onList = waitlist.has(b.id);
            return (
              <motion.li
                key={b.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.4 }}
              >
                <BreakfactCard b={b} onList={onList} onToggle={() => toggleWaitlist(b.id)} />
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

    </div>
  );
}

function BreakfactCard({
  b, onList, onToggle,
}: {
  b: Brainrot;
  onList: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="relative rounded-3xl overflow-hidden shadow-soft hover:shadow-lifted transition-all group h-full flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${b.accent}55 0%, ${b.accent}22 50%, var(--card) 100%)`,
        border: '1px solid rgba(244,236,220,0.9)',
      }}
    >
      <div className="p-5 sm:p-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,252,245,0.85)', color: '#3B2A22' }}
          >
            {b.category}
          </span>
          <span className="text-3xl sm:text-4xl" aria-hidden>{b.emoji}</span>
        </div>
        <h3 className="display text-display-md text-cocoa leading-tight mb-3 break-words">
          {b.hook}
        </h3>
        <p className="text-sm sm:text-base text-cocoa/85 leading-snug">{b.fact}</p>
        <p className="text-xs text-cocoa/65 mt-3 italic">→ {b.why}</p>
        {b.source && (
          <p className="text-[11px] text-cocoa/50 mt-2 font-mono break-all">
            src: {b.source}
          </p>
        )}
      </div>

      <div className="border-t border-cocoa/10 bg-eggshell/85 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-syrup font-bold text-base">
            {fmtPrice(DEFAULT_PRICE_CENTS)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-cocoa/60">
            {DEFAULT_FORMATS.join(' + ')}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={onList}
          className={
            'inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-bold transition-all min-h-[40px] ' +
            (onList
              ? 'bg-mint text-cocoa shadow-soft'
              : 'bg-cocoa text-eggshell hover:bg-syrup hover:text-cocoa')
          }
        >
          {onList ? '✓ On the list' : 'Notify me ✦'}
        </button>
      </div>
    </article>
  );
}
