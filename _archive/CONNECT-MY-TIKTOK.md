# How to "connect" your TikTok to the site

Quick honesty: TikTok doesn't let third-party sites embed live streams
without partner-app approval. So instead of waiting on TikTok, the site
gives you **three working levers** you control yourself.

---

## Lever 1 — One-tap admin trigger (works today)

This is the path that runs RIGHT NOW.

### Setup (one-time, ~2 minutes)

1. **Set the secret on Netlify**
   - Open <https://app.netlify.com/sites/emgamer731/settings/env>
   - Add a variable: `ADMIN_LIVE_SECRET = pickAStrongPasswordHere`
   - Save → site rebuilds automatically (~1 minute)

2. **Open the admin page** on your phone:
   - Visit <https://emgamer731.netlify.app/admin/live>
   - Paste the secret → hit "Save token"
   - Token is saved to your phone's local storage — no need to paste again

3. **Pin it to your home screen**:
   - **iPhone**: Safari → share → Add to Home Screen
   - **Android**: Chrome menu → Add to Home screen
   - It opens like a native app

### Going live

1. Tap your saved home-screen shortcut → admin opens, token already there
2. Hit **🟢 GO LIVE** (1 tap)
3. Open TikTok, start broadcasting (1 tap)
4. The site's live banner pops on every page within 60 seconds
5. When you're done streaming, hit **🔴 END LIVE** in the admin

### Hidden access

If you forget the URL, you can also reach `/admin/live` from `/about`
via three tricks:
- Tap the 🥞 pancake emoji 7 times within 5 seconds
- Long-press the italic slogan "*what did you guys eat for breakfast today?*" for 2 seconds
- Type `emadmin` anywhere on the page (desktop)

The chip slides in bottom-right when triggered.

---

## Lever 2 — YouTube simulcast (the bulletproof inline path)

When you click "Go Live" on your phone, ALSO push the same broadcast to
YouTube via OBS/StreamLabs. The site auto-detects YouTube live and
embeds it inline via `youtube.com/embed/live_stream` — a public endpoint
that NEVER asks viewers to log in.

Setup walkthrough is in **NEXT-STEP-YT-SIMULCAST.md** (also in this repo).

The TL;DR:
- Easiest: **Restream.io** ($19/mo) — connect TikTok + YouTube, go live
  once, both platforms broadcast.
- Free: **OBS Studio + obs-multi-rtmp plugin** — push two RTMP streams
  from your laptop while mirroring your phone screen.

Once the YouTube channel is broadcasting, the site's `NoLoginLivePlayer`
will prefer YouTube (`embed/live_stream` works at every viewport with
no login) and ignore the TikTok side. Visitors get true inline gameplay
playback.

---

## Lever 3 — TikTok Live for Business (the official path)

If you want fully native TikTok-live embeds without the simulcast,
you need to apply for TikTok Live for Business:

1. Go to <https://www.tiktok.com/business/en>
2. Sign up with your TikTok account
3. Apply for **Live Studio** + **Live for Business**
4. Approval takes 2-4 weeks
5. Once approved you get an API key + an iframe-able live embed URL
6. Add the API key to Netlify env as `TIKTOK_LFB_API_KEY`
7. The site's `tiktok.ts` adapter will use the official endpoint

This is the ONLY way to get TikTok's official live embed — but it's
slow and not guaranteed to be approved.

---

## What runs in the background (already shipped)

The site already tries hard to extract your TikTok live stream
automatically. When you broadcast:

- `/api/tiktok-live-stream` server route fetches your public live page,
  parses the JSON blob, and pulls out the m3u8 URL
- `TikTokLiveHlsPlayer` plays that URL inline via HLS.js
- If TikTok serves a login wall (which they often do for non-authed
  scrapes), the player falls through to the iframe race + CTA card

In the wild, the HLS extractor works ~30-50% of the time depending on
TikTok's mood that hour. Lever 1 (admin trigger) gives you a guaranteed
live banner; Lever 2 (YouTube simulcast) gives you guaranteed inline
playback.

---

## Where to look when something goes wrong

| Symptom                                    | Try this                                     |
|--------------------------------------------|----------------------------------------------|
| Banner doesn't pop after I tap GO LIVE     | Wait 60s (SWR refresh), then ↻ refresh chip  |
| Banner pops but video doesn't play         | YouTube simulcast (Lever 2) is the fix       |
| Admin page asks for token every visit      | Check localStorage isn't blocked / cleared   |
| Admin token rejected                       | Re-paste the value from Netlify env exactly  |
| Want to test without going live for real   | Use admin trigger with title "test stream"   |

You're set. 🥞
