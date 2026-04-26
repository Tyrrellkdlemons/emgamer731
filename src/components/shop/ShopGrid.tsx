'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, ProductCategory } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const CATEGORIES: Array<{ id: ProductCategory | 'all'; label: string }> = [
  { id: 'all',         label: 'All' },
  { id: 'hoodies',     label: 'Hoodies' },
  { id: 'tees',        label: 'Tees' },
  { id: 'crewnecks',   label: 'Crewnecks' },
  { id: 'sweatpants',  label: 'Sweats' },
  { id: 'hats',        label: 'Hats' },
  { id: 'bags',        label: 'Bags' },
  { id: 'cases',       label: 'Cases' },
  { id: 'drinkware',   label: 'Drinkware' },
  { id: 'home',        label: 'Home + desk' },
  { id: 'plush',       label: 'Plush' },
  { id: 'pins',        label: 'Pins' },
  { id: 'stickers',    label: 'Stickers' },
  { id: 'digital',     label: 'Digital' },
];

export function ShopGrid({ products }: { products: Product[] }) {
  const [cat, setCat] = useState<typeof CATEGORIES[number]['id']>('all');

  const filtered = useMemo(
    () => (cat === 'all' ? products : products.filter((p) => p.category === cat)),
    [cat, products],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`pill ${cat === c.id ? 'bg-mint shadow-soft' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <motion.article
              layout
              key={p.id}
              id={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="group rounded-3xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
            >
              <div className="relative aspect-square bg-creamShade overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.hero} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105" />
                {p.badge && (
                  <span className="absolute top-2 left-2 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
                {p.priceCents === 0 && (
                  <span className="absolute top-2 right-2 rounded-full bg-success text-cocoa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    free
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="text-xs text-muted capitalize">{p.collection.replace(/-/g, ' ')}</div>
                <div className="font-semibold text-cocoa leading-tight line-clamp-2">{p.name}</div>
                <p className="text-xs text-cocoa/70 mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-syrup font-bold">{p.priceCents === 0 ? 'Free' : formatPrice(p.priceCents)}</div>
                  <div className="flex gap-1" aria-hidden>
                    {p.swatches.slice(0, 4).map((s) => (
                      <span key={s} className="h-3.5 w-3.5 rounded-full ring-1 ring-cocoa/10" style={{ background: s }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
