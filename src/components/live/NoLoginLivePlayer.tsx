'use client';

/**
 * NoLoginLivePlayer — watch EMM's live stream WITHOUT being signed in to
 * TikTok or YouTube. The previous embed (`tiktok.com/embed/v2/{id}`) shows
 * a login wall in many browsers + ad-blocker setups; this rewrites the
 * strategy to use only no-login surfaces, with graceful fallbacks if any
 * surface fails.
 *
 * Strategy stack (tried in order — first one that doesn't fail wins):
 *
 *   YouTube channel live (when present)
 *     → `youtube.com/embed/live_stream?channel=<CHANNEL_ID>` is a public
 *       endpoint that auto-loads the channel's current live broadcast and
 *       NEVER requires a sign-in. This is the cleanest path — we route
 *       to it FIRST whenever YouTube is live.
 *
 *   TikTok official blockquote embed
 *     → TikTok's `<blockquote class="tiktok-embed">` + their embed.js
 *       script renders an iframe player that does NOT require login for
 *       embedded content. Same component the /eats page already uses.
 *
 *   Public TikTok mirror
 *     → If the official embed silently fails (some networks block
 *       TikTok JS), we offer a public-mirror frontend
 *       (proxitok.privacydev.net) link that serves a no-login TikTok
 *       view. Opens in a new tab.
 *
 *   Native TikTok app deeplink
 *     → `snssdk1233://...` jumps straight to the live in the TikTok app
 *       on mobile (no login wall in the app for casual viewing).
 *
 * No personal data leaves the visitor's browser; no auth required.
 */

import { useEffect, useRef, useState } from 'react';
import type { LiveStatus } from '@/lib/live-status';
import { TikTokProfileEmbed } from '@/components/watch/TikTokProfileEmbed';
import { TikTokLiveStage } from './TikTokLiveStage';

const YT_CHANNEL =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ||
  // EmGamer731 channel id (from /watch fallback URL)
  'UCnSbDaREAHiITX2UPjE44fA';

const TT_HANDLE = process.env.NEXT_PUBLIC_TIKTOK_HANDLE || 'eatsswithemm';

/** Extract the TikTok video id from a watch URL like .../@user/video/<id> */
function extractTikTokVideoId(url?: string): string | undefined {
  if (!url) return undefined;
  const m = url.match(/\/video\/(\d+)/);
  return m?.[1];
}

type Props = {
  /** Authoritative live summary from LiveStatusProvider. */
  primary: LiveStatus;
  /** Optional secondary stream (e.g. YouTube live when TikTok is also live). */
  secondary?: LiveStatus;
  className?: string;
};

export function NoLoginLivePlayer({ primary, secondary, className }: Props) {
  // Decide which surface to render. Algorithm:
  //   1. If a YouTube live is available (primary OR secondary), use it —
  //      best login-free experience.
  //   2. Else if TikTok primary has a video id, use the official blockquote.
  //   3. Else fall back to the TikTok profile creator embed (still no login).
  const yt =
    primary.platform === 'youtube' ? primary :
    secondary?.platform === 'youtube' ? secondary : undefined;

  const tiktok =
    primary.platform === 'tiktok' ? primary :
    secondary?.platform === 'tiktok' ? secondary : undefined;

  // YT route: most reliable — no login, no popups.
  if (yt) {
    return (
      <div className={'relative rounded-2xl overflow-hidden ring-1 ring-creamShade aspect-video bg-cocoa ' + (className ?? '')}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${YT_CHANNEL}&autoplay=1&modestbranding=1&rel=0`}
          title={yt.title ?? 'EMM live on YouTube'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full"
        />
        <PoweredByBadge platform="youtube" />
      </div>
    );
  }

  // TikTok route — v1.6.5 racing iframe stage (4 sources in parallel) so
  // we ACTIVELY try every login-free path before falling back to the
  // CTA hero card. Whichever iframe loads first wins. This is the most
  // aggressive thing we can do from a static site without a TikTok Live
  // for Business partner account.
  if (tiktok) {
    return (
      <TikTokLiveStage
        title={tiktok.title}
        className={className}
      />
    );
  }

  return null;
}

/**
 * TikTok branch — v1.6.3 fix: when EMM is LIVE, render a dedicated LIVE
 * panel (NOT her profile feed). The previous behaviour rendered her profile
 * because TikTok doesn't expose a clean iframe-able live embed without
 * sign-in, so we have to be honest with the visitor: we can't iframe the
 * live stream legally + login-free, but we CAN give them three one-tap
 * paths to the actual Roblox gameplay:
 *
 *   1. YouTube simulcast (if EMM is also live there) — handled in the
 *      parent NoLoginLivePlayer; we never reach this branch in that case.
 *   2. Open the TikTok app via deeplink → straight into the live room.
 *   3. Join the Roblox experience directly → join the SAME Roblox session
 *      EMM is streaming. Real gameplay > a video of gameplay.
 *
 * Configure the Roblox experience link via NEXT_PUBLIC_ROBLOX_EXPERIENCE_URL
 * (place ID URL or universe link). When unset we hide the Roblox button.
 */
function TikTokRouteWithFallback({
  videoId, watchUrl, title, className,
}: {
  videoId?: string;
  watchUrl: string;
  title: string;
  className?: string;
}) {
  const robloxUrl = process.env.NEXT_PUBLIC_ROBLOX_EXPERIENCE_URL || '';
  const mirrorUrl = videoId
    ? `https://proxitok.pabloferreiro.es/@${TT_HANDLE}/video/${videoId}`
    : `https://proxitok.pabloferreiro.es/@${TT_HANDLE}/live`;
  const appDeeplink = videoId
    ? `snssdk1233://aweme/detail/${videoId}`
    : `snssdk1233://user/profile/${TT_HANDLE}`;

  return (
    <div
      className={
        'relative rounded-2xl overflow-hidden ring-2 ring-liveRed/60 bg-gradient-to-br from-cocoa via-cocoa to-[#2a1611] text-eggshell ' +
        (className ?? '')
      }
    >
      {/* LIVE GAMEPLAY HERO ── shows the gameplay context, not the profile */}
      <div className="relative aspect-video grid place-items-center px-5 sm:px-6 py-8">
        {/* animated gradient glow */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,71,87,0.45), transparent 55%), radial-gradient(circle at 70% 70%, rgba(168,230,207,0.35), transparent 55%)',
          }}
        />
        <div className="relative text-center max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-liveRed text-white px-3 py-1 text-xs font-extrabold shadow-liveGlow mb-3">
            <span className="live-dot" /> LIVE NOW · ROBLOX GAMEPLAY
          </div>
          <h3 className="display text-2xl sm:text-3xl text-eggshell leading-tight">
            {title || 'EMM is live — playing Roblox right now.'}
          </h3>
          <p className="text-eggshell/75 text-sm mt-2">
            TikTok blocks login-free live embeds, so the squad watches in the app
            or jumps straight into the Roblox session.
          </p>

          <div className="mt-5 grid sm:grid-cols-2 gap-2 text-left">
            <a
              href={appDeeplink}
              className="rounded-2xl bg-pancake text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
            >
              <span>📱 Open live in TikTok app</span>
              <span aria-hidden>→</span>
            </a>
            {robloxUrl ? (
              <a
                href={robloxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-mint text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
              >
                <span>🎮 Join the Roblox game</span>
                <span aria-hidden>→</span>
              </a>
            ) : (
              <a
                href={mirrorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-mint text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
              >
                <span>🪟 No-login web mirror</span>
                <span aria-hidden>→</span>
              </a>
            )}
          </div>
          <p className="text-[11px] text-eggshell/55 mt-3">
            Want a smoother inline-watch experience next time?{' '}
            <strong>Simulcast to YouTube</strong> — when YT is live, this player
            embeds the gameplay stream directly with no sign-in.
          </p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-xs text-eggshell/65 hover:text-pancake underline"
          >
            Or open the original TikTok live page (may ask to log in)
          </a>
        </div>
        <PoweredByBadge platform="tiktok" />
      </div>
    </div>
  );
}

function PoweredByBadge({ platform }: { platform: 'youtube' | 'tiktok' }) {
  return (
    <div
      className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-cocoa/85 text-eggshell px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft"
      title={`Streaming via ${platform.toUpperCase()} — no login required`}
    >
      <span className="live-dot" /> No-login {platform === 'youtube' ? 'YT' : 'TikTok'} embed
    </div>
  );
}
