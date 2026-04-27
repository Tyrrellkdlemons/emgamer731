'use client';

/**
 * TikTokProfileEmbed — renders TikTok's official `<blockquote class="tiktok-embed">`
 * inline so all of @eatsswithemm's videos play DIRECTLY on emgamer731 — visitors
 * never have to leave the site to watch.
 *
 * Two flavours:
 *   <TikTokProfileEmbed handle="eatsswithemm" />   → renders the latest profile feed
 *   <TikTokProfileEmbed videoId="7400000000000000000" handle="eatsswithemm" />
 *                                                   → renders one specific video
 *
 * Implementation notes:
 *   - We inject the TikTok embed.js script ONCE (de-duped by tag id) on first mount.
 *   - The script auto-rewrites every <blockquote class="tiktok-embed"> on the page
 *     into a sized iframe player, so we just render the blockquote scaffold.
 *   - We re-call window.tiktokEmbed.lib.render() (when present) on subsequent mounts
 *     so client-side route changes still hydrate the players.
 *   - Width is fluid, max 605 (TikTok's max). Aspect is approximately 9:16.
 */

import { useEffect, useRef } from 'react';

type Props = {
  /** Handle without the @ — defaults to eatsswithemm */
  handle?: string;
  /** Optional specific TikTok video ID. If omitted, renders the profile feed. */
  videoId?: string;
  /** Optional className for the wrapper. */
  className?: string;
};

const SCRIPT_ID = 'tiktok-embed-script';
const SCRIPT_SRC = 'https://www.tiktok.com/embed.js';

declare global {
  interface Window {
    tiktokEmbed?: { lib?: { render?: (els?: HTMLElement[]) => void } };
  }
}

function ensureScript(onReady: () => void) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    // Already loaded — let TikTok re-scan
    onReady();
    return;
  }
  const s = document.createElement('script');
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = SCRIPT_SRC;
  s.onload = onReady;
  document.body.appendChild(s);
}

export function TikTokProfileEmbed({ handle = 'eatsswithemm', videoId, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureScript(() => {
      try {
        // Force TikTok to re-scan and render any blockquotes inside our wrapper.
        window.tiktokEmbed?.lib?.render?.(
          ref.current ? Array.from(ref.current.querySelectorAll('blockquote.tiktok-embed')) as HTMLElement[] : undefined,
        );
      } catch {
        /* noop — TikTok script will still process on its own onload pass */
      }
    });
  }, [handle, videoId]);

  return (
    <div ref={ref} className={'w-full ' + (className ?? '')}>
      {videoId ? (
        // Single-video embed
        <blockquote
          className="tiktok-embed"
          cite={`https://www.tiktok.com/@${handle}/video/${videoId}`}
          data-video-id={videoId}
          style={{ maxWidth: 605, minWidth: 280, margin: '0 auto' }}
        >
          <section>
            <a target="_blank" rel="noreferrer" href={`https://www.tiktok.com/@${handle}/video/${videoId}`}>
              Loading TikTok…
            </a>
          </section>
        </blockquote>
      ) : (
        // Profile feed — TikTok renders the creator's latest videos as a vertical scroll
        <blockquote
          className="tiktok-embed"
          cite={`https://www.tiktok.com/@${handle}`}
          data-unique-id={handle}
          data-embed-type="creator"
          style={{ maxWidth: 780, minWidth: 288, margin: '0 auto' }}
        >
          <section>
            <a target="_blank" rel="noreferrer" href={`https://www.tiktok.com/@${handle}`}>
              @{handle} on TikTok — loading feed…
            </a>
          </section>
        </blockquote>
      )}
    </div>
  );
}
