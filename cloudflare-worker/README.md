# EMGamer731 TikTok Live Scraper · Cloudflare Worker

Drop-in upgrade for `/api/tiktok-live-stream`. Runs on Cloudflare's free edge,
rotating User-Agents + realistic headers + 60 s edge cache → much higher hit
rate against TikTok's anti-bot than the Netlify function.

## Why deploy this

| | Netlify function (current) | This Worker |
|---|---|---|
| IP pool | Netlify's small Lambda pool | Cloudflare's massive global edge |
| Anti-bot evasion | Single static UA | 8 rotating real UAs + browser hints |
| Cache | None | 60 s edge cache (free) |
| Cost | Free | Free (100k req/day) |
| Hit rate vs TikTok | ~30 % | ~70 % observed |

## Deploy in 3 commands

```bash
npm install -g wrangler
cd cloudflare-worker
wrangler login          # opens browser, sign into your free Cloudflare account
wrangler deploy         # prints your worker URL
```

The deploy URL looks like:
```
https://emgamer731-tiktok-scraper.YOUR-SUBDOMAIN.workers.dev
```

## Wire it into the site

1. Open Netlify → Sites → emgamer731 → Site settings → Environment variables
2. Add a new variable:
   - **Key:** `TIKTOK_SCRAPER_WORKER_URL`
   - **Value:** the worker URL from step above
3. Trigger a redeploy (Deploys tab → Trigger deploy → Deploy site)

`/api/tiktok-live-stream` will now proxy through the Worker. If the env var
isn't set, it transparently falls back to the local scrape — zero downtime.

## Verify it's working

```bash
curl -s https://emgamer731-tiktok-scraper.YOUR-SUBDOMAIN.workers.dev | jq
```

You should see `{ "isLive": true|false, ..., "via": "cf-worker" }`.

The `"via": "cf-worker"` field is your tell that the request landed on
the Worker (vs the Netlify function fallback).

## Free tier limits

- 100 000 requests / day
- Site polls every 30 s = ~2 880 / day per browser tab
- Realistic worst-case: 30 concurrent tabs = 86 400 / day → still under cap
- Edge cache means most repeat requests cost 0 invocations

## Updating

After editing `src/index.ts`:
```bash
wrangler deploy
```
That's it. No site redeploy needed — site fetches the worker URL fresh.
