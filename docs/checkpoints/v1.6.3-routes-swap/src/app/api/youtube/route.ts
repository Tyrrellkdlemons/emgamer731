import { NextResponse } from 'next/server';
import { getYouTubeFeed } from '@/lib/youtube/feed';

export const revalidate = 1800; // 30 min
export const runtime = 'nodejs';

export async function GET() {
  const items = await getYouTubeFeed(25);
  return NextResponse.json(
    {
      items,
      fetchedAt: new Date().toISOString(),
      count: items.length,
      source: items.length > 0 && items[0].id.startsWith('yt-') ? 'auto' : 'static',
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    },
  );
}
