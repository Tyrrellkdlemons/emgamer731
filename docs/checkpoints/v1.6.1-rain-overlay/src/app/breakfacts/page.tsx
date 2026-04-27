'use client';

/**
 * /breakfacts — formerly /gallery. Same masonry visual archive of avatar
 * art, breakfast worlds, merch mockups, wallpapers, stickers and overlays
 * — re-framed under the "Breakfacts" wordplay banner.
 *
 * Why move it: /gallery is now the educational 67 brainrots + figures
 * shop. This page keeps the original visual archive intact and gives it a
 * smarter on-brand wrapper. Same data source (`@/data/gallery`), same
 * filter chips, same masonry layout, same download affordance — just a
 * sharper introduction so the page reads as part of the educational arm
 * of the site.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY, GALLERY_FILTERS, type GalleryCategory } from '@/data/gallery';

export default function BreakfactsPage() {
  const [filter, setFilter] = useState<typeof GALLERY_FILTERS[number]>('all');

  const items = useMemo(() => {
    if (filter === 'all') return GALLERY;
    return GALLERY.filter((g) => g.category === (filter as GalleryCategory));
  }, [filter]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint/70 ring-1 ring-creamShade px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa shadow-soft">
          <span aria-hidden>🥯</span> Breakfacts · brunch the brain
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          Breakfacts.
        </h1>
        <p className="text-cocoa/80 mt-3">
          The visual archive — avatar art, breakfast worlds, merch mockups,
          wallpapers, stickers, overlays. Same vibe as the brainrots, but
          the eye-candy version. Tap to save anything marked downloadable.
        </p>
        <p className="text-sm text-cocoa/65 mt-2">
          Looking for the educational drops? Those live on{' '}
          <a className="text-syrup font-semibold hover:underline" href="/gallery">/gallery</a>{' '}
          (the 67 Brainrots).
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Breakfacts filter">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`pill capitalize transition-all ${filter === f ? 'bg-mint shadow-soft' : 'hover:bg-mint/40'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 text-cocoa/70"
          >
            <p className="display text-2xl text-cocoa">
              Nothing here yet — but the kitchen&apos;s still cooking.
            </p>
            <button onClick={() => setFilter('all')} className="btn-ghost mt-4">
              Reset filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]"
          >
            {items.map((g) => (
              <motion.figure
                layout
                key={g.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="mb-4 break-inside-avoid rounded-2xl overflow-hidden ring-1 ring-creamShade bg-cream shadow-soft"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={g.title} className="block w-full h-auto" />
                  {g.downloadable && (
                    <a
                      href={g.src}
                      download
                      className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-cocoa/85 text-eggshell px-2.5 py-1 text-xs font-semibold"
                    >
                      ↓ Save
                    </a>
                  )}
                </div>
                <figcaption className="px-3 py-2">
                  <div className="text-sm font-semibold text-cocoa">{g.title}</div>
                  <div className="text-xs text-muted capitalize">
                    {g.category} · {g.tags.slice(0, 2).join(' · ')}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
