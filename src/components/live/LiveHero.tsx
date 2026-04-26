'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLiveStatus } from './LiveStatusProvider';
import { VideoPlayer } from '@/components/watch/VideoPlayer';

function extractYouTubeId(url: string): string | undefined {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/embed\/([^?&]+)/);
  return m?.[1];
}

export function LiveHero() {
  const { summary } = useLiveStatus();
  const live = summary?.primary;

  if (summary?.isLive && live) {
    const embedId = live.platform === 'youtube' ? extractYouTubeId(live.watchUrl) : undefined;
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-3xl border-2 border-liveRed/60 bg-gradient-to-br from-cream to-eggshell p-5 sm:p-6 shadow-lifted"
        role="region"
        aria-live="polite"
        aria-label="Live stream banner"
      >
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-liveRed text-white px-2.5 py-1 text-xs font-bold shadow-liveGlow">
                <span className="live-dot" aria-hidden /> LIVE on {live.platform.toUpperCase()}
              </span>
              <span className="text-xs text-muted">— playing inline below</span>
            </div>
            <h2 className="display text-2xl sm:text-3xl text-cocoa leading-tight">
              {live.title ?? 'EMM is live — pull up a chair, it’s giving stream era.'}
            </h2>
          </div>
          {/* INLINE PLAYER — no leaving the site */}
          <VideoPlayer
            platform={live.platform === 'tiktok' ? 'tiktok' : 'youtube'}
            embedId={embedId}
            url={live.watchUrl}
            title={live.title ?? 'EMM is live'}
            thumbnail={live.thumbnail}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        <div className="text-sm font-semibold text-cocoa">EMM is offline rn — touching grass</div>
      </div>
      <p className="text-cocoa/70 mt-2">
        Roblox lives are mostly on{' '}
        <a href="https://www.tiktok.com/@eatsswithemm/live" target="_blank" rel="noopener noreferrer" className="text-syrup font-semibold hover:underline">
          TikTok @eatsswithemm
        </a>
        . The banner above flips red the moment a stream starts — you&apos;ll be able to watch it inline right here, no cap.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/schedule" className="btn-primary">See the sched (sigma drop)</Link>
        <Link href="/watch" className="btn-ghost">Latest replay · she ate</Link>
        <Link href="/eats" className="btn-ghost">Today&apos;s eats · bussin</Link>
      </div>
    </motion.div>
  );
}
