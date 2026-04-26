'use client';

/**
 * ReplaysGrid — premium card row for the "Latest replays" section on /live.
 *
 * Goals (per creator):
 *   - "Make them make more sense and look waaay better."
 *   - Cards should look like a streaming-platform shelf (YouTube/Hulu vibe),
 *     not plain link tiles.
 *
 * Design:
 *   - Aspect-video thumbnail with a soft cream gradient bottom-fade so the
 *     duration chip + title strip read against any thumbnail color.
 *   - Centred play-button overlay that scales on hover.
 *   - Category badge (gameplay / live / fashion / breakfast) top-left;
 *     duration chip top-right.
 *   - Title + relative-time line below the thumbnail with a subtle
 *     hover-underline on the title for affordance.
 *   - Click → /watch#{id} (the inline VideoPlayer takes over there) so
 *     visitors don't get bounced off the site.
 *   - Stagger entry animation via framer-motion.
 *   - Filters out shorts (those have their own surface on the watch grid).
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { ContentCard } from '@/data/latest-content';
import { relativeTime } from '@/lib/utils';

const CATEGORY_CHIP: Record<ContentCard['category'], { label: string; bg: string; fg: string }> = {
  gameplay:  { label: 'GAMEPLAY',  bg: '#A8E6CF',           fg: '#0F3C2C' },
  live:      { label: 'LIVE',       bg: '#FF4757',           fg: '#FFFCF5' },
  fashion:   { label: 'FITS',       bg: '#FF9EC0',           fg: '#3B2A22' },
  breakfast: { label: 'BREAKFAST',  bg: '#FFD89C',           fg: '#3B2A22' },
  short:     { label: 'SHORT',      bg: '#E8A53C',           fg: '#FFFCF5' },
};

export function ReplaysGrid({ items }: { items: ContentCard[] }) {
  // Surface only full-length replays on the /live page — shorts live on /watch.
  const replays = useMemo(
    () => items.filter((c) => c.platform === 'youtube' && !c.isShort),
    [items],
  );

  if (replays.length === 0) {
    return (
      <p className="text-cocoa/70">No replays cached yet — check back after the next stream.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {replays.map((c, i) => {
        const chip = CATEGORY_CHIP[c.category] ?? CATEGORY_CHIP.gameplay;
        return (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="group rounded-3xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft hover:shadow-lifted transition-all"
          >
            <Link
              href={`/watch#${c.id}`}
              aria-label={`Watch "${c.title}"`}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-syrup"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-cocoa/5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.thumbnail}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105"
                />

                {/* Bottom fade so the title strip below pops over any thumbnail */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)',
                  }}
                />

                {/* Category chip — top-left */}
                <span
                  className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft"
                  style={{ background: chip.bg, color: chip.fg }}
                >
                  {chip.label}
                </span>

                {/* Duration chip — top-right */}
                {c.duration && (
                  <span className="absolute top-2 right-2 rounded bg-cocoa/85 text-eggshell px-1.5 py-0.5 text-xs font-mono">
                    {c.duration}
                  </span>
                )}

                {/* Centred play button — pops on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-eggshell/95 text-cocoa shadow-lifted backdrop-blur-sm transition-all duration-300 ease-morning group-hover:scale-110 group-hover:bg-eggshell">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>

              {/* Title strip */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-cocoa leading-tight line-clamp-2 group-hover:underline decoration-syrup decoration-2 underline-offset-2">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between gap-2 mt-2 text-xs">
                  <span className="text-cocoa/70">{relativeTime(c.publishedAt)}</span>
                  <span className="inline-flex items-center gap-1 text-syrup font-semibold">
                    Watch inline →
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
