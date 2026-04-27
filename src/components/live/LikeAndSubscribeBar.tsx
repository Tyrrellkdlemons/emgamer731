'use client';

/**
 * LikeAndSubscribeBar — sits beneath the live video. Lets visitors
 * like / follow / subscribe WITHOUT leaving emgamer731.netlify.app.
 *
 * How it stays "in-site":
 *   - Each button opens TikTok/YouTube in a small popup window
 *     (`window.open` with width/height) instead of redirecting the host
 *     tab. The user takes the action in the popup and closes it; the
 *     host site never unmounts.
 *   - On platforms that already have an active session (most users),
 *     the action is one tap. Cold visitors will get the platform's own
 *     login flow inside the popup — a UX they expect.
 *   - Each click also grants 1 unlock credit on our local unlock-store
 *     so the user immediately sees a reward (sigma move).
 *
 * Why popups (not full OAuth):
 *   - Full TikTok/YouTube OAuth integration would require app
 *     registration on each developer portal + approval. That's a
 *     pipeline ticket, not a v1 deliverable.
 *   - Popups give 95% of the perceived value with zero approval
 *     dependency — and they fall back gracefully to a new tab if the
 *     browser blocks popups.
 */

import { useEffect, useState } from 'react';
import { attestFollowed, attestSubscribed, readUnlocks } from '@/lib/unlock-store';

const TT_HANDLE = process.env.NEXT_PUBLIC_TIKTOK_HANDLE || 'eatsswithemm';
const YT_CHANNEL = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_HANDLE || 'EmGamer731';

function openPopup(url: string, title: string) {
  // Center the popup on the user's screen
  const w = 480;
  const h = 720;
  const x = window.screenX + (window.outerWidth  - w) / 2;
  const y = window.screenY + (window.outerHeight - h) / 2;
  const win = window.open(
    url, title,
    `width=${w},height=${h},left=${x},top=${y},menubar=no,toolbar=no,location=no,status=no`,
  );
  // If the browser blocked the popup, fall back to a new tab
  if (!win) window.open(url, '_blank', 'noopener,noreferrer');
}

type State = { credits: number; subscribed: boolean; followed: boolean; unlocked: number };

export function LikeAndSubscribeBar() {
  const [state, setState] = useState<State>({ credits: 0, subscribed: false, followed: false, unlocked: 0 });

  useEffect(() => {
    const s = readUnlocks();
    setState({ credits: s.credits, subscribed: s.subscribed, followed: s.followed, unlocked: s.unlocked.length });
  }, []);

  const onSubscribe = () => {
    openPopup(
      `https://www.youtube.com/@${YT_CHANNEL}?sub_confirmation=1`,
      'YouTube subscribe',
    );
    // Optimistically grant the credit — the user is going through with it
    const s = attestSubscribed();
    setState({ credits: s.credits, subscribed: s.subscribed, followed: s.followed, unlocked: s.unlocked.length });
  };
  const onFollow = () => {
    openPopup(
      `https://www.tiktok.com/@${TT_HANDLE}`,
      'TikTok follow',
    );
    const s = attestFollowed();
    setState({ credits: s.credits, subscribed: s.subscribed, followed: s.followed, unlocked: s.unlocked.length });
  };
  const onLikeLatest = () => {
    // Open the @user feed where the latest video is at top — viewer can
    // double-tap to like without leaving us.
    openPopup(`https://www.tiktok.com/@${TT_HANDLE}`, 'TikTok like');
  };

  return (
    <section
      aria-label="Show love"
      className="rounded-3xl bg-gradient-to-br from-cream via-eggshell to-pancake/40 ring-1 ring-creamShade p-4 shadow-soft"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="display text-lg sm:text-xl text-cocoa leading-tight">
          Show love · stay on the site
        </h3>
        <span className="text-[11px] uppercase tracking-widest font-bold text-cocoa/60">
          {state.credits} credits
        </span>
      </div>
      <p className="text-xs text-cocoa/70 mb-3">
        Each tap opens a small popup so you don&apos;t lose your place. Subscribe
        + follow earn you free brot-figure unlocks. Slay.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <ActionBtn
          label={state.subscribed ? '✓ Subscribed (thanks bestie)' : '🔔 Subscribe on YouTube'}
          done={state.subscribed}
          color={'#FF0033'} textColor={'#fff'}
          onClick={onSubscribe}
        />
        <ActionBtn
          label={state.followed ? '✓ Following on TikTok' : '🤍 Follow on TikTok'}
          done={state.followed}
          color={'#000'} textColor={'#fff'}
          onClick={onFollow}
        />
        <ActionBtn
          label={'❤ Like the latest TikTok'}
          done={false}
          color={'#FF4757'} textColor={'#fff'}
          onClick={onLikeLatest}
        />
      </div>
    </section>
  );
}

function ActionBtn({
  label, done, color, textColor, onClick,
}: { label: string; done: boolean; color: string; textColor: string; onClick: () => void }) {
  if (done) {
    return (
      <div className="rounded-2xl bg-mint/70 ring-1 ring-mint px-4 py-3 text-sm font-bold text-cocoa text-center">
        {label}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl px-4 py-3 text-sm font-extrabold shadow-soft hover:shadow-lifted transition-all active:scale-95"
      style={{ background: color, color: textColor, minHeight: 48 }}
    >
      {label}
    </button>
  );
}
