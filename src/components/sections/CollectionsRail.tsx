'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLLECTIONS } from '@/data/collections';

export function CollectionsRail() {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="collections-title">
      <div className="container-soft flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 id="collections-title" className="display text-display-md text-cocoa">Breakfast collections · the rotation</h2>
          <p className="text-cocoa/70 mt-1">Ten worlds. One breakfast HQ. Each drop ate, fr.</p>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-syrup hover:underline">All merch →</Link>
      </div>

      <div className="overflow-x-auto pb-3">
        <ul className="container-soft flex gap-4 min-w-max">
          {COLLECTIONS.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.45 }}
              className="w-64 flex-none"
            >
              <Link
                href={`/collections/${c.id}`}
                className="group block h-full rounded-3xl ring-1 ring-creamShade overflow-hidden shadow-soft transition-all hover:shadow-lifted hover:-translate-y-0.5"
                style={{ background: `linear-gradient(160deg, ${c.accent}55, var(--card))` }}
              >
                <div className="aspect-[4/3] grid place-items-center text-7xl">{c.icon}</div>
                <div className="p-4">
                  <div className="display text-xl text-cocoa">{c.name}</div>
                  <div className="text-sm text-cocoa/70 mt-1">{c.tagline}</div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
