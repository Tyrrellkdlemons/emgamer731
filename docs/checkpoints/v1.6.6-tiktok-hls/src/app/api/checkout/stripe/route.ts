import { NextResponse, type NextRequest } from 'next/server';

/**
 * Stripe checkout pipeline — placeholder. Returns a friendly HTML page with
 * the figure id and instructions for finishing the wiring once a real
 * STRIPE_SECRET + Price IDs land.
 *
 * To go live:
 *   1. Add STRIPE_SECRET_KEY to env.
 *   2. Create a Stripe Price for each figure rarity (or one per figure).
 *   3. Replace this handler with `stripe.checkout.sessions.create({ ... })`
 *      and return `NextResponse.redirect(session.url!)`.
 */
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const figure = req.nextUrl.searchParams.get('figure') ?? '';
  return new NextResponse(html(figure, 'stripe'), {
    headers: { 'content-type': 'text/html; charset=utf-8' },
    status: 200,
  });
}

function html(figure: string, provider: string) {
  const title = provider === 'stripe' ? 'Stripe Checkout' : 'PayPal Checkout';
  return `<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} — coming soon · EMGamer731</title>
<style>
  body { font-family: ui-sans-serif, system-ui, sans-serif; background: #FFFCF5; color: #3B2A22; max-width: 540px; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin: 0 0 0.5rem; }
  code { background: #F4ECDC; padding: 2px 6px; border-radius: 6px; font-family: ui-monospace, monospace; font-size: 0.9em; }
  a.btn { display: inline-block; margin-top: 1.5rem; background: #3B2A22; color: #FFFCF5; padding: 0.75rem 1.25rem; border-radius: 999px; font-weight: 700; text-decoration: none; }
</style></head><body>
<h1>${title} — coming soon 🥞</h1>
<p>You picked <strong>${figure || 'a figure'}</strong>. The ${provider} checkout pipeline is in place but waiting on live API keys.</p>
<p>Once configured, this page will redirect straight to ${provider} checkout.</p>
<p><strong>For now</strong> — try the <em>Subscribe + watch</em> path on the brainrot page to unlock free.</p>
<a class="btn" href="/gallery">← Back to Brainrots</a>
</body></html>`;
}
