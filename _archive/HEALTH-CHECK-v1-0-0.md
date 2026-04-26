# Health Check — EMGamer731

A 5-minute scan to verify the build is healthy before/after deploy.

## Pre-deploy checks

```bash
# 1. Install verifies lockfile resolves
npm install --legacy-peer-deps

# 2. Type safety
npm run typecheck

# 3. Lint
npm run lint

# 4. Build (catches any SSR/RSC mistakes)
npm run build

# 5. Local smoke test
npm run dev
# open http://localhost:3000 — visit each route below
```

## Manual smoke tests (every deploy)

| URL | Expected |
|-----|----------|
| `/` | Hero animates, slogan reads on first paint, AvatarCard renders, Breakfast-of-the-day shows today's pick, Collections rail scrolls horizontally, Featured merch grid populates, BreakfastQuestion responds to clicks. |
| `/live` | LiveHero renders (offline state ok), Coming-up cards show schedule items, Latest replays grid shows YouTube items. |
| `/watch` | Tabs render, video grid populates with 6 items. |
| `/gallery` | Filter pills update grid; "all" shows everything; clicking "wallpaper" filters down. |
| `/shop` | 40 products render; category pill switch filters correctly; "free" badge shows on wallpaper + sticker pack. |
| `/collections/breakfast-boss` | Banner header shows collection icon + tagline; products filter to that collection. |
| `/about` | Long-form page renders cleanly. |
| `/schedule` | Schedule cards render with localized dates/times. |
| `/community` | 4 colored cards render in a 2x2 grid. |
| `/faq` | All FAQ items expand on click. |
| `/links` | All links route correctly. |
| `/api/live` | Returns valid JSON: `{ isLive, primary?, all[], fetchedAt }`. |
| `/api/breakfast` | Returns `{ today, pool, fetchedAt }`. |
| `/sitemap.xml` | Lists all 18 routes. |
| `/robots.txt` | References sitemap. |

## Visual audit

- [ ] No layout shift on hero load (CLS < 0.1)
- [ ] Mobile menu opens cleanly on all phones (375px–428px tested)
- [ ] Live badge renders without overlapping nav
- [ ] No horizontal scrollbar on any page at 320px width
- [ ] Reduced-motion mode disables idle floats and live pulse

## API health

```bash
# After deploy
curl -s https://emgamer731.com/api/live | jq
curl -s https://emgamer731.com/api/breakfast | jq .today
```

## Performance audit

Lighthouse targets (mobile, simulated 4G, Moto G4):
- Performance ≥ 92
- Accessibility ≥ 96
- Best Practices = 100
- SEO = 100

If LCP > 2.5s: check that `next/font` is preloading + that hero SVG is not over-sized.

## Live integration verification

```bash
# Force "live" state for visual QA
MANUAL_LIVE_OVERRIDE=true MANUAL_LIVE_PLATFORM=youtube MANUAL_LIVE_TITLE="QA preview" MANUAL_LIVE_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ" npm run dev
```

After ~60s the SWR poll fires and the LiveHero swaps to the live state.
