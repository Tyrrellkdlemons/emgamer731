# Platform Integration Notes

Goal: when EMGamer731 goes live on **any** platform, the site shows a live status banner within ~60s, with a CTA to watch.

## Strategy: modular adapter pattern

All platform integrations live behind a single interface in `src/lib/live-status/`:

```ts
type LiveStatus = {
  platform: 'youtube' | 'tiktok' | 'twitch' | 'kick';
  isLive: boolean;
  title?: string;
  thumbnail?: string;
  watchUrl: string;
  startedAt?: string;
  viewerCount?: number;
  fetchedAt: string;
};

interface LiveAdapter {
  id: string;
  fetch(): Promise<LiveStatus>;
}
```

The `/api/live` route runs all enabled adapters in parallel (with `Promise.allSettled`), caches results in-memory for 60s, and returns a merged payload. The front-end polls this endpoint every 60s and animates in/out.

---

## Per-platform notes

### YouTube
- **Method:** YouTube Data API v3 — `search.list?channelId=UCnSbDaREAHiITX2UPjE44fA&eventType=live&type=video`
- **Auth:** API key (read-only). Set `YOUTUBE_API_KEY` in `.env`.
- **Rate limit:** Default 10,000 units/day. The above query costs ~100 units → safely room for 60s polling + buffer.
- **Fallback when offline:** fetch latest 3 uploads via `search.list?order=date` to power the "Replays" rail and the "offline but replay available" hero card.
- **Thumbnail:** `https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg`

### TikTok
- **Method:** TikTok does not currently expose a clean public live-status endpoint without OAuth. Two viable approaches:
  1. **Webhook (recommended):** TikTok Live for Business / Studio supports webhook callbacks. POST to `/api/webhooks/tiktok-live` with stream-start/stream-end. Set `TIKTOK_WEBHOOK_SECRET` to verify.
  2. **TikTok Display API:** authenticated polling for latest videos (works as a content rail, not for true live-status).
- **Fallback:** Render a live-or-not card that links to `https://www.tiktok.com/@eatsswithemm/live`. The link itself silently 404s when offline → use a HEAD request from server to detect.
- **Manual switch:** A dashboard-set boolean (`MANUAL_TIKTOK_LIVE=true`) overrides the adapter for emergencies.

### Future platforms
- **Twitch:** Helix `streams?user_login={login}` — App Access Token, very straightforward.
- **Kick:** public `/api/v2/channels/{slug}` endpoint, no auth required. Easy add.

---

## Environment variables (see `.env.example`)

```
YOUTUBE_CHANNEL_ID=UCnSbDaREAHiITX2UPjE44fA
YOUTUBE_API_KEY=
TIKTOK_HANDLE=eatsswithemm
TIKTOK_WEBHOOK_SECRET=
MANUAL_LIVE_OVERRIDE=
NEXT_PUBLIC_SITE_URL=https://emgamer731.com
```

Without keys, the system gracefully degrades:
- "Latest from EMGamer731" rail uses static seeded data from `src/data/latest-content.ts`
- Live badge defaults to "Offline — Replay below" with a pulse-animated CTA to subscribe

---

## Caching + revalidation

- `/api/live` uses an in-memory module-level cache, TTL 60s, with `revalidate = 60` on the route segment.
- Front-end uses `swr` (lightweight) with `refreshInterval: 60_000` so the badge updates even if the page is left open.

---

## Privacy + child safety

- No third-party analytics scripts. Use Netlify's built-in analytics (server-side, no cookies).
- No persistent identifiers stored in the browser beyond `localStorage["emg-badges"]` (sticker collection state — opt-in, never sent to server).
- TikTok webhook payloads are validated against `TIKTOK_WEBHOOK_SECRET` and never logged with PII.
