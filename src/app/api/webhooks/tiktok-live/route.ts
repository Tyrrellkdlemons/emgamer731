import { NextResponse, type NextRequest } from 'next/server';
import { setTikTokLive, clearTikTokLive } from '@/lib/live-status/tiktok-store';

export const runtime = 'nodejs';

/**
 * POST /api/webhooks/tiktok-live
 *
 * Receives TikTok Live for Business / TikTok Studio webhook events. Verifies the
 * shared secret in the `X-EMG731-Webhook-Secret` header (or `?secret=` query for
 * easy testing) and updates the in-memory store that the live adapter reads.
 *
 * Expected JSON body shapes (we tolerate either):
 *   { "event": "live.start", "title": "...", "url": "..." }
 *   { "event": "live.end" }
 *   { "isLive": true|false, "title": "...", "url": "..." }
 *
 * Configure on the TikTok side:
 *   URL:    https://emgamer731.com/api/webhooks/tiktok-live
 *   Header: X-EMG731-Webhook-Secret: <TIKTOK_WEBHOOK_SECRET>
 */

const HANDLE = process.env.TIKTOK_HANDLE || 'eatsswithemm';
const SECRET = process.env.TIKTOK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // 1. Verify secret
  if (!SECRET) {
    return NextResponse.json({ ok: false, error: 'TIKTOK_WEBHOOK_SECRET not configured' }, { status: 503 });
  }
  const headerSecret = req.headers.get('x-emg731-webhook-secret');
  const querySecret = new URL(req.url).searchParams.get('secret');
  if (headerSecret !== SECRET && querySecret !== SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // 2. Parse body (defensive)
  let body: Record<string, unknown> = {};
  try { body = (await req.json()) as Record<string, unknown>; } catch { /* tolerate empty */ }

  const event = String(body.event ?? '');
  const isLive = event === 'live.start' || body.isLive === true;
  const watchUrl = typeof body.url === 'string' ? body.url : undefined;
  const title = typeof body.title === 'string' ? body.title : undefined;

  // 3. Apply
  if (isLive) {
    setTikTokLive({
      handle: HANDLE,
      isLive: true,
      title,
      watchUrl,
      startedAt: new Date().toISOString(),
      source: 'webhook',
    });
    return NextResponse.json({ ok: true, action: 'live-on', handle: HANDLE });
  } else {
    clearTikTokLive(HANDLE);
    return NextResponse.json({ ok: true, action: 'live-off', handle: HANDLE });
  }
}

// GET = health check
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(SECRET),
    handle: HANDLE,
    note: 'POST events here from TikTok Live for Business / TikTok Studio.',
  });
}
