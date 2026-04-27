# LAUNCH STATUS — v1.7.0 · "Restream simulcast + dual-platform picker"

**Released:** 2026-04-27
**Tag:** v1.7.0
**Theme:** Restream.io simulcast wired up; visitors can now pick YouTube or TikTok

---

## What shipped

### 1. Restream.io simulcast — both YouTube + TikTok flow from one stream
- Restream account paired with YouTube channel **EmGamer731** (Public) and TikTok handle **eatsswithem(m)**.
- Both destinations are toggled ON in Restream — going live in Restream Studio (or any RTMP encoder pointed at Restream's ingest URL) pushes the same broadcast to both platforms simultaneously.
- The site no longer needs to scrape TikTok HTML or fight the TikTok login wall — it just embeds whichever public surface the visitor prefers.

### 2. Dual-platform picker on `/live`
- New `DualPlatformLivePlayer` component wraps the existing `NoLoginLivePlayer`.
- When BOTH platforms report live (via the existing `LiveStatus` provider), a tab control appears above the butter-toast frame:
  - **YouTube** (default — cleanest no-login embed)
  - **TikTok** (same stream, TT chat vibes)
- Plus a "📱 Open in TikTok app" deeplink button and a TikTok web link.
- When only ONE platform is live, the picker hides itself and behaves exactly like before — no regressions.

### 3. All existing features preserved
- Butter-toast frame, animated syrup drips, butter pat — untouched.
- HLS m3u8 player + iframe-race fallback chain — untouched.
- Like + Subscribe popup buttons — untouched.
- Admin `/admin/live` (token: **gems**) still flips the banner, still accepts pasted HLS URLs.
- Auto-redirect home → /live when EMM is Roblox-live — untouched.
- Header LIVE chip → /live with toast video — untouched.

---

## File changes

| File | Change |
|---|---|
| `src/components/live/DualPlatformLivePlayer.tsx` | **NEW** — picker + delegating wrapper |
| `src/components/live/LiveHero.tsx` | Swap `NoLoginLivePlayer` → `DualPlatformLivePlayer` (2-line change) |
| `_archive/` | Moved `LAUNCH-STATUS-v1-3-0.md`, `NEXT-STEP-YT-SIMULCAST.md`, `CONNECT-MY-TIKTOK.md`, `CHECKPOINT_2026-04-25.md` |
| `LAUNCH-STATUS-v1-7-0.md` | **NEW** (this file) |

No other files touched. No env-var changes. No new dependencies.

---

## How it behaves end-to-end

```
[ EMM goes live in Restream Studio ]
            │
            ├──→ TikTok live  (handle: eatsswithemm)
            └──→ YouTube live (channel: EmGamer731)

[ Visitor lands on emgamer731.netlify.app ]
            │
            ├ AutoLiveRedirect detects Roblox-live → routes to /live
            │
            ▼
[ /live → LiveHero ]
            │
            ├─ both live? → DualPlatformLivePlayer shows picker (YT default)
            └─ only one?  → DualPlatformLivePlayer hides picker, plays the live one
            │
            ▼
[ NoLoginLivePlayer ]
            │
            ├─ YouTube tab  → <iframe youtube-nocookie embed/live_stream?channel=…>
            └─ TikTok tab   → TikTokLiveStage (HLS m3u8 → 4-iframe race → CTA card)
```

---

## What you (TKDL) need to do to test

1. Open Restream Studio (https://app.restream.io) — start a quick test broadcast (webcam is fine, doesn't have to be Roblox).
2. Within ~30s the YouTube live appears at `youtube.com/embed/live_stream?channel=UCnSbDaREAHiITX2UPjE44fA` — the site embeds it inline.
3. Within ~1 min TikTok finishes activating the broadcast — site picker shows both options.
4. Click between YouTube and TikTok tabs — confirm the player switches surface.
5. End the Restream broadcast — banner flips back to "EMM is offline" within 60s (live-status provider polls every minute).

If TikTok approval is still pending, the picker will simply not appear and the YouTube embed plays solo — that's the expected graceful degradation while you wait for TikTok to activate the channel.

---

## Rollback (if ever needed)

```
cd C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731
git revert <v1.7.0 commit hash>
RUN-PUSH.bat
```

The change is contained to 1 new file + a 2-line swap — safe to revert without touching anything else.

---

## Next chips on the table

- **YOUTUBE_API_KEY env on Netlify** — currently the YouTube live detection uses a hardcoded channel-ID fallback (`UCnSbDaREAHiITX2UPjE44fA`). Adding `YOUTUBE_API_KEY` to Netlify env unlocks live broadcast title/viewer-count metadata. Optional — current path works without it.
- **TikTok approval** — once Restream confirms the TikTok destination, no code changes needed; picker shows up automatically next live.
- **Custom RTMP destination for the EMGamer731 brand channel** — only needed if you ever want to bypass the Google-account-default channel selection.
