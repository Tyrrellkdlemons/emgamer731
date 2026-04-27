'use client';

/**
 * TikTokLiveStage — the most aggressive inline TikTok-live attempt we
 * can make from a static site. Per creator brief:
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

import { useEffect, useRef, useState } from 'react';

const HANDLE = process.env.NEXT_PUBLIC_TIKTOK_HANDLE || 'eatsswithemm';
const ROBLOX_URL = process.env.NEXT_PUBLIC_ROBLOX_EXPERIENCE_URL || '';

const SOURCES = [
  // Each candidate URL we'll race. Order = priority for fallback chain.
  { id: 'tt-embed',  url: `https://www.tiktok.com/embed/@${HANDLE}/live` },
  { id: 'proxitok', url: `https://proxitok.pabloferreiro.es/@${HANDLE}/live` },
  { id: 'vxtiktok', url: `https://vxtiktok.com/@${HANDLE}` },
  { id: 'tt-direct', url: `https://www.tiktok.com/@${HANDLE}/live` },
];

type Props = {
  /** Stream title for the hero card (when iframes fail). */
  title?: string;
  className?: string;
};

export function TikTokLiveStage({ title, className }: Props) {
  const [winner, setWinner] = useState<string | null>(null);
  const [probeDone, setProbeDone] = useState(false);
  const probesRef = useRef<HTMLDivElement>(null);

  // Probe race — kick off when component mounts.
  useEffect(() => {
    // Re-use sessionStorage cache so we don't re-probe across pages.
    try {
      const cached = sessionStorage.getItem('emg731:tt-live-winner');
      if (cached) {
        setWinner(cached === 'NONE' ? null : cached);
        setProbeDone(true);
        return;
      }
    } catch {}

    const probes = probesRef.current?.querySelectorAll('iframe');
    if (!probes?.length) return;

    let resolved = false;
    const cleanup: Array<() => void> = [];

    probes.forEach((frame) => {
      const id = frame.dataset.id || '';
      const onLoad = () => {
        if (resolved) return;
        // We can't introspect cross-origin iframe content, but `onload`
        // firing means the response wasn't blocked at the network level.
        // Combined with the 4s timeout, this is our best signal that
        // SOMETHING rendered (vs a "refused to connect" empty frame).
        resolved = true;
        setWinner(id);
        setProbeDone(true);
        try { sessionStorage.setItem('emg731:tt-live-winner', id); } catch {}
      };
      frame.addEventListener('load', onLoad);
      cleanup.push(() => frame.removeEventListener('load', onLoad));
    });

    // 4s timeout — none of the iframes fired load with usable content.
    const t = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setWinner(null);
        setProbeDone(true);
        try { sessionStorage.setItem('emg731:tt-live-winner', 'NONE'); } catch {}
      }
    }, 4000);
    cleanup.push(() => clearTimeout(t));

    return () => cleanup.forEach((fn) => fn());
  }, []);

  const winningSrc = winner ? SOURCES.find((s) => s.id === winner)?.url : null;

  return (
    <div className={'relative ' + (className ?? '')}>
      {/* Hidden probe iframes — we race them off-screen so visitors don't
          see flicker. Once a winner is chosen, we render the visible
          iframe at full size. */}
      <div
        ref={probesRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
      >
        {!probeDone && SOURCES.map((s) => (
          <iframe
            key={s.id}
            data-id={s.id}
            src={s.url}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ width: 1, height: 1, border: 0 }}
            title={`probe-${s.id}`}
          />
        ))}
      </div>

      {/* Visible player — only when probe succeeded */}
      {winner && winningSrc && (
        <div className="relative rounded-2xl overflow-hidden ring-2 ring-liveRed/60 bg-cocoa aspect-video">
          <iframe
            src={winningSrc}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            title={title ?? 'EMM live on TikTok'}
          />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-liveRed text-white px-2.5 py-1 text-xs font-extrabold shadow-liveGlow">
            <span className="live-dot" /> LIVE NOW · TIKTOK
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] uppercase tracking-widest text-eggshell/80 bg-cocoa/85 px-2 py-1 rounded-full">
            via {winner}
          </div>
        </div>
      )}

      {/* Probe failed → polished CTA hero card. We still pop something
          loud and live-themed instead of a vague "she's offline" panel. */}
      {probeDone && !winner && (
        <FallbackHero title={title} />
      )}

      {/* Probe in flight → loading shimmer */}
      {!probeDone && (
        <div className="aspect-video rounded-2xl ring-2 ring-liveRed/60 bg-gradient-to-br from-cocoa via-[#3a1f17] to-cocoa overflow-hidden relative grid place-items-center">
          <div className="text-center text-eggshell/85">
            <div className="inline-flex items-center gap-2 rounded-full bg-liveRed text-white px-3 py-1 text-xs font-extrabold mb-3 shadow-liveGlow">
              <span className="live-dot" /> CONNECTING TO LIVE…
            </div>
            <div className="display text-xl">Pulling EMM&apos;s TikTok stream</div>
            <div className="text-xs text-eggshell/60 mt-1">Trying 4 sources in parallel — first one wins.</div>
          </div>
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,71,87,0.35), transparent 50%), radial-gradient(circle at 70% 70%, rgba(168,230,207,0.30), transparent 50%)',
              animation: 'tts-pulse 3s ease-in-out infinite',
            }}
          />
          <style jsx>{`
            @keyframes tts-pulse {
              0%, 100% { opacity: 0.55; }
              50%      { opacity: 0.95; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function FallbackHero({ title }: { title?: string }) {
  // Animated gradient + three CTAs — the "if iframe fails, still flex" panel.
  const appDeeplink = `snssdk1233://user/profile/${HANDLE}`;
  const mirrorUrl = `https://proxitok.pabloferreiro.es/@${HANDLE}/live`;
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
              href={mirrorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-eggshell text-cocoa px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
            >
              <span>🌐 No-login mirror</span>
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
            <strong>Simulcast to YouTube</strong> via OBS / StreamLabs — when YT is
            live, this card auto-swaps to the iframe player which never asks to log in.
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
