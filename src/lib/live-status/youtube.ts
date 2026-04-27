import type { LiveAdapter, LiveStatus } from './types';

/**
 * v1.7.6 — YouTube adapter now ALWAYS attempts live detection, even without
 * a YOUTUBE_API_KEY env var. Strategy:
 *
 *   PATH A (preferred — needs YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID env vars):
 *     Hits the YouTube Data v3 API. Most reliable, includes title, thumbnail,
 *     viewer count metadata.
 *
 *   PATH B (no-API-key fallback — always tried when no API key):
 *     GET https://www.youtube.com/channel/<id>/live
 *     YouTube redirects this URL to a /watch?v=<videoId> page when the channel
 *     is currently live. We follow redirects and check whether the final URL
 *     is a watch page — if so, the channel IS live and we extract the videoId
 *     + title from the response HTML. This works without any API quota and
 *     never costs anything. Used by countless creator dashboards.
 *
 *   FALLBACK (both paths failed): isLive: false.
 *
 * The hardcoded EmGamer731 channel ID `UCnSbDaREAHiITX2UPjE44fA` is used as a
 * default when YOUTUBE_CHANNEL_ID env isn't set, matching the same fallback
 * already used by NoLoginLivePlayer.
 */

const CHANNEL = process.env.YOUTUBE_CHANNEL_ID || 'UCnSbDaREAHiITX2UPjE44fA';
const KEY = process.env.YOUTUBE_API_KEY;

const SCRAPE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

export const youtubeAdapter: LiveAdapter = {
  id: 'youtube',
  // v1.7.6: always enabled now that the no-key path works.
  enabled: true,
  async fetch(): Promise<LiveStatus> {
    const fallback: LiveStatus = {
      platform: 'youtube',
      isLive: false,
      watchUrl: 'https://www.youtube.com/channel/' + CHANNEL,
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    };

    // PATH A — Data API (when key configured)
    if (KEY) {
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('channelId', CHANNEL);
        url.searchParams.set('eventType', 'live');
        url.searchParams.set('type', 'video');
        url.searchParams.set('maxResults', '1');
        url.searchParams.set('key', KEY);

        const res = await fetch(url.toString(), { next: { revalidate: 60 } });
        if (res.ok) {
          const data = (await res.json()) as {
            items?: Array<{
              id: { videoId: string };
              snippet: {
                title: string;
                thumbnails: { high?: { url: string }; medium?: { url: string } };
                publishedAt: string;
              };
            }>;
          };
          const item = data.items?.[0];
          if (item) {
            return {
              platform: 'youtube',
              isLive: true,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url,
              watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              startedAt: item.snippet.publishedAt,
              fetchedAt: new Date().toISOString(),
              source: 'api',
            };
          }
        }
      } catch { /* fall through to PATH B */ }
    }

    // PATH B — no-key scrape via /channel/<id>/live redirect
    try {
      const url = `https://www.youtube.com/channel/${CHANNEL}/live`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
        redirect: 'follow',
        headers: {
          'user-agent': SCRAPE_UA,
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
        },
      });
      if (!res.ok) return fallback;

      const finalUrl = res.url;
      // YouTube redirects /channel/<id>/live → /watch?v=<videoId> when LIVE.
      // Otherwise it stays on /channel/<id>/live or redirects to /channel/<id>.
      const watchMatch = finalUrl.match(/\/watch\?v=([\w-]+)/);
      if (!watchMatch) return fallback;

      const videoId = watchMatch[1];
      const html = await res.text();

      // Confirm it's actively LIVE (not just a watch page redirect for any reason)
      // YouTube embeds live state in the player config. Check for explicit signal.
      const isActuallyLive =
        /\"isLive\"\s*:\s*true/i.test(html) ||
        /\"isLiveContent\"\s*:\s*true.*?\"liveBroadcastDetails\"/is.test(html) ||
        /\"isLiveNow\"\s*:\s*true/i.test(html);

      if (!isActuallyLive) return fallback;

      // Extract title from the meta tag or document <title>
      const titleM =
        html.match(/<meta\s+name="title"\s+content="([^"]+)"/i) ||
        html.match(/<title[^>]*>([^<]+?)\s*-\s*YouTube\s*<\/title>/i) ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleM?.[1]?.trim();

      const thumbM = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      const thumbnail = thumbM?.[1];

      return {
        platform: 'youtube',
        isLive: true,
        title,
        thumbnail,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        fetchedAt: new Date().toISOString(),
        source: 'autodetect',
      };
    } catch {
      return fallback;
    }
  },
};
