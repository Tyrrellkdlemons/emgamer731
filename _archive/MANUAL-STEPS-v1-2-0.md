# EMGamer731 — Manual Steps Checklist for v1.2.0 Launch

> ⚠️ **SENSITIVE — OWNER PRIVATE.** This file contains the live-trigger secret seeds, environment-variable names, and step-by-step setup instructions. **Do NOT publish this file to the live site**, do not commit it to a public repo, and do not drop it into the Netlify deploy zip. Keep it in your password manager / encrypted folder alongside your domain credentials.

---

## Overview

The v1.2.0 build ships fully working out of the box — visitors can browse, watch videos inline (with the static seed), shop the 60-SKU catalog, and read every page. A handful of items require **your hands** because they involve credentials, accounts, or env variables I cannot create for you. This document is the single source of truth for those tasks, split into **Same-day** (do before announcing the site) and **Long-term** (do over the next 30 days).

Where each thing lives in code is shown in backticks so you can `grep` and find it.

---

## 1. YouTube auto-pull — `YOUTUBE_API_KEY`

**Why first:** without this, `/watch` and the home-page rail show only the 5 static seed entries from `src/data/latest-content.ts`. With this, every new YouTube upload (long-form AND Shorts) auto-flows in within 30 minutes.

**Same-day (5 minutes):**

1. Go to **https://console.cloud.google.com/** (sign in with any Google account — doesn't have to match the channel).
2. Create a new project (top bar → project dropdown → New Project → name: "EMGamer731").
3. **APIs & Services → Library → search "YouTube Data API v3" → click → Enable.**
4. **APIs & Services → Credentials → Create credentials → API key**. Copy the key (starts with `AIza...`).
5. (Recommended) Click the key → **Restrict key → Restrict to "YouTube Data API v3" only**. Save.
6. Netlify → Site settings → Environment variables → **Add a variable**:
   - Key: `YOUTUBE_API_KEY`
   - Value: paste the `AIza...` key
   - Scope: Production (+ Deploy previews if you want preview branches to work)
7. **Trigger deploy → Clear cache and deploy site.**
8. Open `https://emgamer731.com/api/youtube` — you should see real video items in JSON.

**Quota:** the default 10,000 units/day allowance is plenty. Each `/api/youtube` call costs ~100 units, we cache for 30 min → max ~5,000 units/day even with constant traffic.

**Where in code:** `src/lib/youtube/feed.ts` (the auto-pull strategy chain: API → RSS → static).

---

## 2. TikTok-live trigger — `TIKTOK_WEBHOOK_SECRET` + `ADMIN_LIVE_SECRET`

**Why this matters:** TikTok is your primary live-Roblox channel. The site needs to know when you're live so the red banner pops with the inline embed.

You have **three trigger paths** (set up either one — the more, the better):

### 2.1 Path A — TikTok webhook (best — fully automated)

1. Generate a long random string (e.g. paste a UUID + extra randomness from https://www.uuidgenerator.net/). Keep it.
2. Netlify env: add `TIKTOK_WEBHOOK_SECRET` = that string. Trigger deploy.
3. In **TikTok Live for Business** / **TikTok Studio** dashboard → Webhooks → add:
   - URL: `https://emgamer731.com/api/webhooks/tiktok-live`
   - Header: `X-EMG731-Webhook-Secret: <the same string>`
   - Events: `live.start` and `live.end`
4. Verify: open `https://emgamer731.com/api/webhooks/tiktok-live` — should return `{ ok: true, configured: true, handle: "eatsswithemm" }`.

When you start a TikTok live, the banner flips red within 60 seconds.

### 2.2 Path B — iPhone Shortcut (manual one-tap)

1. Generate another random string. Netlify env: add `ADMIN_LIVE_SECRET` = that string. Trigger deploy.
2. iPhone → **Shortcuts app → New Shortcut**:
   - Action: "Get Contents of URL"
   - URL: `https://emgamer731.com/api/admin/live-override`
   - Method: POST
   - Headers: `Authorization: Bearer <the string>`
   - Body (JSON): `{"title":"live on TikTok — Roblox","url":"https://www.tiktok.com/@eatsswithemm/live"}`
3. **Add to Home Screen** so it's one tap.
4. Make a second shortcut for `DELETE` (no body) to stop the banner.

### 2.3 Path C — Env-var override (slowest — requires Netlify redeploy)

In Netlify env: `MANUAL_LIVE_OVERRIDE=true`, `MANUAL_LIVE_PLATFORM=tiktok`, `MANUAL_LIVE_TITLE=...`, `MANUAL_LIVE_URL=https://www.tiktok.com/@eatsswithemm/live`. Trigger deploy. Banner stays on until you clear the override and redeploy.

**Where in code:** `src/lib/live-status/tiktok-store.ts`, `src/app/api/webhooks/tiktok-live/route.ts`, `src/app/api/admin/live-override/route.ts`. Full guide: `docs/live-trigger.md`.

---

## 3. Curated TikTok food posts — populate `EATS_TIKTOKS`

The `/eats` page is **hand-curated only** (per your rule: "perfect food only"). Right now it has 6 placeholder entries with empty `embedId` slots.

To add a real food TikTok:

1. Open the TikTok URL like `https://www.tiktok.com/@eatsswithemm/video/7400000000000000000`
2. Copy the long ID after `/video/`
3. Open `src/data/latest-content.ts` → find the `EATS_TIKTOKS` array
4. Update the matching entry (or add a new one):
   - `embedId: "7400000000000000000"`
   - `title: "Triple waffle stack moment"` (your real caption)
   - `thumbnail: "/images/gallery/breakfast-..."` or upload a fresh thumbnail
5. Commit + push (Netlify auto-rebuilds).

The page caps at the curated list — never auto-bulks all your TikToks. The grid scales to however many you add (1–20 range looks best).

**Where in code:** `src/data/latest-content.ts` → `EATS_TIKTOKS`.

---

## 4. Domain + SSL

Pick a domain (recommended: `emgamer731.com`):

1. Buy at any registrar (Cloudflare ~$10/yr, Namecheap, Porkbun).
2. Netlify dashboard → **Domain settings → Add custom domain → enter `emgamer731.com`**.
3. Add the DNS records Netlify shows (typically: A → Netlify load balancer + CNAME for www).
4. HTTPS auto-provisions via Let's Encrypt within 5–60 min.

**Verify after deploy:**

1. `https://emgamer731.com` → loads with valid cert (padlock, no warnings).
2. `http://emgamer731.com` → auto-redirects to HTTPS (HSTS kicks in on 2nd visit).
3. `https://www.emgamer731.com` → 301 → `https://emgamer731.com`.

Update `NEXT_PUBLIC_SITE_URL` env var in Netlify to whatever final domain you choose. Trigger redeploy.

---

## 5. HSTS preload submission (long-term — 30-day cooldown)

After 30+ days live with no SSL errors, submit `emgamer731.com` to https://hstspreload.org/ for permanent browser-baked HSTS. **Do not submit until fully committed to HTTPS-only on every subdomain.**

---

## 6. Drop the real avatar / hero / hoodie photos

These are already wired from `_use images/`. If you want to refresh any of them later:

| Refresh this | Drop into | Used by |
|---|---|---|
| Avatar | `public/images/avatars/uploads/character.jpeg` (or `.png`) | `AvatarCard.tsx` |
| Hero (desktop, wide) | `public/images/hero/breakfast-world-1.png` | `Hero.tsx` (sm+) |
| Hero (mobile, vertical-friendly) | `public/images/hero/breakfast-world-2.png` | `Hero.tsx` (mobile only) |
| Mint slogan hoodie photo | `public/shop/photo-hoodie-mint-breakfast.jpeg` | Product `p001` |
| Pink waffle hoodie photo | `public/shop/photo-hoodie-pink-waffle.jpeg` | Product `p002` |
| New product photo | `public/shop/photo-<slug>.jpeg`, then update `hero:` in `src/data/products.ts` | new SKU |

---

## 7. Shop fulfillment (when you're ready)

The shop is **presentation-only on day 1** (catalog browsing, no checkout). When you want to take orders:

**Recommended:** **Snipcart** (lowest setup cost, drop-in). Steps:
1. Sign up at https://snipcart.com (free until first sale, then 2% per transaction).
2. Add their script tag to `src/app/layout.tsx`.
3. Add `data-item-*` attributes to product cards in `src/components/shop/ShopGrid.tsx`.
4. Set up Stripe under Snipcart for payment.

**Alternative:** Shopify (heavier, but full back-office). Or hand-fulfilled via Etsy with the site as a brochure.

**Print-on-demand to start:** Printful, Printify, Gelato — bulk-upload your 20 new SKUs as designs, link from each product page until you do a real production run.

---

## 8. (Optional, future) YouTube Live cross-trigger

Auto-starting a YouTube Live broadcast when your TikTok Live starts is documented as a deferred OAuth-required path in `docs/live-trigger.md` section "Cross-platform". Most creators run dual streams via OBS Studio + Restream.io instead — simpler than wiring server-side. Skip for v1.2.

---

## 9. Operational hygiene

**Backups (weekly):** download the latest deploy zip from Netlify → Deploys. Copy `src/data/products.ts` to your password manager (it'll contain real product IDs once shop fulfillment is wired).

**Dependency updates (monthly):** `npm outdated`. Bump `next`, `react`, `framer-motion`, `tailwindcss` minor versions only — major versions need testing.

**Password manager — what to store:**
- Netlify login + 2FA backup codes
- Domain registrar login
- `YOUTUBE_API_KEY`
- `TIKTOK_WEBHOOK_SECRET` + `ADMIN_LIVE_SECRET`
- GitHub login + personal access token if you set up CI

---

## TL;DR — quick-launch checklist

In order, these are the **eight things that turn this from "deployed" into "auto-pulling and live-aware"**:

1. Push to GitHub via `scripts/push.ps1` (Windows) or `scripts/push.sh` (mac/Linux).
2. Connect Netlify to the repo (https://app.netlify.com/start → Import from GitHub → pick the repo → Deploy).
3. Add `YOUTUBE_API_KEY` env var → redeploy → verify `/api/youtube` returns real videos.
4. Generate `TIKTOK_WEBHOOK_SECRET` + add as env var. Configure TikTok Live for Business webhook with the same secret.
5. Generate `ADMIN_LIVE_SECRET` + add as env var. Make iPhone Shortcut for one-tap "go live" toggle.
6. Buy `emgamer731.com` and point to Netlify. Update `NEXT_PUBLIC_SITE_URL` env var. Redeploy.
7. Populate `EATS_TIKTOKS` with the real video IDs of your favorite food posts. Commit + push.
8. (30 days later) Submit to https://hstspreload.org/ for HSTS preload baking.

Everything else (shop fulfillment, dependency updates, weekly backups) is operational hygiene once the launch is done.

---

*Owner-private document. Store encrypted. Do not publish.*
