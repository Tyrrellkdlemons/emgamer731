# EMGamer731 — v1.2.0 Health Check

**Run date:** 2026-04-25
**Build:** v1.2.0 (`emgamer731-v1-2-0-deploy.zip`)
**Verdict:** PASS. All static checks green. Build verification deferred to user's machine (`npm install` requires registry access).

---

## 1. File inventory

| Category | Count |
|---|---|
| Total project files (excl. node_modules / .next / `_use images/`) | 209 |
| Routes (`src/app/**/page.tsx` + `route.ts`) | 17 |
| Components (`src/components/**/*.tsx`) | 20 |
| Data modules (`src/data/*.ts`) | 7 |
| Lib modules (`src/lib/**/*.ts`) | 6 |
| Image manifest entries | 168 |
| Product SKUs | 60 (p001–p060) |
| Collections | 10 |
| Public images | 73 (5 real photos + 68 SVGs) |
| Real assets wired | 5 / 5 ✓ |

## 2. Routes

```
src/app/about/page.tsx
src/app/api/admin/live-override/route.ts        ← NEW v1.2
src/app/api/breakfast/route.ts
src/app/api/live/route.ts
src/app/api/webhooks/tiktok-live/route.ts       ← NEW v1.2
src/app/api/youtube/route.ts                    ← NEW v1.2
src/app/collections/[slug]/page.tsx
src/app/community/page.tsx
src/app/eats/page.tsx                           ← NEW v1.2
src/app/faq/page.tsx
src/app/gallery/page.tsx
src/app/links/page.tsx
src/app/live/page.tsx
src/app/page.tsx
src/app/schedule/page.tsx
src/app/shop/page.tsx
src/app/watch/page.tsx                          ← REWRITTEN v1.2 (server-rendered + auto-pull)
```

## 3. Components

```
src/components/layout/Logo.tsx                  ← NEW v1.2
src/components/layout/SiteFooter.tsx
src/components/layout/SiteHeader.tsx
src/components/live/LiveBadge.tsx
src/components/live/LiveHero.tsx                ← UPDATED v1.2 (inline embed)
src/components/live/LiveStatusProvider.tsx
src/components/sections/AvatarCard.tsx          ← REWRITTEN v1.2 (real-image first)
src/components/sections/BreakfastFloaters.tsx   (legacy v1.0 — preserved)
src/components/sections/BreakfastOfTheDay.tsx
src/components/sections/BreakfastQuestion.tsx
src/components/sections/BreakfastWorldHero.tsx  ← NEW v1.2
src/components/sections/CollectionsRail.tsx
src/components/sections/FeaturedMerch.tsx
src/components/sections/Hero.tsx                ← REWRITTEN v1.2 (full-bleed photo)
src/components/sections/LatestContent.tsx       ← UPDATED v1.2 (SWR auto-pull)
src/components/sections/PlatformCards.tsx
src/components/sections/RobloxWorldBackground.tsx (legacy v1.1 — preserved)
src/components/shop/ShopGrid.tsx
src/components/watch/VideoPlayer.tsx            ← NEW v1.2
src/components/watch/WatchClient.tsx            ← NEW v1.2
```

## 4. Static parse / type checks

| File / Type | Tool | Result |
|---|---|---|
| `tsconfig.json` | structural | PASS |
| `tailwind.config.ts` | structural | PASS |
| `next.config.mjs` | structural | PASS |
| `netlify.toml` | structural | PASS |
| `package.json` | JSON parse | PASS |
| `master-image-manifest.json` (168 entries, 240 KB) | JSON parse + entry count | PASS |
| `brand/color-system.json` | JSON parse | PASS |
| `shop/collection-structure.json` | JSON parse | PASS |
| Generated SVG mockups (60+ files) | XML parse | PASS |

`npm run typecheck` + `npm run build` to be run on user's machine — sandbox lacks npm registry access. CI workflow `.github/workflows/ci.yml` runs both on every push.

## 5. Wiring verification

| Module | Verified usage |
|---|---|
| `EATS_TIKTOKS` | `src/app/eats/page.tsx` |
| `isShort` flag | `src/components/watch/WatchClient.tsx` (vertical thumbnail + filter) |
| `/api/youtube` | `src/components/sections/LatestContent.tsx` (SWR), `src/app/watch/page.tsx` (server fetch) |
| `VideoPlayer` | `src/components/watch/WatchClient.tsx`, `src/app/eats/page.tsx`, `src/components/live/LiveHero.tsx` |
| `getYouTubeFeed` | `src/app/watch/page.tsx`, `src/app/api/youtube/route.ts` |
| `setTikTokLive` / `getTikTokLive` | `src/app/api/webhooks/tiktok-live/route.ts`, `src/app/api/admin/live-override/route.ts`, `src/lib/live-status/tiktok.ts` |
| `RealAvatarSrc` (`character.jpeg`) | `src/components/sections/AvatarCard.tsx` |
| `breakfast-world-{1,2}.png` | `src/components/sections/Hero.tsx` |
| `photo-hoodie-{mint,pink}-*.jpeg` | `src/data/products.ts` (p001, p002) |
| New `Logo` component | `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx` |

## 6. CSP / security

| Header | Source | Status |
|---|---|---|
| `X-Frame-Options: SAMEORIGIN` | `next.config.mjs` + `netlify.toml` | OK |
| `X-Content-Type-Options: nosniff` | both | OK |
| `Referrer-Policy: strict-origin-when-cross-origin` | both | OK |
| `Permissions-Policy: camera=(), microphone=(), geolocation=()` | both | OK |
| Image domains allowlisted | `next.config.mjs` `remotePatterns` | OK — i.ytimg.com, i9.ytimg.com, img.youtube.com, yt3.ggpht.com, p16-sign-va.tiktokcdn.com |
| `/api/live` cache | `Cache-Control: public, s-maxage=60, stale-while-revalidate=120` | OK |
| `/api/youtube` cache | `Cache-Control: public, s-maxage=1800, stale-while-revalidate=3600` | OK |
| `_next/static/*` cache | `public, max-age=31536000, immutable` | OK |
| Webhook secret verification | `X-EMG731-Webhook-Secret` header check OR `?secret=` query | OK |
| Admin override auth | `Authorization: Bearer` header OR `?secret=` query | OK |

## 7. YouTube auto-pull endpoint behavior

| Endpoint | Method | Behavior |
|---|---|---|
| `/api/youtube` | GET | Returns `{items, fetchedAt, count, source}`. 30-min server cache + Next ISR. Falls back to RSS, then static seed. |
| `getYouTubeFeed()` | server | Strategy chain: API → RSS → static. Enriches with `videos.list` to tag Shorts (≤60s). |

YouTube channel `UCnSbDaREAHiITX2UPjE44fA`:
- Direct channel URL: HTTP 200 (verified via curl)
- RSS feed: HTTP 404 (this channel currently doesn't have RSS enabled — handled gracefully)
- API path: requires `YOUTUBE_API_KEY` to populate

## 8. TikTok live trigger endpoint behavior

| Endpoint | Method | Behavior |
|---|---|---|
| `/api/webhooks/tiktok-live` | GET | Health check — returns `{ok, configured, handle, note}` |
| `/api/webhooks/tiktok-live` | POST | Verifies secret, parses event, sets/clears live state |
| `/api/admin/live-override` | GET | Health check |
| `/api/admin/live-override` | POST | Auth bearer, sets live state with title/url |
| `/api/admin/live-override` | DELETE | Auth bearer, clears live state |

In-memory store TTL: 30 min (defends against stuck "live" if end-event fails).

## 9. Mobile + cross-OS audit

| Concern | Verified in |
|---|---|
| Safe-area insets (iOS notch / Dynamic Island / home indicator) | `globals.css` body padding + footer |
| 44×44 px touch targets | `.btn-primary`, `.btn-ghost` `min-height/min-width` |
| Coarse-pointer enlargement | `@media (pointer: coarse)` block |
| Save-data fallback | `@media (prefers-reduced-data: reduce)` hides `.hero-photo-layer` |
| iOS input-zoom prevention | `font-size: max(16px, 1rem)` on inputs |
| iOS landscape zoom | `text-size-adjust: 100%` |
| Reduced motion | Universal `@media (prefers-reduced-motion: reduce)` block + per-component `useReducedMotion()` |
| Mobile hero art-direction | Hero swaps `breakfast-world-2.png` (mobile) ↔ `breakfast-world-1.png` (desktop) at sm breakpoint |
| Safari short viewport | `100svh` / `100dvh` available |
| Smooth scroll | Disabled when reduced-motion |

## 10. Cleared findings (from previous cycles)

| Prior finding | Status |
|---|---|
| v1.0.0 — Avatar SVG was Claude's interpretation; user wanted actual avatar | **FIXED** — `character.jpeg` now wired with SVG fallback |
| v1.0.0 — Hero used emoji floaters only; user wanted "Roblox map" feel | **FIXED** v1.1 → improved further v1.2 with real photo + animated SVG candy-city |
| v1.0.0 — Watch page links external | **FIXED** — inline VideoPlayer, no leaving the site |
| v1.0.0 — TikTok live unmonitored | **FIXED** — webhook + admin override + env-var override |
| v1.0.0 — Only 40 products | **FIXED** — 60 SKUs with sweats, joggers, caps, beanies, socks |
| v1.0.0 — Logo was a tiny bread icon | **FIXED** — full Logo component with crafted CapMark |
| v1.0.0 — No mobile-specific hero | **FIXED** — art-directed `breakfast-world-2.png` for mobile |

## 11. Net-net

- 17 routes / 20 components / 60 SKUs / 168 image prompts.
- Real photos wired (5/5).
- All static parse checks PASS.
- All cross-file wiring traced + verified.
- 3 rollback checkpoints exist (`docs/checkpoints/`).
- Zip ready for Netlify Drop OR GitHub-then-Netlify push.

---

*Generated by structured health check over the v1.2.0 build.*
