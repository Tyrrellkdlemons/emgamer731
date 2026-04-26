import type { Metadata } from 'next';
import { getYouTubeFeed } from '@/lib/youtube/feed';
import { LATEST_CONTENT } from '@/data/latest-content';
import { WatchClient } from '@/components/watch/WatchClient';

export const metadata: Metadata = {
  title: 'Watch · Replays + clips',
  description: 'Auto-updating feed of every EMGamer731 upload — playable inline.',
};

// Revalidate every 30 minutes — pulls fresh uploads from the YouTube Data API.
export const revalidate = 1800;

export default async function WatchPage() {
  const ytItems = await getYouTubeFeed(25);
  // Always include TikToks from the static seed (TikTok auto-pull is a separate adapter)
  const tiktoks = LATEST_CONTENT.filter((c) => c.platform === 'tiktok');
  const items = [...ytItems, ...tiktoks].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return <WatchClient items={items} />;
}
