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

const AUTODETECT_ENABLED = (process.