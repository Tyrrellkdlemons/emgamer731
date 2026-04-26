import type { LiveAdapter, LiveStatus } from './types';
import { getTikTokLive } from './tiktok-store';

const HANDLE = process.env.TIKTOK_HANDLE || 'eatsswithemm';

/**
 * TikTok live adapter — primary live channel for Roblox streams.
 *
 * Resolution priority:
 *   1. Webhook-set status (POST /api/webhooks/tiktok-live from TikTok Live for Business)
 *   2. Admin override (POST /api/admin/live-override with bearer secret)
 *   3. Env-var manual override (`MANUAL_LIVE_OVERRIDE=true` + `MANUAL_LIVE_PLATFORM=tiktok`)
 *   4. Offline fallback with link to /@<handle>/live
 *
 * The site polls /api/live every 60s; once any of these fires the LiveHero swaps to
 * the inline embed within ~60s.
 */
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
        source: stored.source ===