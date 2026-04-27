// Static fallback content for when API keys are not yet configured.
// Replace with API-driven feed once YOUTUBE_API_KEY is set in .env.

export type ContentCard = {
  id: string;
  platform: 'youtube' | 'tiktok';
  title: string;
  thumbnail: string;
  url: string;
  /** YouTube video id OR TikTok video id used for inline embed. */
  embedId?: string;
  publishedAt: string;
  duration?: string;
  category: 'gameplay' | 'fashion' | 'breakfast' | 'live' | 'short';
  /** YouTube short (clip < 60s, vertical aspect). */
  isShort?: boolean;
};

// Static seed (used until YouTube API key is configured + cache fills).
// TikTok is intentionally light here — TikTok's primary role is LIVE for Roblox.
// Curated food TikToks live in EATS_TIKTOKS below and surface only on /eats.
export const LATEST_CONTENT: ContentCard[] = [
  { id: 'yt-1', platform: 'youtube', title: 'Cereal Galaxy Speedrun', thumbnail: '/images/gallery/thumb-cereal-galaxy.svg', url: 'https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA', embedId: '', publishedAt: '2026-04-23T14:00:00Z', duration: '14:22', category: 'gameplay' },
  { id: 'yt-2', platform: 'youtube', title: 'Saturday Pancake Stream Replay', thumbnail: '/images/gallery/thumb-pancake-stream.svg', url: 'https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA', embedId: '', publishedAt: '2026-04-19T15:00:00Z', duration: '1:32:11', category: 'live' },
  { id: 'yt-3', platform: 'youtube', title: 'New Avatar Fits — Sage Cardigan Drop', thumbnail: '/images/gallery/thumb-fits-sage.svg', url: 'https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA', embedId: '', publishedAt: '2026-04-15T22:00:00Z', duration: '8:47', category: 'fashion' },
  { id: 'yt-s1', platform: 'youtube', title: 'breakfast routine #shorts', thumbnail: '/images/gallery/thumb-tt-waffle.svg', url: 'https://www.youtube.com/@EmGamer731/shorts', embedId: '', publishedAt: '2026-04-22T12:00:00Z', duration: '0:42', category: 'short', isShort: true },
  { id: 'yt-s2', platform: 'youtube', title: 'cap + bear-charm fit check #shorts', thumbnail: '/images/gallery/thumb-tt-fit.svg', url: 'https://www.youtube.com/@EmGamer731/shorts', embedId: '', publishedAt: '2026-04-18T09:15:00Z', duration: '0:51', category: 'short', isShort: true },
];

/**
 * CURATED TikTok food posts only — surface on /eats.
 *
 * Rule (per creator): only "perfect food" videos belong here. Never auto-bulked.
 * To add a real video:
 *   1. Open the TikTok URL like https://www.tiktok.com/@eatsswithemm/video/7400000000000000000
 *   2. Copy the long ID after /video/
 *   3. Paste into `embedId` and update title + thumbnail
 */
export const EATS_TIKTOKS: ContentCard[] = [
  { id: 'eats-1', platform: 'tiktok', title: 'Triple waffle stack moment', thumbnail: '/images/gallery/thumb-tt-waffle.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-22T12:00:00Z', duration: '0:38', category: 'breakfast' },
  { id: 'eats-2', platform: 'tiktok', title: 'Sunny egg trio — perfect plate', thumbnail: '/images/gallery/breakfast-egg-trio.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-20T11:30:00Z', duration: '0:32', category: 'breakfast' },
  { id: 'eats-3', platform: 'tiktok', title: 'Pancake tower with butter clouds', thumbnail: '/images/gallery/breakfast-pancake-tower.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-18T09:15:00Z', duration: '0:44', category: 'breakfast' },
  { id: 'eats-4', platform: 'tiktok', title: 'Cereal galaxy bowl — saturday vibe', thumbnail: '/images/gallery/thumb-cereal-galaxy.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-15T08:30:00Z', duration: '0:36', category: 'breakfast' },
  { id: 'eats-5', platform: 'tiktok', title: 'Cinnamon french toast drip', thumbnail: '/images/gallery/breakfast-triple-waffle.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-12T10:15:00Z', duration: '0:48', category: 'breakfast' },
  { id: 'eats-6', platform: 'tiktok', title: 'Strawberry fruit cloud bowl', thumbnail: '/images/gallery/breakfast-egg-trio.svg', url: 'https://www.tiktok.com/@eatsswithemm', embedId: '', publishedAt: '2026-04-10T07:45:00Z', duration: '0:30', category: 'breakfast' },
];
