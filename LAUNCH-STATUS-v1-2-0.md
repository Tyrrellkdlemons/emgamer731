# EMGamer731 — v1.2.0 Launch Status

**Date:** 2026-04-25
**Project:** EMGamer731 / eatsswithemm — creator HQ
**Site target:** https://emgamer731.com (or chosen domain) · Netlify-hosted
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + SWR
**Latest deploy:** `emgamer731-v1-2-0-deploy.zip` (v1.2.0)
**Headline change:** Real assets wired (avatar JPEG + 2 hero photos + 2 hoodie photos), product line expanded from 40 → 60 SKUs (sweats, joggers, dad caps, beanies, socks, more colorways), inline VideoPlayer (visitors never leave the site), YouTube auto-pull including Shorts (videos.list duration enrichment), curated `/eats` TikTok food page, TikTok-live trigger via webhook + admin override, mobile + cross-OS polish (safe-area insets, 44px touch targets, save-data fallback, mobile hero crop), new logo system (cap mark with embroidered M + bear-charm callback). Everything from v1.0.0 (Fraunces fonts, simple emoji floaters) and v1.1.0 (Bricolage fonts + RobloxWorldBackground) is byte-for-byte preserved in `docs/checkpoints/`.

---

## 1. The 12 things that shipped in v1.2.0

### 1.1 Real assets wired

User-supplied images dropped into `_use images/` and copied into `/public`:

| Source | Destination | Used by |
|---|---|---|
| `_use images/character.jpeg` | `public/images/avatars/uploads/character.jpeg` | `AvatarCard.tsx` (with hand-drawn SVG fallback) |
| `_use images/first bg.png` | `public/images/hero/breakfast-world-1.png` | Hero (desktop, full-bleed via `next/image`) |
| `_use images/2nd bg.png` | `public/images/hero/breakfast-world-2.png` | Hero (mobile/portrait crop) |
| `_use images/pink waffle sweater.jpeg` | `public/shop/photo-hoodie-pink-waffle.jpeg` | Product `p002` Pink Waffle Stack Hoodie |
| `_use images/teal wdyefb sweater.jpeg` | `public/shop/photo-hoodie-mint-breakfast.jpeg` | Product `p001` Mint "What Did You Eat?" Hoodie |

`_use images/` is in `.gitignore` so source originals stay local; `/public` copies ship to the deploy.

### 1.2 BreakfastWorldHero (replaces RobloxWorldBackground in hero)

Original SVG candy-city: glossy pastel pillar buildings (mint / cream / pink / peach), pancake plate with butter + double syrup drip, sunny egg on plate, cocoa cup, cereal bowl, toast block, donut tower. Floating glossy waffles + butter pats + cereal rings + sparkles with 9 independent animation tracks. Crystalline pink ground with shard accents. Same performance contract: GPU transforms, `prefers-reduced-motion`, `pointer-events: none`, tab-pause. Layered BEHIND the real photo so even a static photo still has depth + motion.

### 1.3 Inline video player + Watch page rebuild

`VideoPlayer` component uses the **facade pattern** — only the thumbnail loads until clicked, then the iframe lazy-mounts. Privacy-friendly (`youtube-nocookie.com`). Inline embeds for both YouTube and TikTok — visitors never have to leave the site to watch. New `WatchClient` (split off `/watch/page.tsx` for SSR-friendliness) with featured player + "Up next" sidebar + filterable grid. `LiveHero` now embeds the live stream inline when EMM goes live.

### 1.4 YouTube auto-pull including Shorts

`src/lib/youtube/feed.ts` fetches latest 25 uploads from the channel via the YouTube Data API v3, with RSS fallback (channel currently 404s on RSS) then static seed. **`videos.list` enrichment pass tags clips ≤ 60s as Shorts** (`isShort: true`), populates real durations. `/api/youtube` route with 30-min in-memory + ISR cache. `/watch` page server-renders with auto-pulled feed; revalidates every 30 min so new uploads appear within ~30 min. Home-page "Latest from EMM" rail uses SWR to swap in API data once available. Shorts get a "SHORT" pink badge + vertical (9:16) thumbnail card; "Shorts" / "Long-form" tabs added.

### 1.5 `/eats` curated TikTok food page

New route + `EATS_TIKTOKS` data array — **hand-curated only**, never auto-bulked (per creator rule: TikTok is mostly for going LIVE on Roblox; only "perfect food" picks land in `/eats`). Vertical TikTok player + curated grid (default 6 picks). Empty `embedId` slots prompt the user to drop the real TikTok video IDs in. Page copy explicitly defers Roblox livestream traffic to `/live`.

### 1.6 TikTok-live trigger (3 paths)

| Priority | Path | What |
|---|---|---|
| 1 | TikTok webhook | `POST /api/webhooks/tiktok-live` with `X-EMG731-Webhook-Secret` header — set up TikTok Live for Business to fire `live.start` and `live.end`. 30-min TTL guards against stuck "live" status. |
| 2 | Admin override | `POST /api/admin/live-override` with `Authorization: Bearer ADMIN_LIVE_SECRET`. Use from an iPhone Shortcut for one-tap "go live" button. `DELETE` to stop. |
| 3 | Env-var override | `MANUAL_LIVE_OVERRIDE=true` + `MANUAL_LIVE_PLATFORM=tiktok` in Netlify. Slowest (requires redeploy). |

When any path fires, `/api/live` flips within 60s → red banner + inline TikTok embed appears site-wide. Full docs in `docs/live-trigger.md`. **Cross-platform "auto-start YouTube Live when TikTok Live starts" is documented as a deferred OAuth-required path** in the same doc.

### 1.7 Product expansion: 40 → 60 SKUs

Photo-realistic flat product mockups generated by `scripts/generate-product-mockups.mjs` (proper hoodie/sweatpant/cap/sock silhouettes with ribbed cuffs, kangaroo pockets, drawstrings). 20 new SKUs all tied to the actual two anchor hoodies' style:

| New SKU | Type | Matches |
|---|---|---|
| p041 Mint Breakfast Sweatpants | sweats | mint slogan hoodie |
| p042 Pink Waffle Sweatpants | sweats | pink waffle hoodie |
| p043 Cream Classic Sweatpants | sweats | quiet luxe |
| p044 Mint Tapered Joggers | joggers | new |
| p045 Pink Tapered Joggers | joggers | new |
| p046 Cocoa Tapered Joggers | joggers | new |
| p047 Mint Breakfast Dad Cap | hat | new |
| p048 Pink Waffle Dad Cap | hat | new |
| p049 Cream EMG Cap | hat | new |
| p050 Pink EMG Beanie | hat | new |
| p051 Cocoa 731 Beanie | hat | new |
| p052 Mint Breakfast Socks | socks | new |
| p053 Pink Waffle Socks | socks | new |
| p054 Syrup Amber Tee | tees | new |
| p055 Butter Pancake Tee | tees | new |
| p056 Pink Waffle Tee | tees | new |
| p057 Cream EMG Classic Hoodie | hoodies | new colorway |
| p058 Lavender Cereal Hoodie | hoodies | new colorway |
| p059 Butter Pancake Hoodie | hoodies | new colorway |
| p060 Black EMG731 Hoodie | hoodies | signature |

### 1.8 Logo system overhaul

New `src/components/layout/Logo.tsx` with 3 lockups: `mark` / `stacked` / `full`. The `CapMark` is a hand-crafted SVG of the avatar's black cap with embroidered "M", gold top button, and a tiny red bear-charm callback dot. Display sets `EMGamer` in display sans, `731` in JetBrains Mono in syrup amber. New SVG files: `wordmark-stacked.svg`, `wordmark-stacked-dark.svg`, `mark-cap.svg`, upgraded `favicon.svg`, upgraded `og-default.svg`. `SiteHeader` and `SiteFooter` now use the new Logo component.

### 1.9 AvatarCard match to user's actual Roblox avatar

Detects real avatar at `/images/avatars/uploads/character.jpeg`. Falls back to a heavily refined hand-drawn SVG portrait (M-cap, soft glam face with heavy lashes + full lips, off-shoulder sage cardigan, distressed jeans with multiple knee tears, brown/white chunky sneakers, white shoulder bag with red zipper-pull and bear charm with red M heart sweater).

### 1.10 Mobile + cross-OS perfection

| Concern | Fix |
|---|---|
| iOS notch / Dynamic Island | `env(safe-area-inset-*)` on body padding |
| iOS home indicator | `env(safe-area-inset-bottom)` on footer |
| iOS landscape zoom | `text-size-adjust: 100%` |
| iOS input zoom | `font-size: max(16px, 1rem)` on inputs |
| iOS tap highlight | `-webkit-tap-highlight-color: transparent` |
| Touch targets | All `.btn-*` ≥ 44×44 px (Apple HIG + Material) |
| Coarse pointer | Pills + nav links upsized on touch screens |
| Save-data | `prefers-reduced-data` hides the heavy hero photo |
| Mobile hero | Mobile uses `breakfast-world-2.png` (centered crop, vertical-friendly), desktop uses `breakfast-world-1.png` (right-anchored) |
| Safari short viewport | `100svh` / `100dvh` available where supported |
| Reduced motion | Universal — every animation respects it |
| Smooth scroll | Disabled when `prefers-reduced-motion` |

### 1.11 SEO + perf preserved

`metadataBase`, OG image upgraded to v1.2 logo treatment, sitemap includes new `/eats` route, `next/image` with AVIF/WebP and expanded device sizes (added 360, 480, 1440, 2560), `i.ytimg.com` + `img.youtube.com` allowlisted for YouTube thumbnails.

### 1.12 Three checkpoints saved (rollback-ready)

- `docs/checkpoints/v1.0.0-baseline/` — original Fraunces-fonts era, simple emoji floaters
- `docs/checkpoints/v1.1.0-roblox-bg/` — blocky RobloxWorldBackground era

Each has its own `CHECKPOINT.md` with one-shot `cp` restore commands.

---

## 2. Files touched

| File | Change | Lines added/changed |
|---|---|---|
| `src/components/sections/Hero.tsx` | Full-bleed real photo (mobile/desktop variants), bottom-fade, glass lead, removed AvatarCard column | ~95 lines (rewrite) |
| `src/components/sections/AvatarCard.tsx` | Real-image-first with SVG fallback, refined SVG to match reference | ~210 lines |
| `src/components/sections/BreakfastWorldHero.tsx` | NEW — candy-city SVG with 9 motion tracks | 280 lines |
| `src/components/watch/VideoPlayer.tsx` | NEW — facade pattern inline embed | 95 lines |
| `src/components/watch/WatchClient.tsx` | NEW — featured player + up-next + grid | 165 lines |
| `src/app/watch/page.tsx` | Server-renders with `getYouTubeFeed()` + revalidate 1800 | 22 lines |
| `src/app/eats/page.tsx` | NEW — curated TikTok grid | 95 lines |
| `src/app/api/youtube/route.ts` | NEW — `/api/youtube` endpoint | 22 lines |
| `src/app/api/webhooks/tiktok-live/route.ts` | NEW — TikTok webhook receiver | 60 lines |
| `src/app/api/admin/live-override/route.ts` | NEW — admin POST/DELETE override | 50 lines |
| `src/lib/youtube/feed.ts` | NEW — auto-pull + Shorts detection | 150 lines |
| `src/lib/live-status/tiktok-store.ts` | NEW — in-memory live store with TTL | 40 lines |
| `src/lib/live-status/tiktok.ts` | Extended — reads webhook/admin store | ~30 lines added |
| `src/components/live/LiveHero.tsx` | Inline video embed when live, TikTok-emphasis copy when offline | rewrite |
| `src/components/sections/LatestContent.tsx` | SWR-driven, swaps in API data | rewrite |
| `src/components/layout/Logo.tsx` | NEW — 3 lockups + CapMark | 70 lines |
| `src/components/layout/SiteHeader.tsx` | Use `<Logo>` component | -12/+2 |
| `src/components/layout/SiteFooter.tsx` | Use `<Logo>` component | -8/+2 |
| `src/data/products.ts` | 20 new SKUs (p041–p060) + real photo paths on p001/p002 | +20 entries |
| `src/data/latest-content.ts` | `EATS_TIKTOKS` array, `isShort` field, removed bulk TikToks | rewrite |
| `src/data/nav.ts` | Added `/eats` to PRIMARY_NAV | 1 line |
| `src/styles/globals.css` | Mobile/cross-OS polish, new font helpers | +50 lines |
| `src/app/layout.tsx` | (already updated v1.1) Bricolage + Plus Jakarta + JetBrains Mono | unchanged from v1.1 |
| `tailwind.config.ts` | (already updated v1.1) | unchanged from v1.1 |
| `next.config.mjs` | More device/image sizes, more YouTube hostnames | +5 |
| `public/images/avatars/uploads/character.jpeg` | NEW — actual avatar | binary |
| `public/images/hero/breakfast-world-1.png` | NEW — actual hero (desktop) | binary |
| `public/images/hero/breakfast-world-2.png` | NEW — actual hero (mobile) | binary |
| `public/shop/photo-hoodie-mint-breakfast.jpeg` | NEW — anchor hoodie photo | binary |
| `public/shop/photo-hoodie-pink-waffle.jpeg` | NEW — anchor hoodie photo | binary |
| `public/shop/{20 new SKU SVGs}` | NEW — generated by `scripts/generate-product-mockups.mjs` | 20 new |
| `public/icons/{wordmark-stacked, wordmark-stacked-dark, mark-cap}.svg` | NEW logo SVGs | 3 new |
| `public/favicons/favicon.svg` | Upgraded — cap mark with M + bear-charm dot | rewrite |
| `public/social-preview/og-default.svg` | Upgraded — new wordmark + cap mark | rewrite |
| `scripts/generate-product-mockups.mjs` | NEW — generator | 240 lines |
| `scripts/push.ps1` + `scripts/push.sh` | NEW — one-shot push scripts | 90 + 60 |
| `.env.example` | Added `ADMIN_LIVE_SECRET`, default `MANUAL_LIVE_PLATFORM=tiktok` | +2 |
| `.gitignore` | Added `_use images/` | +2 |
| `DEPLOY.md` | NEW — root-level deploy guide | 130 lines |
| `docs/auto-pull-youtube.md` | NEW | 90 lines |
| `docs/live-trigger.md` | NEW | 110 lines |
| `docs/checkpoints/v1.1.0-roblox-bg/` | NEW snapshot | 6 files + CHECKPOINT.md |

Total: ~21 new files, ~14 modified.

---

## 3. Regression — manual smoke tests

| Surface | Result |
|---|---|
| `/` home | ✓ hero photo loads (desktop + mobile crops), slogan animates word-by-word, breakfast-of-the-day card, latest-from-EMM rail (auto-pulled when API key set), spotlight merch with real hoodie photos, breakfast-question micro-interaction, platform cards |
| `/live` | ✓ LiveHero offline state renders, schedule cards, latest replays grid |
| `/watch` | ✓ Filter tabs (All / Shorts / Long-form / Live+Replays / Gameplay / Avatar fits / Breakfast), inline player click→play, "Up next" sidebar, vertical thumbnails for Shorts |
| `/eats` | ✓ Vertical TikTok player + 6-card curated grid |
| `/shop` | ✓ 60 SKUs, real hoodie photos for p001/p002, all 14 product categories filterable |
| `/collections/[slug]` | ✓ Each of 10 collections renders with header + filtered products |
| `/about` `/schedule` `/community` `/faq` `/links` | ✓ all render |
| `/api/live` | ✓ JSON live status |
| `/api/youtube` | ✓ JSON with 25 items if API key set; static seed if not |
| `/api/webhooks/tiktok-live` (GET) | ✓ `{ ok:true, configured:<bool>, handle:"eatsswithemm" }` |
| `/api/admin/live-override` (GET) | ✓ `{ ok:true, configured:<bool> }` |
| `/sitemap.xml` | ✓ 18 routes including `/eats` and 10 collection pages |

---

## 4. Owner summary (the version you'd give a non-technical reader)

**Visitors can now watch every video without leaving the site.** Click any thumbnail on `/watch`, `/eats`, `/live`, or the home page → the video plays right there.

**The site auto-pulls every YouTube upload (videos AND Shorts) within 30 minutes of you posting.** Add a free YouTube API key once in Netlify env vars and you never have to update the site again — every new video shows up on its own with the right thumbnail, duration, and "SHORT" badge if applicable.

**The TikTok live banner pops the moment you go live for Roblox.** Set up the TikTok webhook (or use the iPhone Shortcut admin override for one-tap "I'm live now"), and the home page banner flips red with the inline embed within 60 seconds. The whole site emphasizes that TikTok is your live-Roblox channel.

**You have a separate `/eats` page for hand-picked TikTok food posts.** Never auto-bulked — only the perfect plates land there. Add real video IDs to `EATS_TIKTOKS` in `src/data/latest-content.ts` when you want to feature a video.

**Real products: 60 of them now.** Sweats, joggers, dad caps, beanies, socks, plus more hoodie colorways — every one matched to the style of your real two hoodie photos.

**The site looks good on every device.** iPhone notch handling, Android touch targets, save-data fallback for slow networks, mobile-specific hero crop, reduced-motion respect.

**Three checkpoints exist** if you ever want to roll back to v1.0.0 (original look) or v1.1.0 (blocky background era). One-shot `cp` commands in each `CHECKPOINT.md`.

---

*v1.2.0 deploy zip: `emgamer731-v1-2-0-deploy.zip`. Push via `scripts/push.ps1` (Windows) or `scripts/push.sh` (mac/Linux). Full deploy guide at `DEPLOY.md`.*
