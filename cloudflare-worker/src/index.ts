/**
 * EMGamer731 — TikTok Live Scraper (Cloudflare Worker)
 * v1.7.3
 *
 * Why this exists:
 *   The Next.js function at /api/tiktok-live-stream runs on Netlify and
 *   gets login-walled by TikTok's anti-bot most of the time. Cloudflare
 *   Workers run from CF's massive global edge with rotating IP pools,
 *   so the same scrape succeeds at a much higher rate. This Worker:
 *
 *     1. Picks a fresh User-Agent from a real-Chrome/Safari/Firefox pool
 *     2. Sends realistic Accept-Language + Sec-CH-UA + Referer headers
 *     3. Caches the result in CF cache for 60 s (stays under free tier)
 *     4. Returns JSON in the SAME SHAPE the site already expects
 *
 *   The site reads `process.env.TIKTOK_SCRAPER_WORKER_URL` — if set, it
 *   proxies through this Worker; otherwise it falls back to the existing
 *   Netlify function. Zero downtime, zero regression.
 *
 * Deploy:
 *   1.  npm install -g wrangler
 *   2.  cd cloudflare-worker && wrangler login
 *   3.  wrangler deploy
 *   4.  Copy the worker URL it prints (looks like
 *       https://emgamer731-tiktok-scraper.YOUR-SUBDOMAIN.workers.dev)
 *   5.  On Netlify → Site settings → Environment, add
 *       TIKTOK_SCRAPER_WORKER_URL = <that URL>
 *   6.  Trigger a deploy; the site now uses the worker
 *
 * Free tier: 100 000 requests/day. Site polls every 30 s = ~2 880/day per
 * tab. Realistic worst-case: 30 concurrent tabs = 86 400/day. Plenty.
 */

export interface Env {
  // No bindings required — pure fetch + edge cache.
  TIKTOK_HANDLE?: string;
}

const DEFAULT_HANDLE = 'eatsswithemm';

/** Real, current Chrome/Safari/Firefox UAs as of 2026 — rotated per request */
const USER_AGENTS = [
  // Chrome 134 desktop
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  // Safari 18 desktop
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
  // Firefox 134 desktop
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.7; rv:134.0) Gecko/20100101 Firefox/134.0',
  // Edge 134
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0',
  // Mobile Safari (iPhone)
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1',
  // Chrome Android
  'Mozilla/5.0 (Linux; Android 14; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
];

/** Realistic Accept-Language pools — biases toward US+EN regions */
const ACCEPT_LANGUAGES = [
  'en-US,en;q=0.9',
  'en-US,en;q=0.9,es;q=0.8',
  'en-GB,en;q=0.9',
  'en-CA,en;q=0.9,fr-CA;q=0.5',
];

/** Realistic Sec-CH-UA hints to look like a real Chrome */
const SEC_CH_UA_VARIANTS = [
  '"Google Chrome";v="134", "Chromium";v="134", "Not?A_Brand";v="24"',
  '"Microsoft Edge";v="134", "Chromium";v="134", "Not?A_Brand";v="24"',
];

type Result = {
  isLive: boolean;
  hlsUrl?: string;
  flvUrl?: string;
  title?: string;
  viewerCount?: number;
  fetchedAt: string;
  source: 'live-page' | 'cached' | 'none';
  error?: string;
  /** Identifies which Worker run produced this — handy in browser DevTools */
  via: 'cf-worker';
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight — site fetches cross-origin from emgamer731.netlify.app
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'access-control-max-age': '86400',
        },
      });
    }

    const handle =
      url.searchParams.get('handle') ||
      env.TIKTOK_HANDLE ||
      DEFAULT_HANDLE;

    // ── Edge cache: 60s TTL keyed by handle ──
    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}/cache/${handle}`, request);
    const cached = await cache.match(cacheKey);
    if (cached) {
      // Stamp the response so DevTools shows it came from cache
      const body = await cached.text();
      try {
        const parsed = JSON.parse(body);
        parsed.source = 'cached';
        return jsonResponse(parsed);
      } catch {
        return cached;
      }
    }

    const fetchedAt = new Date().toISOString();

    try {
      const result = await scrapeTikTokLive(handle);
      const payload: Result = {
        ...result,
        fetchedAt,
        via: 'cf-worker',
      };

      const res = jsonResponse(payload);
      // Cache successful and "not live" responses for 60s — TikTok rotates
      // their HLS URLs every few minutes anyway.
      const cacheableRes = new Response(JSON.stringify(payload), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=60, s-maxage=60',
        },
      });
      ctx.waitUntil(cache.put(cacheKey, cacheableRes));
      return res;
    } catch (e) {
      return jsonResponse({
        isLive: false,
        fetchedAt,
        source: 'none',
        error: e instanceof Error ? e.message : 'unknown',
        via: 'cf-worker',
      });
    }
  },
};

async function scrapeTikTokLive(handle: string): Promise<Omit<Result, 'fetchedAt' | 'via'>> {
  const ua = pick(USER_AGENTS);
  const acceptLang = pick(ACCEPT_LANGUAGES);
  const isMobile = /iPhone|Android/.test(ua);
  const secChUa = pick(SEC_CH_UA_VARIANTS);

  const targetUrl = `https://www.tiktok.com/@${handle}/live`;

  const headers: Record<string, string> = {
    'user-agent': ua,
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': acceptLang,
    'accept-encoding': 'gzip, deflate, br',
    'referer': `https://www.tiktok.com/@${handle}`,
    'upgrade-insecure-requests': '1',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'sec-ch-ua': secChUa,
    'sec-ch-ua-mobile': isMobile ? '?1' : '?0',
    'sec-ch-ua-platform': isMobile
      ? (ua.includes('iPhone') ? '"iOS"' : '"Android"')
      : (ua.includes('Macintosh') ? '"macOS"' : '"Windows"'),
    'cache-control': 'max-age=0',
    'priority': 'u=0, i',
  };

  const res = await fetch(targetUrl, { headers, redirect: 'follow' });
  if (!res.ok) {
    return { isLive: false, source: 'none', error: `tiktok ${res.status}` };
  }

  const html = await res.text();

  // 1) Modern UNIVERSAL_DATA blob
  const m1 = html.match(
    /<script[^>]*id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (m1?.[1]) {
    const x = extractFromUniversal(m1[1]);
    if (x.isLive && x.hlsUrl) return { ...x, source: 'live-page' };
  }

  // 2) Legacy SIGI_STATE
  const m2 = html.match(/<script[^>]*id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/i);
  if (m2?.[1]) {
    const x = extractFromSigi(m2[1]);
    if (x.isLive && x.hlsUrl) return { ...x, source: 'live-page' };
  }

  // 3) Last-ditch regex anywhere in HTML
  const m3 = html.match(/"hls_pull_url"\s*:\s*"([^"]+)"/);
  if (m3?.[1]) {
    const hlsUrl = m3[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
    const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return {
      isLive: true,
      hlsUrl,
      title: titleM?.[1]?.trim(),
      source: 'live-page',
    };
  }

  return { isLive: false, source: 'none', error: 'no live stream metadata found' };
}

function extractFromUniversal(jsonText: string): { isLive: boolean; hlsUrl?: string; flvUrl?: string; title?: string; viewerCount?: number } {
  try {
    const data = JSON.parse(jsonText);
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

function extractFromSigi(jsonText: string): { isLive: boolean; hlsUrl?: string; flvUrl?: string; title?: string } {
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

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=30, s-maxage=60',
    },
  });
}
