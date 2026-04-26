'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { LATEST_CONTENT, type ContentCard } from '@/data/latest-content';
import { relativeTime } from '@/lib/utils';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function LatestContent() {
  // Hydrate with static seed first (instant paint), then swap in API data once it arrives.
  const [items, setItems] = useState<ContentCard[]>(LATEST_CONTENT.slice(0, 6));
  const { data } = useSWR<{ items: ContentCard[] }>('/api/youtube', fetcher, {
    refreshInterval: 30 * 60 * 1000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data?.items?.length) {
      // Mix YouTube auto-pull with TikTok statics, sort newest first
      const tiktoks = LATEST_CONTENT.filter((c) => c.platform === 'tiktok');
      const merged = [...data.items, ...tiktoks]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6);
      setItems(merged);
    }
  }, [data]);

  return (
    <section className="container-soft py-12 sm:py-16" aria-labelledby="latest-title">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 id="latest-title" className="display text-display-md text-cocoa">Latest from EMM</h2>
          <p className="text-cocoa/70 mt-1">Streams, fits, and breakfast moments — auto-pulled from the channel.</p>
        </div>
        <Link href="/watch" className="text-sm font-semibold text-syrup hover:underline">
          Watch all →
        </Link>
      </div>

      <div className="-mx-5 sm:mx-0 overflow-x-auto pb-2">
        <ul className="flex gap-4 px-5 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 min-w-max sm:min-w-0">
          {items.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="flex-none w-72 sm:w-auto"
            >
              <Link
                href={`/watch#${c.id}`}
                className="group block rounded-2xl bg-cream ring-1 ring-creamShade overflow-hidden shadow-soft transition-all hover:shadow-lifted hover:-translate-y-0.5"
              >
                <div className="relative aspect-video bg-creamShade">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {c.platform}
                  </span>
                  {c.duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-cocoa/85 text-eggshell px-1.5 py-0.5 text-xs font-mono">
                      {c.duration}
                    </span>
                  )}
                  <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity bg-cocoa/15">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-cocoa shadow-lifted">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-cocoa line-clamp-2">{c.title}</div>
                  <div className="text-xs text-muted mt-1">{relativeTime(c.publishedAt)} · {c.category}</div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
