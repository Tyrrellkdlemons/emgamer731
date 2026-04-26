export type LivePlatform = 'youtube' | 'tiktok' | 'twitch' | 'kick';

export interface LiveStatus {
  platform: LivePlatform;
  isLive: boolean;
  title?: string;
  thumbnail?: string;
  watchUrl: string;
  startedAt?: string;
  viewerCount?: number;
  fetchedAt: string;
  source: 'api' | 'manual' | 'webhook' | 'fallback';
}

export interface LiveAdapter {
  id: LivePlatform;
  enabled: boolean;
  fetch(): Promise<LiveStatus>;
}

export interface LiveSummary {
  isLive: boolean;
  primary?: LiveStatus;
  all: LiveStatus[];
  fetchedAt: string;
}
