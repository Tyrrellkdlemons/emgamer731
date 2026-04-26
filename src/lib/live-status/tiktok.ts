import type { LiveAdapter, LiveStatus } from './types';
import { getTikTokLive } from './tiktok-store';

const HANDLE = process.env.TIKTOK_HANDLE || 'eatsswithemm';

/**
 * TikTok live adapter — primary live channel for Roblox streams.
 *
 * Resolution priority (each tier returns immediately if it resolves to LIVE):
 *   1. Webhook-set status (POST /api/webhooks/tiktok-live from TikTok Live
 *      for Business). This is the authoritative source — fastest, no
 *      latency, no rate limits. Recommended setup for production.
 *   2. Admin override (POST /api/admin/live-override with bearer secret).
 *      Used by the in-product admin button when TKDL goes live without a
 *      webhook configured.
 *   3. Env-var manual override (`MANUAL_LIVE_OVERRIDE=true` +
 *      `MANUAL_LIVE_PLATFORM=tiktok`). Legacy.
 *   4. Best-effort HTML detection — fetches `tiktok.com/@<handle>/live`
 *      and looks for live-room markers in the response. Skipped if
 *      `TIKTOK_AUTODETECT=false`. Cached for 30s server-side via revalidate
 *      so we don't hammer TikTok.
 *   5. Offline fallback with link to /@<handle>/live.
 *
 * The site polls /api/live every 60s; once any of these fires the LiveHero
 * swaps to the inline embed within ~60s.
 */

const AUTODETECT_ENABLED = (process.env.TIKTOK_AUTODETECT ?? 'true') === 'true';

/**
 * Best-effort scrape of the public live room. Returns title + true if the
 * page renders the live-room shell (which only appears for an active stream).
 * Returns false on any error — never throws so the resolver can fall through.
 */
async function detectLiveByScrape(): Promise<{ live: boolean; title?: string }> {
  if (!AUTODETECT_ENABLED) return { live: false };
  try {
    const res = await fetch(`https://www.tiktok.com/@${HANDLE}/live`, {
      // 30s edge cache to avoid hammering TikTok across page views
      next: { revalidate: 30 },
      headers: {
        // Use a real-browser UA — bare fetches get a 403 from TikTok edge
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return { live: false };
    const html = await res.text();

    // Live rooms include these markers; non-live profile redirects do not.
    // We look for several so a single TikTok markup change doesn't kill it.
    const liveMarkers = [
      '"liveRoom":',
      '"isLive":true',
      '"status":2',          // status==2 means broadcasting in many TikTok payloads
      'class="live-room"',
      'data-e2e="live-room',
    ];
    const matched = liveMarkers.some((m) => html.includes(m));
    if (!matched) return { live: false };

    // Best-effort title extract — the live page sets <title>.
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const rawTitle = titleMatch?.[1]?.trim();
    return {
      live: true,
      title: rawTitle && rawTitle.length < 140 ? rawTitle : undefined,
    };
  } catch {
    return { live: false };
  }
}

export const tiktokAdapter: LiveAdapter = {
  id: 'tiktok',
  enabled: true,
  async fetch(): Promise<LiveStatus> {
    const watchUrl = `https://www.tiktok.com/@${HANDLE}/live`;

    // 1. Webhook / admin store (preferred — authoritative)
    const stored = getTikTokLive(HANDLE);
    if (stored?.isLive) {
      return {
        platform: 'tiktok',
        isLive: true,
        title: stored.title ?? 'EMM is live on TikTok',
        watchUrl: stored.watchUrl ?? watchUrl,
        startedAt: stored.startedAt,
        fetchedAt: new Date().toISOString(),
        source: stored.source === 'webhook' ? 'webhook' : 'manual',
      };
    }

    // 2. Env-var manual override (legacy, still supported)
    if (
      process.env.MANUAL_LIVE_OVERRIDE === 'true' &&
      (process.env.MANUAL_LIVE_PLATFORM ?? 'tiktok') === 'tiktok'
    ) {
      return {
        platform: 'tiktok',
        isLive: true,
        title: process.env.MANUAL_LIVE_TITLE ?? 'EMM is live on TikTok',
        watchUrl: process.env.MANUAL_LIVE_URL ?? watchUrl,
        fetchedAt: new Date().toISOString(),
        source: 'manual',
      };
    }

    // 3. Best-effort HTML scrape — covers the case where the creator just
    //    starts a live without firing the webhook or admin override. The
    //    site flips to LIVE within ~60s of TikTok's edge cache catching up.
    const auto = await detectLiveByScrape();
    if (auto.live) {
      return {
        platform: 'tiktok',
        isLive: true,
        title: auto.title ?? 'EMM is live on TikTok',
        watchUrl,
        fetchedAt: new Date().toISOString(),
        source: 'autodetect',
      };
    }

    // 4. Offline
    return {
      platform: 'tiktok',
      isLive: false,
      watchUrl,
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    };
  },
};
