'use client';

/**
 * /gallery — flipped from "visual archive" to "67 BRAINROTS · educational drops".
 *
 * Editorial premise (per creator):
 *   "67 brainrots, extraordinary ones that deal with culture, physics, tech,
 *    psychology and all fields to more educate the children to change the
 *    frame structure of actual brainrot."
 *
 * Each card hits the dopamine of meme-shaped content while sneaking real
 * knowledge into the squad's daily scroll. Categories filter chips up top.
 *
 * MONETIZATION (per creator):
 *   "the brainrots will be monetization just as the merch — prep for that
 *    and put placeholders where needed."
 * Each card displays a price + collectible format (Sticker + Wallpaper)
 * with a "NOTIFY ME" CTA that will be wired to a real product/Stripe SKU
 * pipeline in v2. For now it stores the user's interest in a sessionStorage
 * waitlist so we don't lose intent before launch.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BRAINROTS,
  BRAINROT_CATEGORIES,
  type Brainrot,
  type BrainrotCategory,
} from '@/data/brainrots';
import { FiguresGrid } from '@/components/brainrot/FiguresGrid';

// ─── Monetization defaults ────────────────────────────────────────
const DEFAULT_PRICE_CENTS = 199; // $1.99 per drop
const DEFAULT_FORMATS = ['Sticker', 'Wallpaper'];

function fmtPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

// Privacy-first session waitlist — stays in the browser only.
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

export default function BrainrotsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [waitlist, toggleWaitlist] = useWaitlist();

  const items = useMemo(() => {
    if (filter === 'all') return BRAINROTS;
    return BRAINROTS.filter((b) => b.category === filter);
  }, [filter]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-pancake/60 ring-1 ring-creamShade px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa shadow-soft">
          <span aria-hidden>🧠</span> 67 Brainrots · educational drops
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          Brainrot, but it makes you smarter.
        </h1>
        <p className="text-cocoa/80 mt-3">
          67 actually-extraordinary facts acr