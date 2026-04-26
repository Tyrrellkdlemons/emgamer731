'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FEATURED_PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/utils';

export function FeaturedMerch() {
  return (
    <section className="container-soft py-12 sm:py-16" aria-labelledby="featured-title">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 id="featured-title" className="display text-display-md text-cocoa">Spotlight merch</h2>
          <p className="text-cocoa/70 mt-1">Soft fits, breakfast graphics, big plate energy.</p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-syrup hover:underline">Browse all merch →</Link>
      </div>

      <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
        {FEATURED_PRODUCTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
            className="group rounded-3xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
          >
            <Link href={`/shop#${p.slug}`} className="block">
              <div className="relative aspect-square bg-creamShade overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.hero} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105" />
                {p.badge && (
                  <span className="absolute top-2 left-2 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="text-xs text-muted">{p.collection.replace(/-/g, ' ')}</div>
                <div className="font-semibold text-cocoa line-clamp-2 leading-tight">{p.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-syrup font-bold">{formatPrice(p.priceCents)}</div>
                  <div className="flex gap-1" aria-hidden>
                    {p.swatches.slice(0, 3).map((s) => (
                      <span key={s} className="h-3.5 w-3.5 rounded-full ring-1 ring-cocoa/10" style={{ background: s }} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
