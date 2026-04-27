'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLiveStatus } from './LiveStatusProvider';
import { DualPlatformLivePlayer } from './DualPlatformLivePlayer';
import { ButterToastFrame } from './ButterToastFrame';
import { LikeAndSubscribeBar } from './LikeAndSubscribeBar';

export function LiveHero() {
  const { summary } = useLiveStatus();
  const live = summary?.primary;

  // v1.7.1: pop the inline player whenever EMM is live on ANY platform.
  // (Was Roblox-only in v1.6.4, but with Restream simulcast in place every
  // broadcast is meant to be watched — and TikTok's auto-generated title
  // "...is LIVE - TikTok LIVE" never contains "roblox" so the old gate
  // suppressed real streams. The DualPlatformLivePlayer + fallback chain
  // already handles every surface gracefully.)
  const isLiveNow = !!summary?.isLive && !!live;

  if (isLiveNow && live) {
    // Pick a SECONDARY live status if a different platform is also live —
    // NoLoginLivePlayer prefers YouTube (zero login wall) when both are up.
    const secondary = summary?.all?.find((s) => s.isLive && s.platform !== live.platform);

    // v1.7.5: collect ALL live platforms for the multi-pill row.
    // De-duped + ordered: YouTube first (cleanest no-login surface), TikTok second.
    const liveSet = new Map<string, typeof live>();
    if (live) liveSet.set(live.platform, live);
    summary?.all?.forEach((s) => { if (s.isLive) liveSet.set(s.platform, s); });
    const liveOrdered = ['youtube', 'tiktok', 'twitch', 'kick']
      .map((p) => liveSet.get(p))
      .filter(Boolean) as typeof summary.all;

    // v1.7.5: sanitize broken/junk titles. Sometimes the scrape returns
    // weird page titles ("__probe__", empty, "Log in", just whitespace, etc.).
    // If it looks junky, fall back to a friendly default.
    const safeTitle = sanitizeTitle(live.title);

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
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* v1.7.5: render ONE pill per actively-live platform. When EMM is
                  simulcasting via Restream, both YouTube + TikTok pills show. */}
              {liveOrdered.map((s) => (
                <span
                  key={s.platform}
                  className="inline-flex items-center gap-2 rounded-full text-white px-2.5 py-1 text-xs font-bold shadow-liveGlow"
                  style={{ background: platformColor(s.platform) }}
                >
                  <span className="live-dot" aria-hidden />
                  LIVE on {s.platform.toUpperCase()}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full bg-mint text-cocoa px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                ✓ no login needed
              </span>
              <span className="text-xs text-muted">
                {liveOrdered.length > 1 ? '— pick a platform below' : '— playing inline below'}
              </span>
            </div>
            <h2 className="display text-2xl sm:text-3xl text-cocoa leading-tight">
              {safeTitle}
            </h2>
          </div>
          {/* INLINE NO-LOGIN PLAYER wrapped in the BUTTER-TOAST frame —
              breakfast-themed, the live video plays as the "toast surface"
              with butter pat + animated syrup drips. v1.7.0: now uses
              DualPlatformLivePlayer so visitors can choose YouTube or TikTok
              when EMM is simulcasting both via Restream. */}
          <ButterToastFrame>
            <DualPlatformLivePlayer primary={live} secondary={secondary} />
          </ButterToastFrame>

          {/* Like + Subscribe bar — popup windows so visitors stay on-site */}
          <LikeAndSubscribeBar />
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

/* ── v1.7.5 helpers ───────────────────────────────────────────────── */

const FRIENDLY_DEFAULT_TITLE = 'EMM is live — pull up a chair, it’s giving stream era.';

/** Filter out scrape-junk titles. Returns the safe, friendly default if the
 *  title looks broken (probe artifacts, login walls, too short, etc.). */
function sanitizeTitle(t?: string): string {
  if (!t) return FRIENDLY_DEFAULT_TITLE;
  const trimmed = t.trim();
  if (trimmed.length < 5) return FRIENDLY_DEFAULT_TITLE;
  // Junk patterns we've actually seen in the wild
  const junkPatterns = [
    /^_+probe_+$/i,             // "__probe__" iframe leak
    /^probe[-_]/i,              // "probe-tt-direct"
    /^log\s*in/i,               // "Log in | TikTok" (login wall page)
    /^sign\s*in/i,
    /^untitled/i,
    /^new\s*tab/i,
  ];
  if (junkPatterns.some((rx) => rx.test(trimmed))) return FRIENDLY_DEFAULT_TITLE;
  return trimmed;
}

/** Brand-accurate accent color per live platform — used by the LIVE on X pills. */
function platformColor(platform: string): string {
  switch (platform) {
    case 'youtube': return '#FF0033';
    case 'tiktok':  return 'var(--live, #ff4757)';
    case 'twitch':  return '#9146FF';
    case 'kick':    return '#53FC18';
    default:        return 'var(--live, #ff4757)';
  }
}
