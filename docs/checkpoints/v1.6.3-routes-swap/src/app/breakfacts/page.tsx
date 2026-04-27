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
          Brainrot, but it makes you smarter.
        </h1>
        <p className="text-cocoa/85 mt-3">
          67 actually-extraordinary facts across <strong>culture, physics, tech, psychology, math,
          biology, philosophy, music, economics, history, and art</strong> — packaged in
          meme-shaped cards so the squad reads them. Same dopamine hit, real learning underneath.
        </p>
        <p className="text-sm text-cocoa/70 mt-2">
          Each brainrot drops as a <strong>sticker + lock-screen wallpaper</strong> bundle.
          Tap <em>Notify me</em> to claim a spot on the waitlist — checkout opens with v2.
        </p>
        <p className="text-sm text-cocoa/65 mt-2">
          Want the collectible <strong>figures</strong> instead? Those live on{' '}
          <a className="text-syrup font-semibold hover:underline" href="/gallery">
            /gallery (Brainrots)
          </a>.
        </p>
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
  