'use client';

/**
 * DualPlatformLivePlayer — v1.7.0
 *
 * NEW in v1.7: now that EMM simulcasts the same broadcast to BOTH YouTube
 * and TikTok via Restream.io, this wrapper lets visitors CHOOSE which
 * surface they want to watch on. Defaults to YouTube (zero login wall,
 * cleanest inline embed) and offers a TikTok tab + an "open in TikTok app"
 * deeplink — preserving every fallback path the previous solo player had.
 *
 *   ┌────────── PLATFORM PICKER ─────────────┐
 *   │  ◉ YouTube   ○ TikTok                  │ ← only shown when BOTH are live
 *   └────────────────────────────────────────┘
 *   ┌──────── PLAYER (whichever picked) ─────┐
 *   │           <video> / <iframe>           │
 *   └────────────────────────────────────────┘
 *
 * When only ONE platform is live (or only ONE channel is configured), the
 * picker hides itself and the component degrades to the original
 * NoLoginLivePlayer behaviour — nothing breaks for solo streams.
 *
 * Why the YouTube-first default:
 *   - YT's `embed/live_stream?channel=<id>` is iframable with no sign-in
 *   - HLS.js/TikTok scraping has consistently hit login walls on TikTok
 *   - Restream's free plan publishes the same feed to both, so we lose
 *     nothing by preferring the more reliable surface.
 *
 * Architecture:
 *   - Reuses NoLoginLivePlayer for the actual playback (single source of
 *     truth for embed logic, fallback chain, "powered by" badges, etc.)
 *   - This file is purely the picker UI + the "force surface" override.
 */

import { useState, useMemo } from 'react';
import type { LiveStatus } from '@/lib/live-status';
import { NoLoginLivePlayer } from './NoLoginLivePlayer';

const TT_HANDLE = process.env.NEXT_PUBLIC_TIKTOK_HANDLE || 'eatsswithemm';

type Platform = 'youtube' | 'tiktok';

type Props = {
  primary: LiveStatus;
  secondary?: LiveStatus;
  className?: string;
};

export function DualPlatformLivePlayer({ primary, secondary, className }: Props) {
  // Collect what's actually live across primary + secondary
  const youtube = useMemo(
    () =>
      primary.platform === 'youtube' ? primary :
      secondary?.platform === 'youtube' ? secondary : undefined,
    [primary, secondary],
  );
  const tiktok = useMemo(
    () =>
      primary.platform === 'tiktok' ? primary :
      secondary?.platform === 'tiktok' ? secondary : undefined,
    [primary, secondary],
  );

  // Picker only matters when BOTH are live. Default to YouTube — most reliable.
  const bothLive = !!youtube && !!tiktok;
  const [chosen, setChosen] = useState<Platform>(bothLive ? 'youtube' : (youtube ? 'youtube' : 'tiktok'));

  // Build the props we'll forward to NoLoginLivePlayer based on the user's pick.
  // The trick: we lie to NoLoginLivePlayer about which platform is "primary"
  // so it picks the one the user clicked — its existing fallback chain still
  // applies in case the chosen surface fails.
  const forwardedPrimary: LiveStatus =
    chosen === 'youtube' && youtube ? youtube :
    chosen === 'tiktok' && tiktok ? tiktok :
    primary;
  const forwardedSecondary: LiveStatus | undefined =
    chosen === 'youtube' && tiktok ? tiktok :
    chosen === 'tiktok' && youtube ? youtube :
    secondary;

  const appDeeplink = `snssdk1233://user/profile/${TT_HANDLE}`;
  const tiktokWebUrl = `https://www.tiktok.com/@${TT_HANDLE}/live`;

  return (
    <div className={'flex flex-col gap-3 ' + (className ?? '')}>
      {bothLive && (
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Choose where to watch the live"
            className="inline-flex items-center rounded-full bg-cocoa/90 p-1 ring-1 ring-creamShade shadow-soft"
          >
            <PickerTab
              active={chosen === 'youtube'}
              onClick={() => setChosen('youtube')}
              label="YouTube"
              hint="No login · cleanest"
              accent="#FF0033"
            />
            <PickerTab
              active={chosen === 'tiktok'}
              onClick={() => setChosen('tiktok')}
              label="TikTok"
              hint="Same stream, TT vibes"
              accent="#25F4EE"
            />
          </div>

          <a
            href={appDeeplink}
            className="inline-flex items-center gap-1 rounded-full bg-pancake text-cocoa px-3 py-1.5 text-xs font-bold shadow-soft hover:shadow-lifted transition-all"
            title="Open the live in your TikTok app"
          >
            📱 Open in TikTok app
          </a>
          <a
            href={tiktokWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cream text-cocoa/80 ring-1 ring-creamShade px-3 py-1.5 text-xs font-semibold hover:bg-mint transition-colors"
          >
            ↗ TikTok web
          </a>
        </div>
      )}

      {/* The actual player — surface chosen by the picker, fallback chain
          (HLS → iframe race → CTA card) still applies inside. */}
      <NoLoginLivePlayer primary={forwardedPrimary} secondary={forwardedSecondary} />

      {bothLive && (
        <p className="text-[11px] text-cocoa/55 italic">
          Same stream on both — Restream simulcast. YouTube is the smoothest no-login watch; TikTok keeps the live-chat vibe.
        </p>
      )}
    </div>
  );
}

function PickerTab({
  active, onClick, label, hint, accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        'relative inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold transition-all ' +
        (active
          ? 'bg-pancake text-cocoa shadow-liveGlow'
          : 'text-eggshell/80 hover:text-eggshell hover:bg-cocoa/40')
      }
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: active ? accent : 'currentColor', opacity: active ? 1 : 0.5 }}
        aria-hidden
      />
      <span>{label}</span>
      <span className="hidden md:inline text-[10px] font-medium opacity-70">· {hint}</span>
    </button>
  );
}
