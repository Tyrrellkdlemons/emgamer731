'use client';

/**
 * AutoLiveRedirect — when EMM is broadcasting, automatically jump fresh
 * home-page visitors straight to the live stream surface so they don't have
 * to hunt for the player.
 *
 * Routing rules:
 *   - TikTok is live → push to `/live` (LiveHero embeds the TikTok player
 *     inline and is the primary live channel for Roblox).
 *   - YouTube is live (and TikTok is not) → push to `/watch` where the new
 *     YouTubeLiveBanner surfaces the inline player at the top.
 *   - Both live → prefer TikTok (creator's primary channel).
 *
 * Anti-annoyance guards (kept conservative — never redirect against the
 * user's clear intent):
 *   1. Only fires on the literal `/` route. We don't grab someone who
 *      deep-linked into `/about` etc.
 *   2. Sets a sessionStorage flag after redirecting so refreshing or
 *      coming back to home in the same tab doesn't bounce them again.
 *   3. Honours `?stay=1` query (or any `?stay`) — visitors who clicked
 *      "Home" intentionally from the live page get an escape hatch.
 *   4. Honours a `prefers-reduced-motion` proxy: if the document carries
 *      a `data-no-auto-live` attribute (settable via DevTools or future
 *      preference UI), we no-op.
 *
 * Mounted from `app/page.tsx` only — never on inner routes.
 */

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLiveStatus } from './LiveStatusProvider';

const SESSION_FLAG = 'emg731:autolive:redirected';

export function AutoLiveRedirect() {
  const router = useRouter();
  const search = useSearchParams();
  const { summary } = useLiveStatus();
  // Guard so the effect doesn't fire twice if React strict-mode double-invokes.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === 'undefined') return;

    // Visitor explicitly asked to stay
    if (search?.has('stay')) return;
    // Already redirected once in this session
    if (sessionStorage.getItem(SESSION_FLAG) === '1') return;
    // Manual opt-out
    if (document.documentElement.hasAttribute('data-no-auto-live')) return;
    // Live status not yet loaded
    if (!summary) return;

    const tt = summary.all?.find((s) => s.platform === 'tiktok'  && s.isLive);
    const yt = summary.all?.find((s) => s.platform === 'youtube' && s.isLive);

    let target: string | null = null;
    if (tt) target = '/live';        // TikTok is primary live channel
    else if (yt) target = '/watch';  // YouTube live shows up in /watch banner

    if (!target) return;

    fired.current = true;
    sessionStorage.setItem(SESSION_FLAG, '1');
    // Replace (not push) so the back button doesn't trap them on home.
    router.replace(target);
  }, [router, search, summary]);

  return null;
}
