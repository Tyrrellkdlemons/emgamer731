# Auto-pull YouTube uploads

Every upload from `https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA` auto-flows into the site within 30 minutes. New videos show up:

- on the **/watch** page (full grid, playable inline)
- in the **"Latest from EMM"** rail on the home page
- in the **"Up next"** sidebar of the featured player

## How it works

```
                    ┌─────────────────────────────────────────┐
                    │  YouTube channel: UCnSbDaREAHiITX2UPjE44fA │
                    └─────────────────────────────────────────┘
                                    │
                            ┌───────┴────────┐
                            │ src/lib/       │
                            │ youtube/feed.ts│
                            └───────┬────────┘
                Strategy 1 ↓                    Strategy 2 ↓                   Strategy 3 ↓
       YouTube Data API v3              YouTube RSS feed             Static seed
       (search.list, key required)      (no key, may 404)            (latest-content.ts)
                            │                    │                        │
                            └───────┬────────────┴────────────────────────┘
                                    ↓
                        ┌────────────────────────┐
                        │  /api/youtube (cached)  │── 30-min in-memory + ISR
                        └───────────┬─────────────┘
                                    │
                  ┌─────────────────┴────────────────┐
                  ↓                                   ↓
       /watch (server-rendered)         /  (LatestContent client SWR)
       — every video plays inline       — auto-refreshes every 30 min
```

## Configuration (one-time)

For the auto-pull to work, set in Netlify env:

```
YOUTUBE_CHANNEL_ID=UCnSbDaREAHiITX2UPjE44fA   # already pre-filled in .env.example
YOUTUBE_API_KEY=<your_key>                     # required for API strategy
```

### Getting the key (5 minutes)

1. Go to https://console.cloud.google.com/
2. Create a new project (or pick an existing one)
3. APIs & Services → Library → search "YouTube Data API v3" → **Enable**
4. APIs & Services → Credentials → **Create credentials → API key**
5. (Optional but recommended) Restrict the key to "YouTube Data API v3" only
6. Copy the key into Netlify → Site settings → Environment variables → `YOUTUBE_API_KEY`
7. Trigger a redeploy

The default 10,000-units/day quota is plenty — each `/api/youtube` call costs ~100 units, and we cache for 30 min, so we only burn ~5,000 units/day even with constant traffic.

## Cache + freshness

- In-memory cache: 30 minutes per server instance
- ISR (`revalidate: 1800` on `/watch`): the page itself regenerates every 30 minutes
- Browser SWR (on home page rail): client polls every 30 minutes
- Result: a new upload appears site-wide within ~30 minutes of going live on YouTube

## What plays inline

The `VideoPlayer` component embeds via `youtube-nocookie.com` (privacy-friendly, no cookies until interaction). Click the thumbnail → iframe lazy-mounts → video plays inside the page. Never leaves the site.

For TikTok, the same component embeds via `tiktok.com/embed/v2/<id>` — works for any public TikTok video where you have the `embedId`. TikTok auto-pull is currently webhook-driven (see `platform-integration-notes.md`); add `embedId` manually in `src/data/latest-content.ts` for individual videos in the meantime.

## Fallback behavior

- **No API key set** → tries RSS first, falls back to static seed in `src/data/latest-content.ts`
- **RSS returns 404** (the channel currently does) → falls back to static seed
- **Network errors / quota exhausted** → static seed
- **Inline embed disabled by uploader** → "Open externally" link card

The site never shows a blank or broken state.

## Testing locally

```bash
# With a key:
YOUTUBE_API_KEY=AIza... npm run dev
# Then visit http://localhost:3000/api/youtube and /watch

# Without a key (static fallback):
npm run dev
```
