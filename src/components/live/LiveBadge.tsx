'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { LiveSummary } from '@/lib/live-status';
import { cn } from '@/lib/utils';

export function LiveBadge({ summary, compact = false, className }: { summary?: LiveSummary; compact?: boolean; className?: string }) {
  const isLive = !!summary?.isLive;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLive ? 'live' : 'off'}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
        className={cn('inline-flex items-center', className)}
      >
        {isLive ? (
          // v1.6.8 — link to OUR /live route (inline player) instead of
          // the external TikTok URL. The toast-framed inline video plays
          // there and visitors stay on emgamer731.netlify.app.
          <Link
            href="/live"
            className={cn(
              'inline-flex items-center gap-2 rounded-full font-semibold text-white shadow-liveGlow transition-transform hover:scale-105 active:scale-95',
              compact ? 'px-3 py-1.5 text-xs' : 'px-5 py-3 text-sm',
            )}
            style={{ background: 'var(--live)' }}
            aria-label={`EMM is live on ${summary?.primary?.platform ?? 'stream'} — watch inline`}
          >
            <span className="live-dot" aria-hidden />
            <span>{compact ? 'LIVE' : `LIVE on ${summary?.primary?.platform?.toUpperCase()} — watch →`}</span>
            {!compact && summary?.primary?.title && (
              <span className="hidden md:inline opacity-80">— {truncate(summary.primary.title, 40)}</span>
            )}
          </Link>
        ) : (
          <Link
            href="/live"
            className={cn(
              'inline-flex items-center gap-2 rounded-full ring-1 ring-creamShade bg-cream text-cocoa/80 transition-colors hover:bg-mint hover:text-cocoa',
              compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm font-medium',
            )}
          >
            <span className="h-2 w-2 rounded-full bg-muted" aria-hidden />
            <span>{compact ? 'Off' : "EMM's offline — see schedule"}</span>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
