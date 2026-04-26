'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY, GALLERY_FILTERS, type GalleryCategory } from '@/data/gallery';

export default function GalleryPage() {
  const [filter, setFilter] = useState<typeof GALLERY_FILTERS[number]>('all');

  const items = useMemo(() => {
    if (filter === 'all') return GALLERY;
    return GALLERY.filter((g) => g.category === (filter as GalleryCategory));
  }, [filter]);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6">
        <h1 className="display text-display-lg text-cocoa">Gallery</h1>
        <p className="text-cocoa/70 mt-2">Avatar art, breakfast worlds, merch, wallpapers, stickers, overlays — the whole visual archive.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Gallery filter">
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
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 text-cocoa/70">
            <p className="display text-2xl text-cocoa">Nothing here yet — but the kitchen's still cooking.</p>
            <button onClick={() => setFilter('all')} className="btn-ghost mt-4">Reset filters</button>
          </motion.div>
        ) : (
          <motion.div layout className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
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
                    <a href={g.src} download className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-cocoa/85 text-eggshell px-2.5 py-1 text-xs font-semibold">
                      ↓ Save
                    </a>
                  )}
                </div>
                <figcaption className="px-3 py-2">
                  <div className="text-sm font-semibold text-cocoa">{g.title}</div>
                  <div className="text-xs text-muted capitalize">{g.category} · {g.tags.slice(0,2).join(' · ')}</div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
