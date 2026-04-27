'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AVATAR_FITS } from '@/data/avatar-fits';

export function AvatarFitsRail() {
  return (
    <section className="py-12 sm:py-16 relative" aria-labelledby="fits-title">
      <div className="container-soft flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 id="fits-title" className="display text-display-md text-cocoa">Avatar Fits</h2>
          <p className="text-cocoa/70 mt-1">
            Every era of EMM — from <strong>99 Nights survivor</strong> to <strong>Met Gala</strong> to brunch couture.
          </p>
        </div>
        <Link href="/gallery?filter=avatar" className="text-sm font-semibold text-syrup hover:underline">
          See all fits →
        </Link>
      </div>

      <div className="overflow-x-auto pb-3">
        <ul className="container-soft flex gap-4 min-w-max">
          {AVATAR_FITS.map((fit, i) => (
            <motion.li
              key={fit.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.4 }}
              className="w-56 flex-none"
            >
              <article className="group relative h-full rounded-3xl overflow-hidden ring-1 ring-creamShade shadow-soft transition-all hover:shadow-lifted hover:-translate-y-0.5 bg-cocoa">
                <div className="relative aspect-[2/3] bg-creamShade">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fit.src}
                    alt={fit.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105"
                    loading="lazy"
                  />
                  {fit.badge && (
                    <span className="absolute top-2 left-2 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {fit.badge}
                    </span>
                  )}
                  {fit.collection && (
                    <span className="absolute top-2 right-2 rounded-full bg-berry/90 text-cocoa px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {fit.collection}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-t from-cocoa via-cocoa/95 to-cocoa/85">
                  <div className="font-semibold text-eggshell text-sm leading-tight line-clamp-2">{fit.title}</div>
                  <div className="text-[11px] text-eggshell/70 mt-1 line-clamp-2 italic">{fit.vibe}</div>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
