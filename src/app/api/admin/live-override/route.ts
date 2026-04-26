import { NextResponse, type NextRequest } from 'next/server';
import { setTikTokLive, clearTikTokLive } from '@/lib/live-status/tiktok-store';

export const runtime = 'nodejs';

/**
 * Admin override — flip the live banner ON or OFF without TikTok webhook.
 *
 * POST  → turn on (body: { title?, url? })
 * DEL   → turn off
 *
 * Auth: bearer token matching ADMIN_LIVE_SECRET env var, OR ?secret= query param.
 *
 * Use cases:
 *   - You want to manually start the live banner before the TikTok stream actually goes live
 *   - The TikTok webhook hasn't fired and you want the banner up immediately
 *   - You're testing or doing a "fake live" event
 */

const HANDLE = process.env.TIKTOK_HANDLE ?? 'eatsswithemm';
const SECRET = process.env.ADMIN_LIVE_SECRET;

function authed(req: NextRequest) {
  if (!SECRET) return false;
  const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const q = new URL(req.url).searchParams.get('secret');
  return auth === SECRET || q === SECRET;
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  let body: Record<string, unknown> = {};
  try { body = (await req.json()) as Record<string, unknown>; } catch { /* allow empty */ }
  setTikTokLive({
    handle: HANDLE,
    isLive: true,
    title: typeof body.title === 'string' ? body.title : 'EMM is live on TikTok — Roblox',
    watchUrl: typeof body.url === 'string' ? body.url : undefined,
    startedAt: new Date().toISOString(),
    source: 'admin',
  });
  return NextResponse.json({ ok: true, action: 'live-on', handle: HANDLE });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  clearTikTokLive(HANDLE);
  return NextResponse.json({ ok: true, action: 'live-off', handle: HANDLE });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(SECRET),
    note: 'POST with bearer token to start, DELETE to stop. See docs/live-trigger.md',
  });
}
