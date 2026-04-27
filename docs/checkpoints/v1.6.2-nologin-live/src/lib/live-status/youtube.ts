import type { LiveAdapter, LiveStatus } from './types';

const CHANNEL = process.env.YOUTUBE_CHANNEL_ID;
const KEY = process.env.YOUTUBE_API_KEY;

export const youtubeAdapter: LiveAdapter = {
  id: 'youtube',
  enabled: Boolean(CHANNEL && KEY),
  async fetch(): Promise<LiveStatus> {
    const fallback: LiveStatus = {
      platform: 'youtube',
      isLive: false,
      watchUrl: 'https://www.youtube.com/channel/' + (CHANNEL ?? ''),
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    };

    if (!CHANNEL || !KEY) return fallback;

    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('channelId', CHANNEL);
      url.searchParams.set('eventType', 'live');
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', '1');
      url.searchParams.set('key', KEY);

      const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
      });
      if (!res.ok) return fallback;
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
      if (!item) return fallback;

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
    } catch {
      return fallback;
    }
  },
};
