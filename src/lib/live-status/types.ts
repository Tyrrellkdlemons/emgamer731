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
  source: 'api' | 'manual' | 'webhook' | 'autodetect' | 'fallback';
  /**
   * Whether THIS broadcast is specifically Roblox gameplay. Drives the
   * inline "pop the player" behaviour on home/live — a generic chat live
   * shouldn't auto-promote the gameplay panel. Detected from title (case-
   * insensitive contains "roblox" or "rblx" or specific game names) OR
   * forced by the webhook/admin override.
   */
  isRoblox?: boolean;
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
