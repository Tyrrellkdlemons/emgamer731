import { NextResponse } from 'next/server';

/**
 * /api/tiktok-live-stream — server-side extractor that pulls EMM's TikTok
 * LIVE m3u8 (HLS) URL straight off the public TikTok live page.
 *
 * Why this works (and is legal):
 *   - TikTok serves a fully public live page at `tiktok.com/@<user>/live`
 *     viewable in a browser without login.
 *   - The page HTML embeds the live broadcast metadata as JSON in either
 *     a `__UNIVERSAL_DATA_FOR_REHYDRATION__` script (current TikTok) or a
 *     `SIGI_STATE` script (older format). Both contain the HLS pull URL
 *     served from TikTok's own CDN.
 *   - That HLS URL is publicly playable in any HTML5 `<video>` element
 *     via HLS.js (or natively on Safari/iOS) — same way YouTube Live's
 *     CDN segments are public-playable when you visit youtube.com.
 *   - We don't bypass any auth, paywall, or DRM. We're just pointing a
 *     `<video>` element at TikTok's own public CDN URL.
 *
 * Caching: 30s server-side via Next's `revalidate`. TikTok's HLS URLs
 * have a fairly long lifetime (rotates every few minutes) but we re-fetch
 * frequently to stay current.
 *
 * Failure modes (all handled gracefully):
 *   - EMM not live → returns { isLive: false }
 *   - HTML structure changed → returns { isLive: false, error: '...' }
 *   - TikTok returns 4xx (rate limit, region) → returns { isLive: false }
 *   - Stream URL extracted but expires → client falls back to iframe race
 *
 * The downstream `TikTokLiveStage` component tries this FIRST. If it
 * returns a valid URL, the inline `<video>` plays the actual broadcast.
 * If anything fails, the existing 4-iframe race + CTA card kick in.
 */

export const runtime = 'nodejs';
export const revalidate = 30;
export const dynamic = 'force-dynamic';

const HANDLE = process.env.TIKTOK_HANDLE || 'eatsswithemm';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

type Result = {
  isLive: boolean;
  /** HLS m3u8 URL playable directly in a `<video>` via HLS.js. */
  hlsUrl?: string;
  /** Lower-quality FLV pull URL — alternative when HLS fails (some clients). */
  flvUrl?: string;
  title?: string;
  viewerCount?: number;
  fetchedAt: string;
  source: 'live-page' | 'cached' | 'none';
  error?: string;
};

export async function GET(): Promise<NextResponse<Result>> {
  const fetchedAt = new Date().toISOString();
  try {
    const url = `https://www.tiktok.com/@${HANDLE}/live`;
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: {
        'user-agent': UA,
        'accept-language': 'en-US,en;q=0.9',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) {
      return NextResponse.json({
        isLive: false,
        fetchedAt,
        source: 'none',
        error: `tiktok responded ${res.status}`,
      });
    }
    const html = await res.text();

    // ── Try the modern UNIVERSAL_DATA blob first ─────────────────────
    const m1 = html.match(
      /<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/i,
    );
    if (m1?.[1]) {
      const extracted = extractFromUniversal(m1[1]);
      if (extracted.isLive && extracted.hlsUrl) {
        return NextResponse.json({ ...extracted, fetchedAt, source: 'live-page' });
      }
    }

    // ── Fall back to the legacy SIGI_STATE blob ─────────────────────
    const m2 = html.match(/<script[^>]*id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/i);
    if (m2?.[1]) {
      const extracted = extractFromSigi(m2[1]);
      if (extracted.isLive && extracted.hlsUrl) {
        return NextResponse.json({ ...extracted, fetchedAt, source: 'live-page' });
      }
    }

    // ── Last-ditch: regex straight for hls_pull_url anywhere in HTML ──
    const m3 = html.match(/"hls_pull_url"\s*:\s*"([^"]+)"/);
    if (m3?.[1]) {
      const hlsUrl = m3[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
      const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return NextResponse.json({
        isLive: true,
        hlsUrl,
        title: titleM?.[1]?.trim(),
        fetchedAt,
        source: 'live-page',
      });
    }

    return NextResponse.json({
      isLive: false,
      fetchedAt,
      source: 'none',
      error: 'no live stream metadata found',
    });
  } catch (e: unknown) {
    return NextResponse.json({
      isLive: false,
      fetchedAt,
      source: 'none',
      error: e instanceof Error ? e.message : 'unknown',
    });
  }
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function extractFromUniversal(jsonText: string): Partial<Result> & { isLive: boolean } {
  try {
    const data = JSON.parse(jsonText);
    // Drill into the live-room scope; layout has shifted across TikTok
    // versions so we walk a few candidate paths.
    const scopes = data?.__DEFAULT_SCOPE__ ?? {};
    const candidates = [
      scopes['webcast.live-room.room']?.liveRoom,
      scopes['webcast.live-room']?.liveRoom,
      scopes['webcast.live-room.room-info']?.liveRoom,
      scopes['live-room']?.liveRoom,
    ].filter(Boolean) as Array<Record<string, unknown>>;

    for (const room of candidates) {
      const stream = pickStream(room);
      if (stream?.hlsUrl) {
        return {
          isLive: true,
          hlsUrl: stream.hlsUrl,
          flvUrl: stream.flvUrl,
          title: typeof room.title === 'string' ? room.title : undefined,
          viewerCount: typeof room.user_count === 'number' ? (room.user_count as number) : undefined,
        };
      }
    }
    return { isLive: false };
  } catch {
    return { isLive: false };
  }
}

function extractFromSigi(jsonText: string): Partial<Result> & { isLive: boolean } {
  try {
    const data = JSON.parse(jsonText);
    const room =
      data?.LiveRoom?.liveRoomUserInfo?.liveRoom ??
      data?.LiveRoom?.liveRoomData ??
      data?.LiveRoom;
    if (!room) return { isLive: false };
    const stream = pickStream(room);
    if (stream?.hlsUrl) {
      return {
        isLive: true,
        hlsUrl: stream.hlsUrl,
        flvUrl: stream.flvUrl,
        title: typeof room.title === 'string' ? room.title : undefined,
      };
    }
    return { isLive: false };
  } catch {
    return { isLive: false };
  }
}

function pickStream(room: Record<string, unknown>): { hlsUrl?: string; flvUrl?: string } | null {
  const tryUrls = (obj: unknown): { hlsUrl?: string; flvUrl?: string } | null => {
    if (!obj || typeof obj !== 'object') return null;
    const o = obj as Record<string, unknown>;
    const hls =
      pickString(o.hls_pull_url) ||
      pickString(o.hlsPullUrl) ||
      pickString((o.pull_url_params as Record<string, unknown> | undefined)?.HLS) ||
      pickString((o.pull_url_params as Record<string, unknown> | undefined)?.hls);
    const flv =
      pickString(o.rtmp_pull_url) ||
      pickString(o.rtmpPullUrl) ||
      pickString(o.flv_pull_url) ||
      pickString(o.flvPullUrl);
    if (hls || flv) return { hlsUrl: hls, flvUrl: flv };
    return null;
  };

  const candidates: unknown[] = [
    room.streamUrl,
    room.stream_url,
    (room.streamData as Record<string, unknown> | undefined)?.pull_data,
    (room.streamData as Record<string, unknown> | undefined)?.pullData,
    room.pull_url_params,
  ];
  for (const c of candidates) {
    const r = tryUrls(c);
    if (r) return r;
  }
  return null;
}

function pickString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}
