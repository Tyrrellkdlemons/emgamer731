'use client';

/**
 * /lookbook — Premium visual archive (Breakfast Castle, Avatar Squad Wave,
 * Cozy Stream Room, Mint Hoodie, Wallpaper Berry Toast, Triple Waffle
 * Stack, Pink Waffle Hoodie, Squad Stickers, etc.).
 *
 * v1.6.3 routing rule (per creator):
 *   "create another page of the gallery separate from this that remodels
 *    this entire screenshot on page and doesnt conflict with the others
 *    — its own URL and more quality things."
 *
 * This is the ELEVATED version of the old /breakfacts visual gallery —
 * a "lookbook" treatment with a featured hero card, sharper typography,
 * a save/download affordance, hover lift, and a clean masonry layout
 * tuned for desktop AND mobile. Same `@/data/gallery` source so the
 * archive stays in sync.
 *
 * Distinct URL (`/lookbook`), distinct nav label ("Lookbook"). Doesn't
 * touch /gallery (Brainrot Figures) or /breakfacts (educational facts).
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY, GALLERY_FILTERS, type GalleryCategory } from '@/data/gallery';

export default function LookbookPage() {
  const [filter, setFilter] = useState<typeof GALLERY_FILTERS[number]>('all');

  const items = useMemo(() => {
    if (filter === 'all') return GALLERY;
    return GALLERY.filter((g) => g.category === (filter as GalleryCategory));
  }, [filter]);

  // Pull a "featured" item from the current filter for the hero card —
  // first non-overlay item with a hero/avatar/breakfast vibe.
  const featured = useMemo(() => {
    return items.find((g) => g.category === 'hero') ?? items[0] ?? null;
  }, [items]);

  // The rest of the grid (excluding featured)
  const rest = useMemo(() => {
    if (!featured) return items;
    return items.filter((g) => g.id !== featured.id);
  }, [items, featured]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-pancake/70 ring-1 ring-creamShade px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa shadow-soft">
          <span aria-hidden>📷</span> The Lookbook · visual archive
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          The whole vibe, in one feed.
        </h1>
        <p className="text-cocoa/85 mt-3">
          Avatar art, breakfast worlds, hoodie mockups, wallpapers, stickers,
          stream overlays — the eye-candy archive of the EMM cinematic universe.
          Tap any download chip to save the file directly.
        </p>
        <p className="text-sm text-cocoa/65 mt-2">
          Looking for something else?{' '}
          <a className="text-syrup font-semibold hover:underline" href="/gallery">
            Brainrot figures →
          </a>{' '}
          ·{' '}
          <a className="text-syrup font-semibold hover:underline" href="/breakfacts">
            67 educational drops →
          </a>
        </p>
      </header>

      {/* Category chips — slim, snap-scrollable on mobile */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="tablist"
        aria-label="Lookbook filter"
      >
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={
              'pill capitalize transition-all flex-none ' +
              (filter === f ? 'bg-mint shadow-soft' : 'hover:bg-mint/40')
            }
          >
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <p className="display text-2xl text-cocoa">
              Nothing here yet — the kitchen&apos;s still cooking.
            </p>
            <button onClick={() => setFilter('all')} className="btn-ghost mt-4">
              Reset filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* ── FEATURED CARD ── elevated, full-width on mobile, 2-col on desktop */}
            {featured && (
              <FeaturedCard item={featured} />
            )}

            {/* ── MASONRY GRID ── columns-based for natural-aspect-ratio art */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance] mt-6">
              {rest.map((g, i) => (
                <LookCard key={g.id} item={g} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturedCard({ item }: { item: typeof GALLERY[number] }) {
  return (
    <motion.figure
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="relative overflow-hidden rounded-3xl ring-1 ring-creamShade shadow-lifted bg-cream group mb-4"
    >
      <div className="grid sm:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3] sm:aspect-auto bg-creamShade overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="block w-full h-full object-cover transition-transform duration-700 ease-morning group-hover:scale-105"
          />
          {item.downloadable && (
            <a
              href={item.src}
              download
              className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-cocoa/90 text-eggshell px-3 py-1.5 text-xs font-bold shadow-soft hover:shadow-lifted transition-all"
            >
              ↓ Save full size
            </a>
          )}
        </div>
        <figcaption className="p-5 sm:p-7 flex flex-col justify-center bg-gradient-to-br from-cream to-eggshell">
          <span
            className="inline-flex items-center gap-1 rounded-full bg-pancake px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cocoa self-start mb-2"
          >
            ★ Featured · {item.category}
          </span>
          <h2 className="display text-display-md text-cocoa leading-tight">{item.title}</h2>
          <p className="text-sm text-cocoa/75 mt-2 capitalize">
            {item.tags.slice(0, 4).join(' · ')}
          </p>
          <div className="text-xs text-cocoa/60 mt-3 italic">
            Hero of the current filter — tap save for the high-res file.
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function LookCard({ item, index }: { item: typeof GALLERY[number]; index: number }) {
  return (
    <motion.figure
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index, 12) * 0.025, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden ring-1 ring-creamShade bg-cream shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
        {item.downloadable && (
          <a
            href={item.src}
            download
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-cocoa/85 text-eggshell px-2.5 py-1 text-xs font-semibold opacity-0 group-hover:opacity-100 sm:opacity-90 transition-opacity"
          >
            ↓ Save
          </a>
        )}
      </div>
      <figcaption className="px-3 py-2.5">
        <div className="text-sm font-extrabold text-cocoa leading-tight">{item.title}</div>
        <div className="text-xs text-cocoa/60 capitalize mt-0.5">
          {item.category} · {item.tags.slice(0, 2).join(' · ')}
        </div>
      </figcaption>
    </motion.figure>
  );
}
