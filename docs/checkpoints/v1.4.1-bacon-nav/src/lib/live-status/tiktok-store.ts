/**
 * In-memory store for TikTok live status pushed via webhook OR admin override.
 *
 * Module-level Map keyed by handle. TTL prevents a stale "live" flag from sticking
 * forever if the stream-end webhook fails to fire — defaults to 30 minutes since
 * most streams end well within that window.
 *
 * For multi-instance deployments swap to Upstash Redis with the same shape.
 */

export type TikTokLiveRecord = {
  handle: string;
  isLive: boolean;
  title?: string;
  watchUrl?: string;
  startedAt?: string;
  source: 'webhook' | 'admin';
  setAt: string;
  expiresAt: string;
};

const TTL_MS = 30 * 60 * 1000; // 30 min

const store = new Map<string, TikTokLiveRecord>();

export function setTikTokLive(record: Omit<TikTokLiveRecord, 'setAt' | 'expiresAt'>) {
  const now = Date.now();
  store.set(record.handle, {
    ...record,
    setAt: new Date(now).toISOString(),
    expiresAt: new Date(now + TTL_MS).toISOString(),
  });
}

export function clearTikTokLive(handle: string) {
  store.delete(handle);
}

export function getTikTokLive(handle: string): TikTokLiveRecord | null {
  const r = store.get(handle);
  if (!r) return null;
  if (new Date(r.expiresAt).getTime() < Date.now()) {
    store.delete(handle);
    return null;
  }
  return r;
}
