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
          <span aria-hidden>🤖</span> 67 Brainrot Figures · drops + unlocks
        </div>
        <h1 className="display text-display-lg sm:text-display-xl text-cocoa mt-4 leading-tight">
          Collect the squad.
        </h1>
        <p className="text-cocoa/85 mt-3">
          Sellable EMM brainrot characters — chibi mascots, Roblox avatar fits,
          collector posters. Pay with <strong>Robux</strong>, <strong>card</strong>{' '}
          (Apple Pay / Google Pay), or <strong>PayPal</strong> — or earn unlocks
          for free by <strong>subscribing on YouTube + watching shorts</strong>.
        </p>
        <p className="text-sm text-cocoa/65 mt-2">
          Want the educational drops (the 67 brainrot facts)? Those live on{' '}
          <a className="text-syrup font-semibold hover:underline" href="/breakfacts">
            /breakfacts
          </a>{' '}
          now.
        </p>
      </header>

      {/* The figures grid renders the SubscribeUnlockPanel at the top, then
          the family chips + 23-figure grid + monetization sheet. */}
      <FiguresGrid />
    </div>
  );
}
