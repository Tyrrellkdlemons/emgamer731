'use client';

/**
 * VideoPlayer — inline embed for YouTube + TikTok.
 *
 * Performance: facade pattern — until the user clicks Play, only the thumbnail loads.
 * The heavy iframe is mounted ON DEMAND so the Watch grid stays light at first paint.
 *
 * Both YouTube + TikTok embed via native iframe (no SDK). Privacy-friendly (no cookies
 * until interaction; YouTube uses youtube-nocookie.com).
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  platform: 'youtube' | 'tiktok';
  embedId?: string;
  url: string;
  title: string;
  thumbnail?: string;
  className?: string;
};

export function VideoPlayer({ platform, embedId, url, title, thumbnail, className }: Props) {
  const [active, setActive] = useState(false);

  // Resolve embed src
  const src = (() => {
    if (!embedId) return null;
    if (platform === 'youtube') {
      return `https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return `https://www.tiktok.com/embed/v2/${embedId}`;
  })();

  if (!src) {
    // No embed id available — fall back to "open externally" card.
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={'block aspect-video rounded-2xl overflow-hidden bg-cocoa relative ' + (className ?? '')}
      >
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 grid place-items-center text-eggshell">
          <span className="rounded-full bg-eggshell text-cocoa px-4 py-2 text-sm font-semibold shadow-soft">
            Open on {platform === 'youtube' ? 'YouTube' : 'TikTok'} →
          </span>
        </div>
      </a>
    );
  }

  if (active) {
    return (
      <div className={'relative rounded-2xl overflow-hidden ring-1 ring-creamShade ' + (className ?? '') + ' ' + (platform === 'tiktok' ? 'aspect-[9/16] mx-auto max-w-[360px]' : 'aspect-video')}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play "${title}" on ${platform}`}
      className={
        'group relative block w-full overflow-hidden rounded-2xl ring-1 ring-creamShade bg-cocoa ' +
        (platform === 'tiktok' ? 'aspect-[9/16] mx-auto max-w-[360px]' : 'aspect-video') +
        ' ' + (className ?? '')
      }
    >
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-morning group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa/55 via-transparent to-transparent" />
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-cocoa text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
        {platform}
      </span>
      <motion.span
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="absolute inset-0 grid place-items-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-cream/95 text-cocoa shadow-lifted backdrop-blur">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </motion.span>
      <span className="absolute bottom-2 left-3 right-3 text-eggshell font-semibold drop-shadow line-clamp-2">
        {title}
      </span>
    </button>
  );
}
