'use client';

/**
 * YouTubeLiveBanner — top-of-/watch banner that flips to LIVE when EmGamer731's
 * YouTube channel is broadcasting. Re-uses the LiveStatusProvider polling so
 * /watch flips within ~60s of YT confirming the broadcast (provided
 * YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID env vars are set; otherwise the
 * adapter no-ops and this banner stays hidden).
 *
 * When live:
 *   - Big red live ring + pulsing dot
 *   - Inline VideoPlayer (facade pattern — only loads the embed iframe on click)
 *   - "Open on YouTube" fallback link
 *
 * When offline:
 *   - Renders nothing — the page just shows the replay grid below.
 */

import { useLiveStatus } from '@/components/live/LiveStatusProvider';
import { VideoPlayer } from '@/components/watch/VideoPlayer';

function extractYouTubeId(url: string): string | undefined {
  const m =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?&]+)/) ||
    url.match(/embed\/([^?&]+)/);
  return m?.[1];
}

export function YouTubeLiveBanner() {
  const { summary } = useLiveStatus();
  // Only surface when YouTube specifically is live (TikTok lives have their
  // own home for /live).
  const yt = summary?.all?.find((s) => s.platform === 'youtube' && s.isLive);
  if (!yt) return null;

  const embedId = extractYouTubeId(yt.watchUrl);
  return (
    <section
      role="region"
      aria-label="EMGamer731 is live on YouTube"
      aria-live="polite"
      className="mb-10 rounded-3xl border-2 border-liveRed/70 bg-gradient-to-br from-cream to-eggshell p-5 sm:p-6 shadow-lifted"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-liveRed text-white px-2.5 py-1 text-xs font-bold shadow-liveGlow">
          <span className="live-dot" aria-hidden /> LIVE on YOUTUBE
        </span>
        <span className="text-xs text-muted">— playing inline below</span>
      </div>
      <h2 className="display text-2xl sm:text-3xl text-cocoa leading-tight mb-4">
        {yt.title ?? 'EMM is live on YouTube — pull up'}
      </h2>
      <VideoPlayer
        platform="youtube"
        embedId={embedId}
        url={yt.watchUrl}
        title={yt.title ?? 'EMM live on YouTube'}
        thumbnail={yt.thumbnail}
      />
    </section>
  );
}
