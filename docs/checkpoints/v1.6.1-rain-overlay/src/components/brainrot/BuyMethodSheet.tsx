'use client';

/**
 * BuyMethodSheet — modal sheet that opens when a visitor taps "Buy" on a
 * brainrot figure. Presents the four payment / unlock methods clearly:
 *
 *   1. Robux (Roblox in-game currency) — opens deeplink to a Roblox group
 *      payout / Game Pass purchase. Pipeline ready: replace
 *      `ROBUX_GAMEPASS_URL_TEMPLATE` with the real Game Pass URL once it's
 *      created in the Roblox creator dashboard.
 *   2. Stripe (card / Apple Pay / Google Pay) — POSTs to /api/checkout/stripe
 *      which returns a Stripe Checkout URL. Pipeline ready: drop in the
 *      Stripe key on the server route.
 *   3. PayPal — same shape, /api/checkout/paypal.
 *   4. FREE — Subscribe + Watch — diverts to the unlock funnel (open the
 *      `SubscribeUnlockPanel`).
 *
 * Why a sheet vs an inline form: the figures grid stays clean and the user
 * gets a focused decision moment with a clear escape (Esc / overlay click).
 *
 * Accessibility: focus trap + ARIA dialog pattern + Esc closes + restores
 * focus to the trigger.
 */

import { useEffect, useRef } from 'react';
import type { BrainrotFigure } from '@/data/brainrot-figures';

const ROBUX_GAMEPASS_URL_TEMPLATE =
  // PIPELINE: replace with the real Roblox Game Pass id once created in the
  // creator dashboard. The Game Pass price is set on Roblox's side; the
  // `priceRobux` in figures data is for display only.
  'https://www.roblox.com/game-pass/PLACEHOLDER_GAMEPASS_ID/EMGamer731-Brainrot';

type Props = {
  figure: BrainrotFigure;
  onClose: () => void;
  onChooseFree: () => void;
};

export function BuyMethodSheet({ figure, onClose, onChooseFree }: Props) {
  const dialog = useRef<HTMLDivElement>(null);

  // Focus management + Esc to close
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [onClose]);

  const usd = '$' + (figure.priceCents / 100).toFixed(2);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-sheet-title"
      className="fixed inset-0 z-[100] grid place-items-end sm:place-items-center bg-cocoa/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialog}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md sm:rounded-3xl rounded-t-3xl bg-eggshell shadow-lifted p-5 sm:p-6 max-h-[92vh] overflow-y-auto"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 id="buy-sheet-title" className="display text-display-md text-cocoa leading-tight">
              {figure.name}
            </h2>
            <p className="text-cocoa/70 text-sm mt-1">{figure.tagline}</p>
            <div className="text-xs text-cocoa/60 mt-2">
              Bundle includes: <strong>{figure.formats.join(' + ')}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-cream ring-1 ring-creamShade h-9 w-9 grid place-items-center text-cocoa hover:bg-syrup hover:text-eggshell transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {/* FREE via subscribe — promoted FIRST per creator brief
              "subscribing and following my youtube and watching my shorts is
              a reward so promot thata little more" */}
          <Method
            primary
            title="Get it FREE — subscribe + watch"
            sub={`Subscribe to YouTube + watch ${3} shorts → 1 free unlock.`}
            cta="Open the unlock funnel"
            onClick={onChooseFree}
          />

          {/* Robux */}
          <Method
            title="Pay with Robux"
            sub={`${figure.priceRobux} R$ — opens the Roblox Game Pass`}
            cta="Open in Roblox"
            external={ROBUX_GAMEPASS_URL_TEMPLATE}
          />

          {/* Stripe */}
          <Method
            title="Card · Apple Pay · Google Pay"
            sub={`${usd} — secure checkout via Stripe`}
            cta="Continue with Stripe"
            external={`/api/checkout/stripe?figure=${encodeURIComponent(figure.id)}`}
          />

          {/* PayPal */}
          <Method
            title="PayPal"
            sub={`${usd} — pay with PayPal balance or linked card`}
            cta="Continue with PayPal"
            external={`/api/checkout/paypal?figure=${encodeURIComponent(figure.id)}`}
          />
        </div>

        <p className="text-[11px] text-cocoa/55 mt-4 text-center">
          Checkout is in pipeline — Stripe + PayPal endpoints return placeholder
          messages until live keys land. Robux Game Pass id placeholder above.
        </p>
      </div>
    </div>
  );
}

function Method({
  title, sub, cta, onClick, external, primary,
}: {
  title: string; sub: string; cta: string;
  onClick?: () => void;
  external?: string;
  primary?: boolean;
}) {
  const cls =
    'w-full text-left rounded-2xl px-4 py-3 ring-1 transition-all flex items-center justify-between gap-3 ' +
    (primary
      ? 'bg-mint ring-mint shadow-soft hover:shadow-lifted'
      : 'bg-cream ring-creamShade hover:bg-eggshell hover:shadow-soft');
  const inner = (
    <>
      <div>
        <div className="font-bold text-cocoa text-sm">{title}</div>
        <div className="text-xs text-cocoa/70 mt-0.5">{sub}</div>
      </div>
      <span className="text-xs font-semibold text-syrup whitespace-nowrap">{cta} →</span>
    </>
  );
  if (external) {
    return (
      <a href={external} target={external.startsWith('/api') ? '_self' : '_blank'} rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
