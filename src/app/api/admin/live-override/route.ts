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

const HANDLE = process.env.TIKTOK_HANDLE || 'eatsswithemm';

/**
 * v1.6.8 — sane default secret so the admin works out of the box even
 * if the env var was registered on Netlify but never given a value
 * (the empty-value bug we hit in v1.6.7). TKDL can override by setting
 * `ADMIN_LIVE_SECRET` to anything she wants in Netlify → Site settings
 * → Environment. If she doesn't, the default below still works;
 * security cost is low because the worst an attacker can do is flip
 * the live banner on/off — no payment, no PII, no data loss.
 */
const DEFAULT_SECRET = 'gems';
const SECRET = (process.env.ADMIN_LIVE_SECRET ?? '').trim() || DEFAULT_SECRET;

function authed(req: NextRequest) {
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
  const usingDefault = SECRET === DEFAULT_SECRET;
  return NextResponse.json({
    ok: true,
    configured: true,
    usingDefault,
    note: usingDefault
      ? 'Using default token. Set ADMIN_LIVE_SECRET on Netlify env to override.'
      : 'Custom token from ADMIN_LIVE_SECRET env var is active.',
    hint: 'POST with bearer token to start, DELETE to stop.',
  });
}
