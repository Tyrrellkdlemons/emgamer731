import type { LiveStatus, LiveSummary } from './types';
import { youtubeAdapter } from './youtube';
import { tiktokAdapter } from './tiktok';

const adapters = [youtubeAdapter, tiktokAdapter];

let cache: { value: LiveSummary; expires: number } | null = null;
const TTL_MS = 60_000;

export async function getLiveSummary(): Promise<LiveSummary> {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.value;

  const results = await Promise.allSettled(adapters.map((a) => a.fetch()));
  const all: LiveStatus[] = results
    .map((r) => (r.status === 'fulfilled' ? r.value : null))
    .filter((v): v is LiveStatus => v !== null);

  const live = all.filter((s) => s.isLive);
  const summary: LiveSummary = {
    isLive: live.length > 0,
    primary: live[0],
    all,
    fetchedAt: new Date().toISOString(),
  };

  cache = { value: summary, expires: now + TTL_MS };
  return summary;
}

export type { LiveStatus, LiveSummary } from './types';
