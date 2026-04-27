# NEXT STEP — YouTube simulcast for bulletproof inline live

This is the "next step" pipeline for getting **100% reliable** inline
live playback on the site, regardless of what TikTok decides to do with
their public live page in the future.

The site already prefers YouTube whenever it's also live (see
`NoLoginLivePlayer.tsx` — it checks `summary.all` for an active
YouTube `LiveStatus` and routes there first). The only thing missing is
having YouTube actually broadcast EMM's gameplay at the same time as
TikTok.

---

## How it works once wired

When EMM clicks "Go Live" on her phone:

1. **Phone**: TikTok app starts the broadcast (audience: TikTok)
2. **OBS / StreamLabs Mobile**: simultaneously pushes the same scene
   to YouTube Live via RTMP (audience: YouTube)
3. **Server**: 60s after both broadcasts start, our `/api/live`
   adapters detect both:
   - TikTok adapter → `isLive: true` (HTML scrape)
   - YouTube adapter → `isLive: true` (YouTube Data API)
4. **`NoLoginLivePlayer`** sees BOTH live, prefers YouTube
   (`primary.platform === 'youtube' || secondary.platform === 'youtube'`)
5. Visitor on `/live` sees the YouTube `<iframe src="…/embed/live_stream?channel=…">` — public, no login wall, plays the actual gameplay

---

## Two simulcast options for EMM

### Option A — Restream.io (easiest, free tier)

1. Sign up at <https://restream.io/> (free 30-day trial, then $19/mo)
2. Connect both **TikTok** and **YouTube** as destinations
3. Go live ONCE in the Restream Studio app on phone or PC
4. Restream pushes the same broadcast to both platforms
5. Done — every TikTok live also lights up on YouTube

### Option B — OBS / StreamLabs with multi-RTMP plugin (free, more setup)

1. Install OBS Studio: <https://obsproject.com/>
2. Install the multi-RTMP plugin: <https://github.com/sorayuki/obs-multi-rtmp>
3. Get the YouTube Live RTMP URL + key from
   <https://studio.youtube.com/channel/UC.../livestreaming>
4. Get TikTok Live RTMP from the TikTok Live Studio app (iOS / Android)
5. Add both as outputs in OBS multi-RTMP panel
6. Mirror the phone screen to OBS via the iOS Camera or Android Mirror
7. Click "Start Streaming" in OBS — both platforms go live at once

---

## Required env var for the YT detection to work

Add these to Netlify (Site settings → Build & deploy → Environment):

```
YOUTUBE_API_KEY=<get from https://console.cloud.google.com/apis/credentials>
YOUTUBE_CHANNEL_ID=UCnSbDaREAHiITX2UPjE44fA
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCnSbDaREAHiITX2UPjE44fA
```

The `YOUTUBE_API_KEY` is free up to 10,000 requests/day — way more than
enough for the 60s polling.

---

## What the visitor experience looks like once wired

| EMM is broadcasting via... | Visitor sees on `/live`                     |
|----------------------------|---------------------------------------------|
| TikTok only                | HLS player → iframe race → CTA card         |
| YouTube only               | YouTube `<iframe>` — clean, no login        |
| Both (simulcast)           | YouTube `<iframe>` — clean, no login        |
| Neither                    | Existing offline dialog ("touching grass")  |

---

## Why this is bulletproof

- YouTube Live's `youtube.com/embed/live_stream?channel=…` is a public
  documented endpoint — they will not deprecate it without a long
  migration window.
- No scraping, no third-party mirrors, no app deeplinks.
- Works in every browser, every region, no login wall.
- Plays Roblox gameplay exactly as it streams (no profile feed).

EMM only has to flip on the simulcast in her broadcasting app once.
After that, every TikTok live also gets the inline-playable YouTube
copy and the site auto-prefers YouTube.

---

_Generated alongside v1.6.6 — the TikTok HLS extractor handles the_
_"what if she doesn't simulcast" case as best as legally possible, but_
_simulcasting is the only 100%-reliable path._
