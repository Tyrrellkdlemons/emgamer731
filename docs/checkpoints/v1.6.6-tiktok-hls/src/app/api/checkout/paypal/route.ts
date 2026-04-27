import { NextResponse, type NextRequest } from 'next/server';

/**
 * PayPal checkout pipeline — placeholder. Mirrors the Stripe stub. To go
 * live, swap this handler for a PayPal `orders.create` flow and redirect
 * to the approval URL.
 */
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const figure = req.nextUrl.searchParams.get('figure') ?? '';
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>PayPal Checkout — coming soon · EMGamer731</title>
<style>
  body { font-family: ui-sans-serif, system-ui, sans-serif; background: #FFFCF5; color: #3B2A22; max-width: 540px; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.5; }
  h1 { font-size: 1.6rem; margin: 0 0 0.5rem; }
  a.btn { display: inline-block; margin-top: 1.5rem; background: #3B2A22; color: #FFFCF5; padding: 0.75rem 1.25rem; border-radius: 999px; font-weight: 700; text-decoration: none; }
</style></head><body>
<h1>PayPal Checkout — coming soon 🥞</h1>
<p>You picked <strong>${figure || 'a figure'}</strong>. The PayPal checkout pipeline is in place but waiting on a live merchant id.</p>
<a class="btn" href="/gallery">← Back to Brainrots</a>
</body></html>`;
  return new NextResponse(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
    status: 200,
  });
}
