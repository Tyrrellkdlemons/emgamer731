'use client';

import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/data/nav';

const PLATFORM_COPY = {
  youtube: {
    title: 'YouTube',
    sub: 'Long-form gameplay, fits, replays',
    accent: 'from-berry to-pancake',
    icon: (
      <svg width="32" height="22" viewBox="0 0 24 17" fill="none" aria-hidden>
        <path d="M23.5 2.6c-.3-1-1-1.8-2-2C19.5 0 12 0 12 0s-7.5 0-9.5.6c-1 .2-1.7 1-2 2C0 4.6 0 8.5 0 8.5s0 3.9.5 5.9c.3 1 1 1.8 2 2C4.5 17 12 17 12 17s7.5 0 9.5-.6c1-.2 1.7-1 2-2 .5-2 .5-5.9.5-5.9s0-3.9-.5-5.9z" fill="#3B2A22"/>
        <path d="M9.6 12.2V4.8L16 8.5l-6.4 3.7z" fill="#FFFCF5"/>
      </svg>
    ),
  },
  tiktok: {
    title: 'TikTok',
    sub: 'Quick takes, breakfast checks, fits',
    accent: 'from-mint to-sky',
    icon: (
      <svg width="22" height="26" viewBox="0 0 24 28" fill="none" aria-hidden>
        <path d="M16 0h4v5c1.5 1.5 3.5 2.5 5 2.5V12c-2 0-3.5-.5-5-1.5V19a8 8 0 11-8-8h1v4.5h-1a3.5 3.5 0 103.5 3.5V0z" fill="#3B2A22"/>
      </svg>
    ),
  },
} as const;

export function PlatformCards() {
  return (
    <section className="container-soft py-12 sm:py-16" aria-labelledby="platforms-title">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h2 id="platforms-title" className="display text-display-md text-cocoa">Where to find EMM</h2>
        <a href="/links" className="text-sm font-semibold text-syrup hover:underline">All links →</a>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SOCIAL_LINKS.map((s, i) => {
          const meta = PLATFORM_COPY[s.platform];
          return (
            <motion.a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              whileHover={{ y: -3 }}
              className={`group relative overflow-hidden rounded-3xl ring-1 ring-creamShade bg-gradient-to-br ${meta.accent} p-6 shadow-soft transition-shadow hover:shadow-lifted`}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cream ring-1 ring-creamShade">
                  {meta.icon}
                </div>
                <div>
                  <div className="display text-2xl text-cocoa">{meta.title}</div>
                  <div className="text-sm text-cocoa/80">{meta.sub}</div>
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cocoa">
                Open {meta.title} <span aria-hidden>→</span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
