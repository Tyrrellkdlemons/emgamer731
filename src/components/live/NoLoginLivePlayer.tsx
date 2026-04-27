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

  // TikTok route — official embed first, fallbacks below.
  if (tiktok) {
    const videoId = extractTikTokVideoId(tiktok.watchUrl);
    return (
      <TikTokRouteWithFallback
        videoId={videoId}
        watchUrl={tiktok.watchUrl}
        title={tiktok.title ?? 'EMM live on TikTok'}
        className={className}
      />
    );
  }

  return null;
}

/**
 * The TikTok branch. Tries the official embed first; if the iframe doesn't
 * paint within 6 seconds (network block, ad-blocker, region restriction),
 * we surface the no-login mirror + native-app deeplink.
 */
function TikTokRouteWithFallback({
  videoId, watchUrl, title, className,
}: {
  videoId?: string;
  watchUrl: string;
  title: string;
  className?: string;
}) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 6s grace period — if the TikTok script never renders an iframe inside
    // the blockquote, assume the user's network blocks it.
    const t = setTimeout(() => {
      const hasIframe = !!wrapper.current?.querySelector('iframe');
      if (!hasIframe) setEmbedFailed(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [videoId]);

  const mirrorUrl = videoId
    ? `https://proxitok.pabloferreiro.es/@${TT_HANDLE}/video/${videoId}`
    : `https://proxitok.pabloferreiro.es/@${TT_HANDLE}/live`;

  const appDeeplink = videoId
    ? `snssdk1233://aweme/detail/${videoId}`
    : `snssdk1233://user/profile/${TT_HANDLE}`;

  return (
    <div className={'relative ' + (className ?? '')}>
      {!embedFailed && (
        <div ref={wrapper} className="relative rounded-2xl overflow-hidden ring-1 ring-creamShade bg-cocoa">
          <TikTokProfileEmbed
            videoId={videoId}
            handle={TT_HANDLE}
          />
          <PoweredByBadge platform="tiktok" />
        </div>
      )}

      {embedFailed && (
        <div className="rounded-2xl bg-cocoa text-eggshell p-5 sm:p-6 ring-1 ring-creamShade">
          <div className="text-xs uppercase tracking-widest text-pancake font-bold mb-1">
            Heads up
          </div>
          <h3 className="display text-2xl leading-tight">
            Your network is blocking the TikTok embed.
          </h3>
          <p className="text-eggshell/85 mt-2 text-sm">
            No problem — pick a no-login path below. None of these require an account.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">
            <a
              href={mirrorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-mint text-cocoa px-4 py-3 text-sm font-bold text-center shadow-soft hover:shadow-lifted transition-all"
            >
              Watch on the no-login mirror →
            </a>
            <a
              href={appDeeplink}
              className="rounded-2xl bg-pancake text-cocoa px-4 py-3 text-sm font-bold text-center shadow-soft hover:shadow-lifted transition-all"
            >
              Open in TikTok app →
            </a>
          </div>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-xs text-eggshell/70 hover:text-pancake underline text-center"
          >
            Or open the original TikTok page (may ask to log in)
          </a>
        </div>
      )}
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
