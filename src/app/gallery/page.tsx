'use client';

/**
 * /gallery — "Brainrots" nav label.
 *
 * v1.6.3 routing rule (per creator):
 *   "the brainrot page in the nav should go to a page of the second
 *    screenshot and that second only"
 * → THIS page is now ONLY the 67 sellable Brainrot Figures + the
 *   subscribe-and-watch unlock funnel. The 67 educational fact cards
 *   moved to /breakfacts.
 */

import { FiguresGrid } from '@/components/brainrot/FiguresGrid';

export default function BrainrotsPage() {
  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-pancake/60 ring-1 ring-creamShade px-3 py-1 text-xs font-bold uppercase tracking-wider text-cocoa shadow-soft">
          <span aria-hidden>🤖</span> 67 Brot Figures · drops + unlocks
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          Collect the squad. No cap.
        </h1>
        <p className="text-cocoa/85 mt-3">
          Brot mascots, Roblox avatar fits, poster drops — every one of these is
          giving collector energy. Pay <strong>Robux</strong>, <strong>card</strong>,
          or <strong>PayPal</strong>. Or — even better — earn FREE unlocks by
          <strong> subscribing on YT + watching shorts</strong>. Sigma move.
        </p>
        <nav aria-label="Other surfaces" className="mt-3 flex flex-wrap gap-2 text-xs">
          <a className="pill bg-mint/40 hover:bg-mint" href="/breakfacts">
            🧠 Brainrot facts (67)
          </a>
          <a className="pill bg-pancake/40 hover:bg-pancake" href="/lookbook">
            📷 The Lookbook
          </a>
          <a className="pill bg-syrup/30 hover:bg-syrup/60" href="/live">
            🔴 Catch the live
          </a>
        </nav>
      </header>

      {/* The figures grid renders the SubscribeUnlockPanel at the top, then
          the family chips + 23-figure grid + monetization sheet. */}
      <FiguresGrid />
    </div>
  );
}
