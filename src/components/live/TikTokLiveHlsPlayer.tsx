'use client';

/**
 * TikTokLiveHlsPlayer — plays EMM's TikTok LIVE broadcast inline using
 * HLS.js + a `<video>` element. The broadcast URL comes from
 * `/api/tiktok-live-stream`, which scrapes TikTok's public live page for
 * the m3u8 pull URL.
 *
 * Why this is the cleanest TikTok-live workaround:
 *   - We never bypass auth, paywall, or DRM.
 *   - The HLS URL is publicly served by TikTok's CDN — same way YouTube
 *     Live's CDN segments are public.
 *   - HLS.js is a 30KB MIT-licensed library used by Vimeo, Twitch
 *     replays, and countless news sites.
 *   - On Safari + iOS, the browser plays HLS natively (no JS lib loaded).
 *
 * Behaviour:
 *   - Polls `/api/tiktok-live-stream` every 30s while mounted.
 *   - When `hlsUrl` arrives → load HLS.js (if needed), attach to the
 *     `<video>`, autoplay muted (browser autoplay policy compliant).
 *   - On any error (HLS.js load fail, manifest 4xx, network), call
 *     `onFallback` so the parent can render the iframe race / CTA card.
 *   - Re-mounts cleanly on URL rotation (TikTok rotates the URL every
 *     few minutes; we re-attach without unmounting the video element).
 */

import { useEffect, useRef, useState } from 'react';

type ApiResp = {
  isLive: boolean;
  hlsUrl?: string;
  flvUrl?: string;
  title?: string;
  viewerCount?: number;
  fetchedAt: string;
  source: string;
  error?: string;
};

type Props = {
  /** Called when HLS playback isn't possible — parent should fall back. */
  onFallback?: (reason: string) => void;
  /** Optional pre-known title (passed in from upstream live status). */
  fallbackTitle?: string;
};

const HLSJS_CDN =
  'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';

declare global {
  interface Window {
    Hls?: {
      isSupported(): boolean;
      new (config?: Record<string, unknown>): {
        loadSource(url: string): void;
        attachMedia(video: HTMLVideoElement): void;
        on(event: string, cb: (...args: unknown[]) => void): void;
        destroy(): void;
      };
      Events: { ERROR: string; MANIFEST_PARSED: string };
    };
  }
}

function loadHlsJs(): Promise<typeof window.Hls> {
  return new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const existing = document.getElementById('hlsjs-cdn') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Hls!));
      existing.addEventListener('error', () => reject(new Error('hls.js load failed')));
      return;
    }
    const s = document.createElement('script');
    s.id = 'hlsjs-cdn';
    s.src = HLSJS_CDN;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => (window.Hls ? resolve(window.Hls) : reject(new Error('hls.js missing')));
    s.onerror = () => reject(new Error('hls.js load failed'));
    document.head.appendChild(s);
  });
}

export function TikTokLiveHlsPlayer({ onFallback, fallbackTitle }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<ReturnType<NonNullable<Window['Hls']>['prototype']['constructor']> | null>(null);
  const [stream, setStream] = useState<ApiResp | null>(null);
  const [phase, setPhase] = useState<'probing' | 'playing' | 'failed'>('probing');
  const [viewers, setViewers] = useState<number | undefined>(undefined);

  // Poll the API every 30s for the current HLS URL (TikTok rotates them)
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      try {
        const res = await fetch('/api/tiktok-live-stream', { cache: 'no-store' });
        const data = (await res.json()) as ApiResp;
        if (cancelled) return;
        setStream(data);
        if (data.viewerCount != null) setViewers(data.viewerCount);
        if (!data.isLive || !data.hlsUrl) {
          setPhase('failed');
          onFallback?.(data.error ?? 'not live');
          return;
        }
        // Re-poll in 30s for URL rotation
        timer = setTimeout(poll, 30_000);
      } catch (e) {
        if (!cancelled) {
          setPhase('failed');
          onFallback?.(e instanceof Error ? e.message : 'fetch error');
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [onFallback]);

  // Attach the URL to the video — uses native HLS on Safari/iOS, otherwise HLS.js
  useEffect(() => {
    if (!stream?.hlsUrl) return;
    const video = videoRef.current;
    if (!video) return;

    let teardown = () => {};

    // Safari / iOS — native HLS support, no JS lib needed
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream.hlsUrl;
      const onPlay = () => setPhase('playing');
      const onErr = () => {
        setPhase('failed');
        onFallback?.('native HLS error');
      };
      video.addEventListener('playing', onPlay);
      video.addEventListener('error', onErr);
      video.play().catch(() => {/* autoplay-blocked is fine */});
      teardown = () => {
        video.removeEventListener('playing', onPlay);
        video.removeEventListener('error', onErr);
      };
      return teardown;
    }

    // All other browsers — load HLS.js
    let aborted = false;
    loadHlsJs()
      .then((Hls) => {
        if (aborted || !Hls?.isSupported()) {
          if (!aborted) {
            setPhase('failed');
            onFallback?.('HLS not supported');
          }
          return;
        }
        // Tear down any prior instance
        try { hlsInstance.current?.destroy(); } catch {}
        const h = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
        });
        hlsInstance.current = h;
        h.loadSource(stream.hlsUrl!);
        h.attachMedia(video);
        h.on(Hls.Events.MANIFEST_PARSED, () => {
          setPhase('playing');
          video.play().catch(() => {/* autoplay-blocked is fine */});
        });
        h.on(Hls.Events.ERROR, (_e: unknown, payload: unknown) => {
          const fatal = (payload as { fatal?: boolean })?.fatal;
          if (fatal) {
            setPhase('failed');
            onFallback?.('HLS fatal error');
          }
        });
      })
      .catch((e: Error) => {
        if (!aborted) {
          setPhase('failed');
          onFallback?.(e.message);
        }
      });

    teardown = () => {
      aborted = true;
      try { hlsInstance.current?.destroy(); } catch {}
      hlsInstance.current = null;
    };
    return teardown;
  }, [stream?.hlsUrl, onFallback]);

  // While probing or failed, render nothing (parent handles fallback UI)
  if (phase === 'failed') return null;

  return (
    <div className="relative rounded-2xl overflow-hidden ring-2 ring-liveRed/60 bg-cocoa">
      <video
        ref={videoRef}
        className="block w-full h-full"
        style={{ aspectRatio: '9/16', maxHeight: '70vh', margin: '0 auto' }}
        playsInline
        muted
        controls
        autoPlay
        poster={undefined}
        aria-label={stream?.title ?? fallbackTitle ?? 'EMM live on TikTok'}
      />
      {/* Live + viewers chip overlay */}
      <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-liveRed text-white px-2.5 py-1 text-xs font-extrabold shadow-liveGlow">
        <span className="live-dot" /> LIVE · TIKTOK
      </div>
      {viewers != null && viewers > 0 && (
        <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-cocoa/85 text-eggshell px-2.5 py-1 text-[11px] font-bold shadow-soft">
          👁 {viewers.toLocaleString()}
        </div>
      )}
      {phase === 'probing' && (
        <div className="absolute inset-0 grid place-items-center bg-cocoa/60 text-eggshell text-sm pointer-events-none">
          Pulling EMM&apos;s TikTok stream…
        </div>
      )}
    </div>
  );
}
