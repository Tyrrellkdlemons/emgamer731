# Changelog — EMGamer731

All notable changes are recorded here. Newest first.

## [1.7.5] — 2026-04-27 — Multi-platform pills · skip dead TikTok iframe race · sanitized titles

### Changed
- **`LiveHero`** now renders ONE pill per actively-live platform side-by-side. When EMM is simulcasting via Restream, viewers see both `LIVE on YOUTUBE` (red) and `LIVE on TIKTOK` (red) pills instead of a single primary-platform badge. Sub-text adapts: "— pick a platform below" when 2+ are live, "— playing inline below" when one.
- **`LiveHero` title sanitizer** — filters out scrape-junk titles before they reach the H2. Patterns blocked: `__probe__` iframe leaks, `probe-tt-direct`, `Log in | TikTok` (login-wall page titles), too-short strings, `New Tab`, etc. Falls back to the friendly default ("EMM is live — pull up a chair…").
- **`TikTokLiveStage` simplified to 2 tiers** — HLS player → FallbackHero CTA card. The 2-iframe race (tt-embed, tt-direct) was REMOVED entirely because TikTok serves all live pages with `X-Frame-Options: DENY`, so the iframe `onload` fires for the HTTP response but the rendered content is blocked by the browser. Visitors saw an empty dark frame stamped "VIA TT-DIRECT" instead of the polished CTA card. Removed dead code: probe iframes, sessionStorage cache, race timeout, loading shimmer.

### Fixed
- The "`__probe__`" heading visible in `/live` when scrape returned junk title.
- The empty/broken player frame after HLS extraction failed — now shows polished CTA card with "Open in TikTok app" deeplink immediately.

### Workflow
- Saved checkpoint snapshot at `docs/checkpoints/v1.7.5-cf-worker-stable/`.


## [1.7.4] — 2026-04-27 — TOS-guard layer on the Cloudflare Worker + one-click deploy

### Added — TOS protection on the Worker
- **Circuit breaker** — if TikTok returns 429 or 403 three times in a 5-minute window, the Worker stops probing for 30 minutes and serves cached "not live" responses. We honour their "stop hitting us" signal.
- **Per-IP rate limit** — max 30 req/min per requester IP. Defends the Worker from being discovered and used as a free public TikTok scraper.
- **Cache TTL bumped 60 s → 120 s** — TikTok HLS URLs are valid for several minutes; less aggressive scraping = better neighbour.
- **Honest identification** (opt-in via `IDENTIFY_SOURCE=true`, on by default in `wrangler.toml`) — adds `X-EMGamer731-Source` and `X-EMGamer731-Purpose` headers so a TikTok engineer reading their logs can identify who we are without breaking anti-bot detection. Custom X- headers aren't part of browser fingerprinting.
- **Public-content-only guarantee** — Worker only ever hits `tiktok.com/@<handle>/live`, the page any logged-out browser can see. Never touches authenticated APIs, never decrypts anything, never scrapes private content or other users.

### Added — Deploy automation
- **`deploy-cloudflare-worker.bat`** — double-click to install Wrangler if missing, kick off Cloudflare OAuth (opens browser), then deploy. Subsequent runs skip the auth step.

### Notes
- These guards put us at the most defensible end of the gray-area scraping spectrum: respectful, identifiable, public-content-only, self-throttling. Doesn't make scraping "TOS-approved" (TikTok TOS prohibits all automated access), but it minimises real-world risk and signals good-faith use.


## [1.7.3] — 2026-04-27 — Cloudflare Workers TikTok scraper upgrade

### Added
- **`cloudflare-worker/`** — new directory with a deployable Cloudflare Worker that scrapes TikTok's public live page with rotating User-Agents, realistic browser headers (Sec-CH-UA, Accept-Language, Sec-Fetch-*, Referer), and 60 s edge cache. CF's massive IP pool delivers a much higher hit rate against TikTok's anti-bot than a single-region Netlify function. Free tier: 100 000 req/day. Includes `wrangler.toml`, `package.json`, `tsconfig.json`, README with 3-command deploy.

### Changed
- **`/api/tiktok-live-stream` Netlify route** now optionally proxies through the Cloudflare Worker if `TIKTOK_SCRAPER_WORKER_URL` env is set. Worker call has an 8 s timeout; on error the route falls through to the local scrape — zero downtime, zero regression.
- **Local scrape upgraded with same techniques** as the Worker — rotating UA pool (5 real Chrome/Safari/Firefox/iPhone UAs), randomized Accept-Language, full Sec-CH-UA browser-hint headers, Referer header. Even without deploying the Worker, hit rate against TikTok improves immediately.

### Workflow
- Site keeps working with Netlify-only scrape today. To activate the Worker:
  1. `cd cloudflare-worker && wrangler login && wrangler deploy`
  2. Add `TIKTOK_SCRAPER_WORKER_URL = <worker URL>` to Netlify env
  3. Trigger redeploy. Site auto-switches to Worker; admin override + fallbacks unaffected.


## [1.7.2] — 2026-04-27 — Hotfix: dead TikTok mirror was showing takedown notice

### Fixed
- **Removed `proxitok.pabloferreiro.es` and `vxtiktok.com`** from the TikTokLiveStage iframe race. proxitok was taken down via a legal request and now serves a takedown HTML page at HTTP 200 — its `onload` event fired, "winning" the race, and visitors saw "Due to a legal request, this service is no longer available." instead of the stream. Race now uses TikTok's own surfaces only (`tiktok.com/embed/@<handle>/live` and `tiktok.com/@<handle>/live`).
- **`FallbackHero` mirror CTA → TikTok web URL.** "🌐 No-login mirror" button replaced with "↗ Open TikTok web" pointing at TikTok's actual live page.
- **`sessionStorage` cache key bumped to `v2`.** Existing visitors who had `proxitok` cached as the winner from before the fix get re-probed cleanly.
- **Help-text copy updated** to reference Restream simulcast as the path to true inline playback (now real as of v1.7.0).


## [1.7.1] — 2026-04-27 — Hotfix: live player shows for any platform (not Roblox-only)

### Fixed
- **`LiveHero` no longer filters lives by Roblox keyword.** v1.6.4 added an `isRobloxLive` gate that required `live.isRoblox === true` OR `platform === 'youtube'` to pop the inline player. Auto-detected TikTok titles like "eatsswithem (@eatsswithemm) is LIVE - TikTok LIVE" never contain "roblox" or "rblx", so the gate suppressed real broadcasts and showed the "EMM is offline" panel instead. Replaced with a simple `isLiveNow = isLive && !!live` check — every live broadcast now pops the butter-toast player. The DualPlatformLivePlayer + fallback chain (HLS m3u8 → 4-iframe race → CTA card) already handle every surface gracefully, so no other guard is needed.


## [1.7.0] — 2026-04-27 — Restream simulcast · dual-platform live picker

### Added
- **`DualPlatformLivePlayer`** component — when EMM is simulcasting via Restream.io to both YouTube and TikTok, visitors see a tab control to pick which surface to watch on (YouTube default — cleanest no-login embed). Includes a "📱 Open in TikTok app" deeplink and a TikTok web link.
- Restream.io account paired with YouTube channel **EmGamer731** + TikTok **eatsswithem(m)**. Both destinations toggled on; one Restream broadcast → both platforms.

### Changed
- `LiveHero` swapped `NoLoginLivePlayer` → `DualPlatformLivePlayer` (2-line change). Butter-toast frame and Like/Subscribe bar untouched.
- When only one platform is live, the picker hides itself and behaviour is identical to v1.6.x — no regressions.

### Workflow
- Per TKDL workflow: `LAUNCH-STATUS-v1-3-0`, `NEXT-STEP-YT-SIMULCAST`, `CONNECT-MY-TIKTOK`, `CHECKPOINT_2026-04-25` moved to `_archive/`. Fresh `LAUNCH-STATUS-v1-7-0.md` written.

### Notes
- TikTok destination may show as "pending" on Restream's side after first connect; the picker simply doesn't appear until both are active. YouTube embed plays solo in the meantime.
- Admin `/admin/live` (token: `gems`) still flips the manual banner if you want to go live before Restream activates.


## [1.3.0] — 2026-04-26 — Giant theme upgrade · banner-sky hero · Avatar Fits rail · real merch listings · 67-slang copy

### Added
- New banner-sky hero photo (`breakfast-world-banner.png`) on desktop with the gold "WHAT DID YOU EAT FOR BREAKFAST?" banner across the sky. Mobile keeps the centered crop.
- New `Avatar Fits` rail on the home page: 13 EMM avatar renders across 99 Nights, Met Gala, Celestial Moon, Demon Queen, Petit-déjeuner Couture, Breakfast Runway, LV Street Luxe, Princess Satin PJs, BRAINROT IS MY LOVE LANGUAGE, and the cereal sticker.
- New `ProductPhoto` component + `heroCrop` field on `Product` — splits a single composite photo into many real product listings via CSS `background-position` math (no image processing required).
- 14 new SKUs (p061–p074) wired to the four real composite product photos and the cereal sticker.
- Gen-Z / 67-slang weave across all major copy spots (Hero, BreakfastOfTheDay, BreakfastQuestion, LatestContent, CollectionsRail, FeaturedMerch, LiveHero, 404).

### Changed
- `FeaturedMerch` now uses `ProductPhoto` so cropped composites render correctly when featured.
- `ShopGrid` background changed from cream-shade to white for cleaner product photo display.
- Pre-upgrade snapshot saved to `docs/checkpoints/v1.2.1-merch-real/`.

### Workflow
- Per TKDL TECH conventions: `LAUNCH-STATUS-v1-2-0`, `HEALTH-CHECK-v1-2-0`, `MANUAL-STEPS-v1-2-0`, `HANDOFF-v1-2-0` moved to `_archive/`. Fresh `LAUNCH-STATUS-v1-3-0.md` written.


## [1.2.0] — 2026-04-25 — Real assets · product expansion · logo overhaul · video integration · YouTube auto-pull · /eats

### Added — Inline video player + Watch overhaul
- New `VideoPlayer` component with the **facade pattern**: only the thumbnail loads until clicked, then the iframe lazy-mounts. Privacy-friendly (`youtube-nocookie.com`).
- Inline embeds for both YouTube and TikTok — visitors never have to leave the site to watch.
- New `WatchClient` (split off `/watch/page.tsx` for SSR-friendliness) with featured player + "Up next" sidebar + filterable grid.
- `LiveHero` now embeds the live stream inline when EMM goes live (instead of just linking out).

### Added — YouTube auto-pull + Shorts
- `src/lib/youtube/feed.ts` — fetches latest 25 uploads from the channel via the YouTube Data API v3, with RSS fallback then static seed.
- `videos.list` enrichment pass tags clips ≤ 60s as **Shorts** (`isShort: true`), populates real durations.
- `/api/youtube` route with 30-min in-memory + ISR cache.
- `/watch` page now server-renders with auto-pulled feed; revalidates every 30 min so new uploads appear within ~30 min.
- Home-page "Latest from EMM" rail uses SWR to swap in API data once available.
- Shorts get a "SHORT" pink badge + vertical (9:16) thumbnail card; "Shorts" / "Long-form" tabs added.
- See `docs/auto-pull-youtube.md` for full documentation + the 5-minute YouTube key setup.

### Added — `/eats` curated TikTok food page
- New route + `EATS_TIKTOKS` data array — **hand-curated only**, never auto-bulked.
- Vertical TikTok player + curated grid (default 6 picks).
- Page copy emphasizes that TikTok's primary role is LIVE for Roblox, not bulk content.
- Empty `embedId` slots prompt the user to drop the real TikTok video IDs in.

### Added — TikTok role clarity
- Primary nav adds `/eats` (between Watch and Gallery).
- Offline `LiveHero` now points at `https://www.tiktok.com/@eatsswithemm/live` with "Roblox lives are mostly on TikTok" copy.
- TikToks removed from the home-page latest rail (only YouTube + Shorts surface in the auto-feed).

### Added — REAL assets wired

### Added — REAL assets wired
- User-supplied images placed in `_use images/` and copied into `/public`:
  - `public/images/avatars/uploads/character.jpeg` — actual Roblox avatar (now used in `AvatarCard`)
  - `public/images/hero/breakfast-world-1.png` — primary hero photo (used full-bleed in Hero)
  - `public/images/hero/breakfast-world-2.png` — alternate hero variant (rotation-ready)
  - `public/shop/photo-hoodie-mint-breakfast.jpeg` — actual mint slogan hoodie photo (anchor product)
  - `public/shop/photo-hoodie-pink-waffle.jpeg` — actual pink waffle hoodie photo (anchor product)
- `next.config.mjs` — extended `deviceSizes` + `imageSizes` so the hero photo serves crisp on every viewport.

### Added — `BreakfastWorldHero` (replaces `RobloxWorldBackground` in hero)
- Original SVG candy-city: glossy pastel pillar buildings (mint / cream / pink / peach), pancake plate with butter + double syrup drip, sunny egg on plate, cocoa cup, cereal bowl, toast block, donut tower.
- Floating glossy waffles + butter pats + cereal rings + sparkles with 9 independent animation tracks.
- Crystalline pink ground with shard accents.
- Same performance contract: GPU transforms, `prefers-reduced-motion`, `pointer-events: none`, tab-pause.
- The animated SVG layers BEHIND the real photo — gives motion + parallax even where the photo is static.

### Added — Hero composition
- Real photo `breakfast-world-1.png` is full-bleed via `next/image` with `priority`, `sizes="100vw"`, soft left-fade gradient so the slogan reads.
- Bottom 40px fades to page bg.
- Hero now ~640px min-height with the slogan, lead paragraph (glass card), CTAs, and live banner stacked on the left.

### Added — `AvatarCard` enhancement
- Detects real avatar PNG/JPEG at `/images/avatars/uploads/character.jpeg`.
- Falls back to a heavily refined hand-drawn SVG portrait that matches the actual avatar (M-cap, soft glam face with heavy lashes + full lips, off-shoulder sage cardigan, distressed jeans with multiple knee tears, brown/white chunky sneakers, white shoulder bag with red zipper-pull and bear charm with red M heart sweater).

### Added — Product expansion (40 → 60 SKUs)
20 new SKUs all tied to actual hoodie style. Photo-realistic flat mockups generated by `scripts/generate-product-mockups.mjs` (proper hoodie/sweatpant/cap/sock silhouettes with ribbed cuffs, kangaroo pockets, drawstrings):
- p041 Mint Breakfast Sweatpants (matches mint hoodie)
- p042 Pink Waffle Sweatpants (matches pink hoodie)
- p043 Cream Classic Sweatpants
- p044 Mint Tapered Joggers
- p045 Pink Tapered Joggers
- p046 Cocoa Tapered Joggers
- p047 Mint Breakfast Dad Cap
- p048 Pink Waffle Dad Cap
- p049 Cream EMG Cap
- p050 Pink EMG Beanie
- p051 Cocoa 731 Beanie
- p052 Mint Breakfast Socks
- p053 Pink Waffle Socks
- p054 Syrup Amber Tee
- p055 Butter Pancake Tee
- p056 Pink Waffle Tee
- p057 Cream EMG Classic Hoodie
- p058 Lavender Cereal Hoodie
- p059 Butter Pancake Hoodie
- p060 Black EMG731 Hoodie

Existing hoodie SVG mockups also re-rendered to the new photo-realistic flat style with proper ribbed cuffs, drawstrings, kangaroo pockets, and matching chest graphics.

### Added — Logo system overhaul
- New `src/components/layout/Logo.tsx` with 3 lockups: `mark` / `stacked` / `full`.
- The `CapMark` is a hand-crafted SVG of the avatar's black cap with embroidered "M", gold top button, and a tiny red bear-charm callback dot.
- Display sets `EMGamer` in display sans, `731` in JetBrains Mono in syrup amber.
- New SVG files: `wordmark-stacked.svg`, `wordmark-stacked-dark.svg`, `mark-cap.svg`, upgraded `favicon.svg`, upgraded `og-default.svg`.
- `SiteHeader` and `SiteFooter` now use the new Logo component.

### Changed
- `.gitignore` now excludes `_use images/` (source folder kept locally; production copies live in `/public`).

### Preserved
- All 11 routes, live-status adapters, brand color tokens, voice guide, motion principles, 168 image manifest, all v1.0/v1.1 functionality.

### Checkpoint
- v1.1.0 (Roblox blocky background era) snapshot saved at `docs/checkpoints/v1.1.0-roblox-bg/` with restore script in its `CHECKPOINT.md`.

---

## [1.1.0] — 2026-04-25 — Background + font upgrade

### Added
- **`RobloxWorldBackground`** — original isometric blocky world component for the hero.
  - Sky → distant breakfast skyline (waffle castle, pancake tower, cereal silo, egg dome) → mid floating islands (waffle island, egg cloud, pancake tower) → walking blocky avatars on a road → foreground floating motifs.
  - Four blocky walkers cycle across the road in different directions/speeds (anchor avatar with sage cardigan + cap + bear-charm, plus three squad variants).
  - Three independent parallax tracks (slow / mid / fast) + drifting clouds at three altitudes.
  - Pure SVG, single root, all motion via CSS `@keyframes` on `transform` only — GPU-friendly.
  - Animations pause when the tab is hidden (visibilitychange listener wired in `Hero.tsx`).
  - `prefers-reduced-motion` fully disables all motion; scene becomes a static painting.
  - `pointer-events: none` — never blocks UI.
  - Soft bottom-edge mask so the scene fades into the page background.
  - `memo`-wrapped to prevent re-renders.
- New `.display-tight` and `.mono-tab` / `.num` typography utility classes for headlines + tabular numbers.

### Changed
- **Font stack upgraded:**
  - Display: `Fraunces` → **`Bricolage Grotesque`** (chunky, modern, blocky personality that fits the Roblox world).
  - Body: `Inter` → **`Plus Jakarta Sans`** (warmer, friendlier at small sizes).
  - Numbers: added **`JetBrains Mono`** for prices, viewer counts, schedule times.
  - Cute accent: kept `Sniglet` for stickers/badges only.
- Tailwind `fontFamily` + `fontSize` tokens updated; tighter letter-spacing on `display-*` sizes to match Bricolage's metrics.
- Body background gradients dialed down 30% so the hero background reads cleanly.

### Preserved (no changes)
- All 11 page routes, all 15 components except Hero, 168 image manifest, 40 products, 10 collections, brand color tokens, voice guide, motion principles, live-status adapters.
- Avatar identity in `AvatarCard.tsx` is unchanged — still the anchor.

### Checkpoint
- v1.0.0 baseline saved to `docs/checkpoints/v1.0.0-baseline/` with restore instructions in its `CHECKPOINT.md`. Run the cp commands in there to roll back.

---

## [1.0.0] — 2026-04-25 — Initial creator HQ build

### Added — Phase 1: Research & scaffold
- `/docs/research-summary.md` — extraction from YouTube + TikTok handles + brief
- `/docs/brand-opportunities.md` — Tier-1 / 2 / 3 prioritization
- `/docs/platform-integration-notes.md` — modular adapter strategy

### Added — Phase 2: Brand system
- `/brand/brand-guide.md` — positioning, personality, voice, tone, motifs, character rules
- `/brand/color-system.json` — 12 brand tokens, mood gradients, contrast verification
- `/brand/typography-guide.md` — Fraunces / Inter / Sniglet stack
- `/brand/logo-concepts.md` — 6 directions + mascot system
- `/brand/motion-guidelines.md` — eases, durations, patterns, reduced-motion
- `/brand/voice-and-copy-guide.md` — voice principles, tone matrix, sample blocks

### Added — Phase 3: Next.js site
- Next.js 14 App Router + TypeScript + Tailwind + Framer Motion
- 10 pages: `/`, `/live`, `/watch`, `/gallery`, `/shop`, `/about`, `/links`, `/schedule`, `/community`, `/faq`
- Dynamic collection routes: `/collections/[slug]`
- API routes: `/api/live`, `/api/breakfast`
- 14 components: Hero, AvatarCard (custom SVG), BreakfastFloaters, BreakfastOfTheDay, BreakfastQuestion, CollectionsRail, FeaturedMerch, LatestContent, PlatformCards, ShopGrid, SiteHeader, SiteFooter, LiveBadge, LiveHero
- LiveStatusProvider with SWR-based 60s polling

### Added — Phase 4: Image pipeline
- `master-image-manifest.json` — **168 entries** across 12 categories
- `scripts/generate-image-manifest.mjs` — deterministic regenerator
- `content/images/README.md` — pipeline documentation

### Added — Phase 5: Shop
- 40 starter products in `src/data/products.ts`
- 10 collections in `src/data/collections.ts`
- `shop/shop-strategy.md`, `shop/product-catalog.md`, `shop/product-copy.md`, `shop/collection-structure.json`

### Added — Phase 7: Live integrations
- `src/lib/live-status/{types,youtube,tiktok,index}.ts` — modular adapters
- In-memory 60s cache, manual-override env support

### Added — Phase 8: SEO + perf + mobile
- Metadata, OG image, sitemap, robots
- Tailwind mobile-first breakpoints, prefers-reduced-motion
- next/font preload for Fraunces 800 + Inter 500
- AVIF/WebP image config

### Added — Phase 9: Deployment
- `netlify.toml` with cache headers + security headers
- `.github/workflows/ci.yml` — typecheck + lint + build on every PR
- `.env.example` — full template
- `.gitignore`, `.eslintrc.json`, `.prettierrc`

### Added — Phase 10: Launch docs
- `launch-status.md`, `health-check.md`, `manual-steps.md`, `rollback-notes.md`

### Added — Phase 11: Cowork artifact
- Live HTML preview of the home page

### Notes
- Web research returned no specific creator-page data at build time. Site is structured for plug-and-play once handles are confirmed and YouTube API key is set.
- TikTok live-status uses fallback + manual-override pending real webhook integration.
