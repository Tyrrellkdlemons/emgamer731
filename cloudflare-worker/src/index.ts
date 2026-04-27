/**
 * EMGamer731 — TikTok Live Scraper (Cloudflare Worker)
 * v1.7.4
 *
 * Why this exists:
 *   The Next.js function at /api/tiktok-live-stream runs on Netlify and
 *   gets login-walled by TikTok's anti-bot most of the time. Cloudflare
 *   Workers run from CF's massive global edge with rotating IP pools,
 *   so the same scrape succeeds at a much higher rate. This Worker:
 *
 *     1. Picks a fresh User-Agent from a real-Chrome/Safari/Firefox pool
 *     2. Sends realistic Accept-Language + Sec-CH-UA + Referer headers
 *     3. Caches the result in CF cache for 120 s (stays under free tier)
 *     4. Returns JSON in the SAME SHAPE the site already expects
 *
 *   The site reads `process.env.TIKTOK_SCRAPER_WORKER_URL` — if set, it
 *   proxies through this Worker; otherwise it falls back to the existing
 *   Netlify function. Zero downtime, zero regression.
 *
 * v1.7.4 — TOS-PROTECTION LAYER
 *   We're scraping TikTok's PUBLIC live page (no auth, no DRM). The page
 *   is publicly viewable in any browser, so legally this is no different
 *   than a `<video>` tag pointing at a public CDN URL. But we want to be
 *   GOOD CITIZENS — scrape politely, identify ourselves, and back off if
 *   TikTok signals they don't want us hitting them. To that end:
 *
 *     - HONEST IDENTIFICATION: optional `X-EMGamer731-Source` header on
 *       the outbound request lets a manual TikTok admin tell who we are
 *       without breaking anti-bot detection. Toggle via env var
 *       IDENTIFY_SOURCE=true.
 *     - CIRCUIT BREAKER: if TikTok returns 429 or 403 N times in a row
 *       within a short window, we STOP probing for 30 minutes. Prevents
 *       us from hammering when they're already telling us no.
 *     - LONGER CACHE TTL: bumped from 60s → 120s. TikTok HLS URLs are
 *       valid for several minutes; no need to re-fetch every 30s.
 *     - PER-IP RATE LIMIT: prevents anyone discovering this Worker URL
 *       from using it as a free public TikTok scraper. Max 30 req/min
 *       per requester IP. Site polling at 30s/tab is well under cap.
 *     - RESPECTS PUBLIC-CONTENT-ONLY: we ONLY hit /@<handle>/live, the
 *       page that any logged-out browser can see. We never touch the
 *       authenticated API, never decrypt anything, never scrape private
 *       content or other users.
 *
 *   These don't make scraping "officially TOS-approved" (TikTok TOS says
 *   no automated access of any kind), but they put us at the most
 *   defensible end of the gray area: respectful, identifiable, public-
 *   content-only, and self-throttling.
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
  /** Set to "true" to add an X-EMGamer731-Source header to outbound requests
   *  so a TikTok ops person can identify who we are without breaking anti-bot. */
  IDENTIFY_SOURCE?: string;
}

/** Cache TTL for successful + not-live responses. v1.7.4 bumped 60s → 120s. */
const CACHE_TTL_S = 120;

/** Circuit breaker — if we see this many 429/403 in a short window, back off. */
const CB_THRESHOLD = 3;
const CB_WINDOW_MS = 5 * 60 * 1000;       // 5 min observation window
const CB_BACKOFF_MS = 30 * 60 * 1000;     // 30 min cool-down on trip
const CB_KEY = 'tiktok-cb-state';

/** Per-IP rate limit — defends our Worker against being used as a public scraper. */
const RATE_PER_MIN = 30;
const RATE_WINDOW_MS = 60 * 1000;

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

    // ── TOS GUARD 1: per-IP rate limit (defends Worker from public abuse) ──
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (!await checkRateLimit(ip)) {
      return jsonResponse(
        {
          isLive: false,
          fetchedAt: new Date().toISOString(),
          source: 'none',
          error: 'rate-limited',
          via: 'cf-worker',
        },
        { status: 429 },
      );
    }

    // ── Edge cache: 120s TTL keyed by handle ──
    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}/cache/${handle}`, request);
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      try {
        const parsed = JSON.parse(body);
        parsed.source = 'cached';
        return jsonResponse(parsed);
      } catch {
        return cached;
      }
    }

    // ── TOS GUARD 2: circuit breaker — if TikTok told us NO recently, honor it ──
    const cbState = await getCircuitBreaker(url.origin);
    if (cbState.tripped) {
      return jsonResponse({
        isLive: false,
        fetchedAt: new Date().toISOString(),
        source: 'none',
        error: `circuit-breaker tripped (cooling until ${cbState.cooldownUntil})`,
        via: 'cf-worker',
      });
    }

    const fetchedAt = new Date().toISOString();

    try {
      const result = await scrapeTikTokLive(handle, env, ctx, url.origin);
      const payload: Result = {
        ...result,
        fetchedAt,
        via: 'cf-worker',
      };

      const cacheableRes = new Response(JSON.stringify(payload), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': `public, max-age=${CACHE_TTL_S}, s-maxage=${CACHE_TTL_S}`,
        },
      });
      ctx.waitUntil(cache.put(cacheKey, cacheableRes));
      return jsonResponse(payload);
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

/* ── TOS-GUARD HELPERS ──────────────────────────────────────────────── */

/** In-memory token bucket per IP. Map persists across requests in same worker
 *  isolate; resets on cold-start. Good enough for our use case (defending vs
 *  someone using us as a free TikTok scraper). */
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_PER_MIN) return false;
  bucket.count += 1;
  return true;
}

type CBState = { tripped: boolean; cooldownUntil?: string; failures: number; firstFailureAt?: number };

async function getCircuitBreaker(origin: string): Promise<CBState> {
  // Use the edge cache as a poor-man's KV — survives across requests.
  const cache = caches.default;
  const r = await cache.match(new Request(`${origin}/${CB_KEY}`));
  if (!r) return { tripped: false, failures: 0 };
  try {
    const s = (await r.json()) as CBState;
    if (s.cooldownUntil && new Date(s.cooldownUntil).getTime() > Date.now()) {
      return { ...s, tripped: true };
    }
    return { ...s, tripped: false };
  } catch {
    return { tripped: false, failures: 0 };
  }
}

async function recordFailure(origin: string, ctx: ExecutionContext): Promise<void> {
  const current = await getCircuitBreaker(origin);
  const now = Date.now();
  const within = current.firstFailureAt && (now - current.firstFailureAt) < CB_WINDOW_MS;
  const next: CBState = {
    tripped: false,
    failures: within ? current.failures + 1 : 1,
    firstFailureAt: within ? current.firstFailureAt : now,
  };
  if (next.failures >= CB_THRESHOLD) {
    next.tripped = true;
    next.cooldownUntil = new Date(now + CB_BACKOFF_MS).toISOString();
  }
  const payload = JSON.stringify(next);
  const cacheableRes = new Response(payload, {
    headers: {
      'content-type': 'application/json',
      'cache-control': `public, max-age=${Math.ceil(CB_BACKOFF_MS / 1000)}`,
    },
  });
  ctx.waitUntil(caches.default.put(new Request(`${origin}/${CB_KEY}`), cacheableRes));
}

async function recordSuccess(origin: string, ctx: ExecutionContext): Promise<void> {
  // Reset the breaker on success
  const cleanState: CBState = { tripped: false, failures: 0 };
  const r = new Response(JSON.stringify(cleanState), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
  });
  ctx.waitUntil(caches.default.put(new Request(`${origin}/${CB_KEY}`), r));
}

async function scrapeTikTokLive(
  handle: string,
  env: Env,
  ctx: ExecutionContext,
  origin: string,
): Promise<Omit<Result, 'fetchedAt' | 'via'>> {
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

  // ── TOS GUARD 3: honest identification (opt-in) ──
  // Adds a custom X- header so a TikTok engineer reading their logs can see
  // who we are. Doesn't break anti-bot (custom X- headers aren't part of
  // browser fingerprinting), but does the right thing if anyone asks.
  if (env.IDENTIFY_SOURCE === 'true') {
    headers['x-emgamer731-source'] = 'personal-creator-site (https://emgamer731.netlify.app)';
    headers['x-emgamer731-purpose'] = 'embed-own-public-live-stream-on-personal-site';
  }

  const res = await fetch(targetUrl, { headers, redirect: 'follow' });

  // ── TOS GUARD 4: respect TikTok's blocking signals — trip the breaker ──
  if (res.status === 429 || res.status === 403) {
    await recordFailure(origin, ctx);
    return { isLive: false, source: 'none', error: `tiktok ${res.status} (breaker incremented)` };
  }
  if (!res.ok) {
    return { isLive: false, source: 'none', error: `tiktok ${res.status}` };
  }
  // Successful fetch — reset breaker
  await recordSuccess(origin, ctx);

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

function jsonResponse(payload: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=30, s-maxage=60',
      ...(init.headers ?? {}),
    },
  });
}
