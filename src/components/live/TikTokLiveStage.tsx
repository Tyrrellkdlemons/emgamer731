'use client';

/**
 * TikTokLiveStage — v1.7.5 SIMPLIFIED.
 *
 * Strategy reduced to TWO tiers:
 *   1. HLS player (server-extracted m3u8 from the public TikTok live page,
 *      via the Cloudflare Worker scraper when configured).
 *   2. Polished FallbackHero CTA card.
 *
 * The old 4-iframe race (tt-embed, proxitok, vxtiktok, tt-direct) was REMOVED
 * because TikTok serves their live page with `X-Frame-Options: DENY`, so the
 * iframe `onload` event fires for the response but the actual content is
 * blocked from rendering — visitors saw an empty dark frame with "VIA TT-DIRECT"
 * stamped in the corner. Better UX: show a polished CTA card immediately when
 * HLS extraction fails, with the "Open in TikTok app" deeplink that DOES work.
 *
 * Original brief:
 *
 *   "do anything possible to make sure when i go live that it pops up on
 *    the live page and is actively showing me playing to the customers
 *    inline — on tiktok specifically."
 *
 * The honest constraint: TikTok serves `tiktok.com/@user/live` with
 * `X-Frame-Options: DENY`, so a direct iframe is blocked in modern
 * browsers. There's no public no-auth Live embed API. So the strategy is:
 *
 *   1. RACE four iframe sources at once, each in a hidden probe iframe.
 *      Whichever one loads visible content within 4 seconds becomes the
 *      foreground player. We try (in priority order):
 *      a. `tiktok.com/embed/@<handle>/live` — undocumented but sometimes
 *         renders an embedded live preview when the room is open.
 *      b. `proxitok.pabloferreiro.es/@<handle>/live` — public mirror that
 *         proxies TikTok and serves an iframe-friendly view in many regions.
 *      c. `vxtiktok.com/@<handle>` — alt mirror.
 *      d. `tiktok.com/@<handle>/live` direct (most likely to be blocked,
 *         but try anyway — costs nothing).
 *
 *   2. If NONE of the iframes load within 4s, render the polished
 *      LIVE-NOW hero card:
 *        - Bold "🔴 LIVE NOW · ON TIKTOK" pulse
 *        - Looped 3-second hero ambient gradient (no video — saves bytes)
 *        - Three giant CTAs:
 *            • 📱 Tap-to-open in TikTok app (deeplink)
 *            • 🌐 Watch on no-login mirror (proxitok in new tab)
 *            • 🎮 Join the Roblox game directly (env-driven)
 *        - Honest one-line note: "TikTok blocks login-free in-page playback
 *          for lives. The squad usually taps Open-in-app — it autoplays
 *          and never asks to log in."
 *
 *   3. The iframe race result is cached in sessionStorage for the rest of
 *      the visit so we don't re-probe on every navigation.
 */

import { useState } from 'react';
import { TikTokLiveHlsPlayer } from './TikTokLiveHlsPlayer';

const HANDLE = process.env.NEXT_PUBLIC_TIKTOK_HANDLE || 'eatsswithemm';
const ROBLOX_URL = process.env.NEXT_PUBLIC_ROBLOX_EXPERIENCE_URL || '';

type Props = {
  /** Stream title for the hero card (when iframes fail). */
  title?: string;
  className?: string;
};

export function TikTokLiveStage({ title, className }: Props) {
  // v1.7.5 simplified — two tiers only:
  //   1. HLS player (CF Worker scrape → m3u8 → HLS.js)
  //   2. FallbackHero CTA card
  // The old iframe race was deleted because TikTok's X-Frame-Options: DENY
  // means iframes never actually render the live stream — the onload event
  // fires for the HTTP response but the browser blocks the rendered content.
  // Visitors saw an empty frame instead of the helpful CTA card.
  const [hlsFailed, setHlsFailed] = useState(false);

  return (
    <div className={'relative ' + (className ?? '')}>
      {/* TIER 1 — HLS player. Tries to extract the m3u8 URL from TikTok's
          public live page (via the Cloudflare Worker when configured) and
          play it inline via HLS.js. Cleanest legal path to inline playback.
          On failure → onFallback → tier 2. */}
      {!hlsFailed && (
        <TikTokLiveHlsPlayer
          fallbackTitle={title}
          onFallback={() => setHlsFailed(true)}
        />
      )}

      {/* TIER 2 — polished CTA card with deeplinks. */}
      {hlsFailed && <FallbackHero title={title} />}
    </div>
  );
}

function FallbackHero({ title }: { title?: string }) {
  // Animated gradient + three CTAs — the "if iframe fails, still flex" panel.
  // v1.7.2: dead proxitok mirror removed; "no-login mirror" link replaced
  // with TikTok web URL (still no login required for casual viewing on most
  // browsers, and at least it's not a takedown page). The big upgrade: the
  // text now points to YouTube via Restream simulcast as the "true inline"
  // path — that pipeline is now live as of v1.7.0.
  const appDeeplink = `snssdk1233://user/profile/${HANDLE}`;
  const tiktokWebUrl = `https://www.tiktok.com/@${HANDLE}/live`;
  return (
    <div className="rounded-2xl overflow-hidden ring-2 ring-liveRed/60 relative bg-gradient-to-br from-cocoa via-[#3a1f17] to-cocoa text-eggshell">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 25% 30%, rgba(255,71,87,0.45), transparent 55%), radial-gradient(circle at 75% 65%, rgba(255,158,192,0.35), transparent 55%), radial-gradient(circle at 50% 100%, rgba(168,230,207,0.25), transparent 55%)',
          animation: 'fb-pulse 4.6s ease-in-out infinite',
        }}
      />
      <div className="relative aspect-video grid place-items-center px-5 sm:px-8 py-8">
        <div className="text-center max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-liveRed text-white px-3 py-1 text-xs font-extrabold mb-3 shadow-liveGlow">
            <span className="live-dot" /> 🔴 LIVE NOW · ON TIKTOK
          </div>
          <h3 className="display text-2xl sm:text-3xl text-eggshell leading-tight">
            {title || 'EMM is live on TikTok right now.'}
          </h3>
          <p className="text-eggshell/80 text-sm mt-2">
            TikTok blocks login-free in-page playback for lives. The squad usually
            taps <strong>Open in TikTok app</strong> — it autoplays and never asks to log in.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-2 text-left">
            <a
              href={appDeeplink}
              className="rounded-2xl bg-pancake text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
            >
              <span>📱 Open in TikTok app</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href={tiktokWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-eggshell text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
            >
              <span>↗ Open TikTok web</span>
              <span aria-hidden>→</span>
            </a>
            {ROBLOX_URL ? (
              <a
                href={ROBLOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-mint text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
              >
                <span>🎮 Join the Roblox session</span>
                <span aria-hidden>→</span>
              </a>
            ) : (
              <a
                href={`https://www.tiktok.com/@${HANDLE}/live`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-mint text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
              >
                <span>↗ Open TikTok page</span>
                <span aria-hidden>→</span>
              </a>
            )}
          </div>
          <p className="text-[11px] text-eggshell/55 mt-3">
            Want true inline playback?{' '}
            <strong>Start your Restream broadcast</strong> — once YT is live, the
            page auto-swaps to the YouTube embed which plays inline with zero login.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fb-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.95; transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
