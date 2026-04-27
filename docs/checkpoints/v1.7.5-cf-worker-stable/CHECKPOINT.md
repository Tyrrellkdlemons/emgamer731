# v1.7.5 — Cloudflare Worker stable + multi-platform pills

**Date:** 2026-04-27
**Tag:** v1.7.5-cf-worker-stable
**State:** GREEN — all systems wired, picker logic clean, scraper hardened.

## What's working at this checkpoint

| Subsystem | State |
|---|---|
| Restream simulcast (YouTube + TikTok from one OBS broadcast) | ✅ Both channels active in Restream |
| YouTube live inline embed (no login wall) | ✅ via `youtube.com/embed/live_stream?channel=…` |
| TikTok HLS scraper (Cloudflare Worker w/ TOS-guard) | ✅ Deployed at `emgamer731-tiktok-scraper.emgamer731.workers.dev` |
| TOS-guard: circuit breaker on TikTok 429/403 | ✅ |
| TOS-guard: per-IP rate limit (30/min) | ✅ |
| TOS-guard: identifying X-headers | ✅ `IDENTIFY_SOURCE=true` |
| Site `/api/tiktok-live-stream` proxies to Worker | ✅ `TIKTOK_SCRAPER_WORKER_URL` set on Netlify |
| Local Netlify scraper UA rotation (fallback) | ✅ |
| Admin `/admin/live` token override (`gems`) | ✅ |
| Admin pasted HLS URL short-circuit | ✅ |
| LiveHero multi-platform pills (YT + TikTok side-by-side) | ✅ NEW v1.7.5 |
| LiveHero junk-title sanitizer | ✅ NEW v1.7.5 |
| TikTokLiveStage simplified (HLS → CTA card, no iframe race) | ✅ NEW v1.7.5 |
| DualPlatformLivePlayer picker | ✅ |
| Butter-toast frame · syrup drips · butter pat | ✅ |
| AutoLiveRedirect (home → /live) | ✅ |
| Header LIVE chip → /live | ✅ |
| Like + Subscribe popup buttons | ✅ |
| Bacon nav | ✅ |
| Easter-egg admin reveals (about page) | ✅ |
| Roblox mods panel (admin) | ✅ |
| 67 brainrots gallery | ✅ |
| Breakfacts page | ✅ |
| Lookbook page | ✅ |

## Site state on Netlify
- Production: `emgamer731.netlify.app`
- Repo: `github.com/Tyrrellkdlemons/emgamer731`
- Latest published commit (pre-1.7.5): `6694c81` (v1.7.4)

## Cloudflare account
- Account: `Luxuryem731@gmail.com`
- Worker: `emgamer731-tiktok-scraper`
- Subdomain: `emgamer731.workers.dev`
- Worker URL: `https://emgamer731-tiktok-scraper.emgamer731.workers.dev`
- Free tier: 100k req/day

## Restream account
- Channels: 2/2 active
  - `eatsswithem` (TikTok)
  - `EmGamer731` (YouTube, Public)
- Plan: Free
- Show: `Stream via RTMP (OBS, Vmix, Zoom) with Restream`

## Known limitations at this checkpoint
- TikTok-only inline playback impossible without Restream YouTube simulcast (TikTok serves `X-Frame-Options: DENY`).
- Pro Restream plan ($39/mo) would unlock vertical-format TikTok streaming + 1080p Full HD.
- For TikTok-only moments: site shows polished CTA card with "Open in TikTok app" deeplink.

## Rollback to this checkpoint
```bash
cd C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731
git log --oneline | grep v1.7.5
git revert <any commits after v1.7.5>
RUN-PUSH.bat   # or push-to-github.bat
```
