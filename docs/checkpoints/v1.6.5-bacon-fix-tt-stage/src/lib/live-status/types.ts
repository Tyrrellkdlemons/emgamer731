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
   * shouldn't auto-promote the gameplay panel. Detected f