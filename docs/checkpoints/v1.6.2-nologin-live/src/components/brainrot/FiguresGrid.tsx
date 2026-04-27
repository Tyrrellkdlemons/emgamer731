'use client';

/**
 * FiguresGrid — sellable 67-brainrot collectible figures grid.
 *
 * Each figure is a real photo (Roblox avatar render or chibi mascot art),
 * served as WebP for a tiny payload. Three states per card:
 *   1. UNLOCKED — visitor already owns it (free or paid). Show download CTA
 *      placeholder ("Download bundle" — pipeline-ready).
 *   2. CREDIT-AFFORDABLE — visitor has >=1 credit AND figure rarity allows
 *      free unlock. One-tap "Unlock free" button.
 *   3. PAID — open BuyMethodSheet with all four payment methods.
 *
 * Performance:
 *   - <picture> with WebP source + JPG fallback per card.
 *   - `loading="lazy"` and `decoding="async"` — only the first row paints
 *     immediately.
 *   - Stagger entry animations capped at the first 8 to avoid lag.
 */

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BRAINROT_FIGURES,
  FIGURE_FAMILIES,
  RARITY_PRICE,
  figureImagePath,
  type BrainrotFigure,
  type FigureFamily,
  type FigureRarity,
} from '@/data/brainrot-figures';
import {
  readUnlocks,
  spendUnlock,
  subscribeUnlocks,
  type UnlockState,
} from '@/lib/unlock-store';
import { BuyMethodSheet } from './BuyMethodSheet';
import { SubscribeUnlockPanel } from './SubscribeUnlockPanel';

type FamilyFilter = 'all' | FigureFamily;

const RARITY_ORDER: Record<FigureRarity, number> = { common: 0, rare: 1, limited: 2, mythic: 3 };

export function FiguresGrid() {
  const [filter, setFilter] = useState<FamilyFilter>('all');
  const [state, setState] = useState<UnlockState>(() => readUnlocks());
  const [active, setActive] = useState<BrainrotFigure | null>(null);

  useEffect(() => subscribeUnlocks(setState), []);

  const items = useMemo(() => {
    const base = filter === 'all'
      ? BRAINROT_FIGURES
      : BRAINROT_FIGURES.filter((f) => f.family === filter);
    // Sort by rarity asc so common (most affordable) reads first
    return [...base].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  }, [filter]);

  return (
    <section aria-labelledby="figures-title" className="mt-10">
      {/* Subscribe + watch unlock funnel — promoted hard at the top */}
      <SubscribeUnlockPanel />

      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 id="figures-title" className="display text-display-md text-cocoa">
            67 Brainrot Figures · drops + unlocks
          </h2>
          <p className="text-cocoa/70 text-sm mt-1">
            Collect the squad. Buy with Robux, card, or PayPal — or unlock free with credits earned by subscribing + watching.
          </p>
        </div>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Figure family">
          <FamilyChip value="all"  active={filter === 'all'}  onClick={() => setFilter('all')} label="All" count={BRAINROT_FIGURES.length} />
          {FIGURE_FAMILIES.map((f) => (
            <FamilyChip
              key={f.id}
              value={f.id}
              active={filter === f.id}
              onClick={() => setFilter(f.id)}
              label={`${f.emoji} ${f.label}`}
              count={BRAINROT_FIGURES.filter((x) => x.family === f.id).length}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.ul
          layout
          className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {items.map((fig, i) => (
            <motion.li
              key={fig.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.4 }}
            >
              <FigureCard
                fig={fig}
                state={state}
                onBuy={() => setActive(fig)}
                onUnlockFree={() => {
                  const r = spendUnlock(fig.id);
                  setState(r.state);
                }}
              />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <BuyMethodSheet
            figure={active}
            onClose={() => setActive(null)}
            onChooseFree={() => {
              setActive(null);
              // Smooth-scroll up to the funnel panel so they see how to earn.
              setTimeout(() => {
                document.getElementById('figures-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FamilyChip({
  value, label, count, active, onClick,
}: {
  value: FamilyFilter; label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-value={value}
      className={
        'pill flex-none transition-all ' + (active ? 'bg-mint shadow-soft' : 'hover:bg-mint/40')
      }
    >
      {label} <span className="text-xs text-cocoa/60 ml-1">({count})</span>
    </button>
  );
}

function FigureCard({
  fig, state, onBuy, onUnlockFree,
}: {
  fig: BrainrotFigure;
  state: UnlockState;
  onBuy: () => void;
  onUnlockFree: () => void;
}) {
  const owned = state.unlocked.includes(fig.id);
  const rarity = RARITY_PRICE[fig.rarity];
  // Free-unlock only allowed for common + rare (limited/mythic require purchase)
  const canFreeUnlock =
    !owned && state.credits >= 1 && (fig.rarity === 'common' || fig.rarity === 'rare');

  return (
    <article
      className="group relative rounded-3xl overflow-hidden bg-cream ring-1 ring-creamShade shadow-soft hover:shadow-lifted transition-all h-full flex flex-col"
      style={{ borderColor: rarity.ring }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${fig.accent}55 0%, ${fig.accent}22 50%, var(--card) 100%)`,
        }}
      >
        <picture>
          <source srcSet={figureImagePath(fig, 'webp')} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={figureImagePath(fig, 'jpg')}
            alt={fig.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105"
          />
        </picture>

        {/* Rarity chip */}
        <span
          className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft"
          style={{ background: rarity.ring, color: '#FFFCF5' }}
        >
          {rarity.label}
        </span>

        {/* Owned ribbon */}
        {owned && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-mint text-cocoa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft">
            ✓ OWNED
          </span>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-extrabold text-cocoa leading-tight text-sm sm:text-base line-clamp-1">
          {fig.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-cocoa/65 mt-0.5 line-clamp-2 flex-1">
          {fig.tagline}
        </p>

        {/* Footer: price/Robux + CTA */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {owned ? (
            <a
              href="#"
              className="w-full text-center rounded-full bg-mint text-cocoa px-3 py-2 text-xs font-bold shadow-soft hover:shadow-lifted transition-all"
              onClick={(e) => e.preventDefault()}
            >
              Download bundle ↓
            </a>
          ) : canFreeUnlock ? (
            <button
              type="button"
              onClick={onUnlockFree}
              className="w-full rounded-full bg-syrup text-cocoa px-3 py-2 text-xs font-extrabold shadow-soft hover:shadow-lifted transition-all"
            >
              Unlock FREE · 1 credit
            </button>
          ) : (
            <button
              type="button"
              onClick={onBuy}
              className="w-full rounded-full bg-cocoa text-eggshell hover:bg-syrup hover:text-cocoa px-3 py-2 text-xs font-extrabold shadow-soft transition-all flex items-center justify-between"
            >
              <span>${(fig.priceCents / 100).toFixed(2)}</span>
              <span className="text-[10px] opacity-80">{fig.priceRobux} R$</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
