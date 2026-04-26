/**
 * YouTube auto-pull feed.
 *
 * Tries three strategies in order:
 *   1. YouTube Data API v3 (`search.list`) — requires YOUTUBE_API_KEY (free, 10K units/day)
 *   2. YouTube RSS feed — works on most channels with no key, but some channels return 404
 *   3. Static seed in `src/data/latest-content.ts` — the always-on fallback
 *
 * Result is cached in-memory for 30 minutes — much longer than /api/live because uploads
 * change far less often than live status. Front-end revalidates via Next ISR.
 */

import { LATEST_CONTENT, type ContentCard } from '@/data/latest-content';

const CHANNEL = process.env.YOUTUBE_CHANNEL_ID || 'UCnSbDaREAHiITX2UPjE44fA';
const KEY = process.env.YOUTUBE_API_KEY;
const TTL_MS = 30 * 60 * 1000; // 30 minutes

let cache: { value: ContentCard[]; expires: number } | null = null;

export async function getYouTubeFeed(maxResults = 25): Promise<ContentCard[]> {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.value;

  // Strategy 1 — Data API v3 (preferred). Includes Shorts (search.list returns them).
  if (KEY && CHANNEL) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('channelId', CHANNEL);
      url.searchParams.set('order', 'date');
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', String(maxResults));
      url.searchParams.set('key', KEY);

      const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
      if (res.ok) {
        const data = (await res.json()) as ApiResponse;
        let items = (data.items ?? [])
          .filter((i) => i.id?.videoId && i.snippet)
          .map((i) => mapApiItem(i));

        if (items.length > 0) {
          // Enrichment pass — videos.list to fetch durations.
          // Cost: 1 unit (cheap). Lets us tag Shorts (< 60s) and show real durations.
          try {
            const ids = items.map((i) => i.embedId).filter(Boolean).join(',');
            const v = new URL('https://www.googleapis.com/youtube/v3/videos');
            v.searchParams.set('part', 'contentDetails');
            v.searchParams.set('id', ids);
            v.searchParams.set('key', KEY);
            const vr = await fetch(v.toString(), { next: { revalidate: 1800 } });
            if (vr.ok) {
              const vd = (await vr.json()) as VideosResponse;
              const durMap = new Map<string, number>();
              const fmtMap = new Map<string, string>();
              for (const it of vd.items ?? []) {
                const sec = parseISODuration(it.contentDetails?.duration ?? 'PT0S');
                durMap.set(it.id, sec);
                fmtMap.set(it.id, formatDuration(sec));
              }
              items = items.map((c) => {
                const sec = c.embedId ? durMap.get(c.embedId) ?? 0 : 0;
                const isShort = sec > 0 && sec <= 60;
                return {
                  ...c,
                  duration: c.embedId ? fmtMap.get(c.embedId) ?? c.duration : c.duration,
                  isShort,
                  category: isShort ? 'short' : c.category,
                };
              });
            }
          } catch {
            // duration enrichment is best-effort; items remain valid without it
          }

          cache = { value: items, expires: now + TTL_MS };
          return items;
        }
      }
    } catch {
      // fall through to RSS
    }
  }

  // Strategy 2 — RSS feed (no key required, but not always available)
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`;
    const res = await fetch(rssUrl, { next: { revalidate: 1800 } });
    if (res.ok) {
      const xml = await res.text();
      const items = parseRSS(xml);
      if (items.length > 0) {
        cache = { value: items, expires: now + TTL_MS };
        return items;
      }
    }
  } catch {
    // fall through to static
  }

  // Strategy 3 — static seed
  return LATEST_CONTENT.filter((c) => c.platform === 'youtube');
}

// === API mapper ===
type ApiResponse = {
  items?: Array<{
    id: { videoId: string };
    snippet: {
      publishedAt: string;
      title: string;
      description: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
        maxres?: { url: string };
      };
      liveBroadcastContent?: 'live' | 'upcoming' | 'none';
    };
  }>;
};

function mapApiItem(i: NonNullable<ApiResponse['items']>[number]): ContentCard {
  const id = i.id.videoId;
  const t = i.snippet.thumbnails;
  const thumb = t.maxres?.url ?? t.high?.url ?? t.medium?.url ?? t.default?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const isLive = i.snippet.liveBroadcastContent === 'live';
  return {
    id: `yt-${id}`,
    platform: 'youtube',
    title: i.snippet.title,
    thumbnail: thumb,
    url: `https://www.youtube.com/watch?v=${id}`,
    embedId: id,
    publishedAt: i.snippet.publishedAt,
    category: isLive ? 'live' : guessCategory(i.snippet.title),
  };
}

// === RSS mapper ===
function parseRSS(xml: string): ContentCard[] {
  const out: ContentCard[] = [];
  const entries = xml.split('<entry>').slice(1);
  for (const e of entries) {
    const id = pick(e, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = pick(e, /<title>([^<]+)<\/title>/);
    const published = pick(e, /<published>([^<]+)<\/published>/);
    const thumb = pick(e, /<media:thumbnail url="([^"]+)"/);
    if (!id) continue;
    out.push({
      id: `yt-${id}`,
      platform: 'youtube',
      title: title || 'Untitled',
      thumbnail: thumb || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
      embedId: id,
      publishedAt: published || new Date().toISOString(),
      category: guessCategory(title || ''),
    });
  }
  return out;
}

function pick(s: string, re: RegExp): string | undefined {
  const m = s.match(re);
  return m?.[1];
}

function guessCategory(title: string): ContentCard['category'] {
  const t = title.toLowerCase();
  if (/\blive\b|stream|replay/.test(t)) return 'live';
  if (/fit|outfit|fashion|cardigan|drop/.test(t)) return 'fashion';
  if (/breakfast|waffle|pancake|cereal|egg|toast/.test(t)) return 'breakfast';
  if (/short|#shorts/.test(t)) return 'short';
  return 'gameplay';
}

// === Duration helpers ===
type VideosResponse = {
  items?: Array<{ id: string; contentDetails?: { duration?: string } }>;
};

/** Parse ISO 8601 duration like PT1M30S → 90 (seconds). */
function parseISODuration(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const h = Number(m[1] ?? 0), mn = Number(m[2] ?? 0), s = Number(m[3] ?? 0);
  return h * 3600 + mn * 60 + s;
}

function formatDuration(sec: number): string {
  if (sec <= 0) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}
