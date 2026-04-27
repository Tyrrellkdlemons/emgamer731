'use client';

/**
 * SubscribeUnlockPanel — the FREE unlock funnel that promotes EMM's
 * YouTube subscriptions and TikTok follows. Displayed as a sticky panel
 * at the top of the brainrot figures section AND inside the BuyMethodSheet
 * when a visitor picks "Get it free".
 *
 * UX rhythm:
 *   1. Show the visitor's current credits + unlocks at a glance.
 *   2. Two big CTAs: SUBSCRIBE on YouTube, FOLLOW on TikTok — each
 *      grants 1 credit when self-attested (honor box).
 *   3. Live counter: "Watch X shorts → 1 credit" updates as visitors
 *      navigate to /watch and play. (Watch tracking happens on
 *      VideoPlayer in a follow-up; for now subscribe/follow alone is the
 *      fastest path to credits.)
 *   4. Spend credits inline by tapping any locked figure card.
 *
 * No personal data leaves the browser — credits live in localStorage only.
 */

import { useEffect, useState } from 'react';
import {
  readUnlocks,
  attestSubscribed,
  attestFollowed,
  subscribeUnlocks,
  type UnlockState,
} from '@/lib/unlock-store';

export function SubscribeUnlockPanel() {
  const [state, setState] = useState<UnlockState>(() => readUnlocks());

  useEffect(() => subscribeUnlocks(setState), []);

  return (
    <section
      aria-labelledby="unlock-funnel-title"
      className="rounded-3xl bg-gradient-to-br from-mint via-cream to-pancake/60 ring-1 ring-creamShade shadow-soft p-5 sm:p-6 mb-8"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cocoa text-eggshell px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            Free Unlock Funnel · she ate
          </div>
          <h2 id="unlock-funnel-title" className="display text-display-md text-cocoa mt-3 leading-tight">
            Subscribe + watch = free brainrots.
          </h2>
          <p className="text-cocoa/80 mt-2 max-w-xl">
            Every <strong>YouTube subscribe</strong>, every <strong>TikTok follow</strong>,
            and every <strong>3 shorts watched</strong> earns 1 credit. Spend a credit on any
            common or rare figure below. Limited and Mythic still require purchase.
          </p>
        </div>
        <div className="rounded-2xl bg-eggshell ring-1 ring-creamShade px-4 py-3 text-center min-w-[120px] shadow-soft">
          <div className="text-3xl font-extrabold text-syrup mono-tab">{state.credits}</div>
          <div className="text-[10px] uppercase tracking-widest text-cocoa/70 font-bold">credits</div>
          <div className="text-[10px] text-cocoa/60 mt-1">{state.unlocked.length} unlocked</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mt-4">
        <ActionButton
          done={state.subscribed}
          doneLabel="✓ Subscribed (thank you bestie)"
          ctaLabel="Subscribe on YouTube — earn 1 credit"
          accent="#FF0033"
          textOn="white"
          href="https://www.youtube.com/@EmGamer731?sub_confirmation=1"
          onAttest={() => setState(attestSubscribed())}
        />
        <ActionButton
          done={state.followed}
          doneLabel="✓ Following on TikTok"
          ctaLabel="Follow on TikTok — earn 1 credit"
          accent="#000"
          textOn="white"
          href="https://www.tiktok.com/@eatsswithemm"
          onAttest={() => setState(attestFollowed())}
        />
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-2 text-xs">
        <ProgressTile
          label="Shorts watched"
          value={state.watched.shorts.length}
          per={3}
          tip="3 shorts → 1 credit"
        />
        <ProgressTile
          label="Replays watched"
          value={state.watched.replays.length}
          per={1}
          tip="1 replay → 1 credit"
        />
        <ProgressTile
          label="Total credits earned"
          value={state.credits + state.unlocked.length}
          tip="lifetime in this browser"
        />
      </div>
    </section>
  );
}

function ActionButton({
  done, doneLabel, ctaLabel, accent, textOn, href, onAttest,
}: {
  done: boolean;
  doneLabel: string;
  ctaLabel: string;
  accent: string;
  textOn: string;
  href: string;
  onAttest: () => void;
}) {
  if (done) {
    return (
      <div className="rounded-2xl bg-mint/70 ring-1 ring-mint px-4 py-3 font-bold text-cocoa text-sm flex items-center gap-2">
        {doneLabel}
      </div>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // Set the attestation immediately so credits show right away.
        // The user is still going to YT/TikTok in the new tab.
        setTimeout(onAttest, 250);
      }}
      className="rounded-2xl px-4 py-3 font-bold text-sm shadow-soft hover:shadow-lifted transition-all flex items-center justify-between"
      style={{ background: accent, color: textOn }}
    >
      {ctaLabel}
      <span aria-hidden>→</span>
    </a>
  );
}

function ProgressTile({
  label, value, per, tip,
}: {
  label: string;
  value: number;
  per?: number;
  tip: string;
}) {
  const next = per ? per - (value % per) : null;
  return (
    <div className="rounded-2xl bg-eggshell/85 ring-1 ring-creamShade px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-cocoa/70 font-bold">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-extrabold mono-tab text-cocoa">{value}</span>
        {per && (
          <span className="text-[10px] text-cocoa/60">
            {next === per ? `+1 credit every ${per}` : `${next} away from next credit`}
          </span>
        )}
      </div>
      <div className="text-[10px] text-cocoa/55 mt-0.5">{tip}</div>
    </div>
  );
}
