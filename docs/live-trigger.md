# Live trigger — making the live banner pop the moment EMM goes live

Three independent ways to flip the site into "LIVE" mode, sorted by automation level:

## 1. TikTok webhook (best — fully automated)

When EMM starts a TikTok Live for Business / TikTok Studio stream, TikTok POSTs to:

```
POST https://emgamer731.com/api/webhooks/tiktok-live
Header: X-EMG731-Webhook-Secret: <your secret>
Body:   { "event": "live.start", "title": "Roblox stream — pull up a chair", "url": "https://www.tiktok.com/@eatsswithemm/live" }
```

End-of-stream:

```
POST https://emgamer731.com/api/webhooks/tiktok-live
Header: X-EMG731-Webhook-Secret: <your secret>
Body:   { "event": "live.end" }
```

The site picks it up on its next 60-second poll → red live banner appears with the inline embed.

### One-time configuration
1. Generate a long random string. Paste into Netlify env: `TIKTOK_WEBHOOK_SECRET=<that string>`.
2. In TikTok Live for Business / TikTok Studio dashboard → Webhooks → add the URL above with the same secret in the header.
3. Trigger a redeploy on Netlify.

A 30-minute TTL guards against stuck "live" status if the end webhook fails.

## 2. Phone shortcut (fast — manual but 1-tap from your phone)

If you don't want to set up the TikTok webhook, you can use an iOS Shortcut / Android Tasker that fires when you tap a button:

```
POST https://emgamer731.com/api/admin/live-override
Header: Authorization: Bearer <ADMIN_LIVE_SECRET>
Body:   { "title": "live on TikTok — Roblox", "url": "https://www.tiktok.com/@eatsswithemm/live" }
```

Stop:

```
DELETE https://emgamer731.com/api/admin/live-override
Header: Authorization: Bearer <ADMIN_LIVE_SECRET>
```

### One-time configuration
1. Generate a long random string. Paste into Netlify env: `ADMIN_LIVE_SECRET=<that string>`.
2. iPhone → Shortcuts app → New Shortcut → "Get Contents of URL" → paste the POST above.
3. Add to Home Screen so it's one tap. Add a second shortcut for DELETE.

## 3. Env-var fallback (slowest — requires Netlify redeploy)

In Netlify env:

```
MANUAL_LIVE_OVERRIDE=true
MANUAL_LIVE_PLATFORM=tiktok
MANUAL_LIVE_TITLE=Live on TikTok — Roblox
MANUAL_LIVE_URL=https://www.tiktok.com/@eatsswithemm/live
```

Trigger a redeploy. The banner stays on until you clear `MANUAL_LIVE_OVERRIDE` and redeploy again.

---

## Cross-platform: auto-start a YouTube Live when TikTok Live starts?

Possible but **requires authenticated YouTube Live API access** (`liveBroadcasts.insert` + `liveStreams.insert`). That's an OAuth flow with the channel owner — not just an API key. Steps if you want it:

1. Set up Google Cloud OAuth client (https://console.cloud.google.com/apis/credentials)
2. Generate refresh token via `https://developers.google.com/oauthplayground` with scope `https://www.googleapis.com/auth/youtube`
3. Store `YT_OAUTH_REFRESH_TOKEN`, `YT_OAUTH_CLIENT_ID`, `YT_OAUTH_CLIENT_SECRET` in Netlify env
4. Update the TikTok webhook handler in `src/app/api/webhooks/tiktok-live/route.ts` to:
   - Exchange refresh token for access token
   - Call `liveBroadcasts.insert` with `snippet.scheduledStartTime: now`
   - Call `liveBroadcasts.transition` with `broadcastStatus: live`
   - Save the YouTube broadcast id back to the live store so the banner shows BOTH

**Caveat:** YouTube Live requires either a real source stream (RTMP) OR redirecting your TikTok output via OBS. The platform won't simulcast the TikTok video itself. You'd be creating a "live now" placeholder broadcast.

For most use cases the TikTok webhook alone is enough — visitors see the live banner and click through to TikTok. If you want true multi-stream simulcast, OBS Studio + Restream.io is simpler than wiring it server-side.

---

## Verifying it works

```bash
# 1. Health check
curl https://emgamer731.com/api/webhooks/tiktok-live
# → { "ok": true, "configured": true, "handle": "eatsswithemm" }

# 2. Trigger a fake live event
curl -X POST https://emgamer731.com/api/admin/live-override \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"test live","url":"https://www.tiktok.com/@eatsswithemm/live"}'

# 3. Within 60s the home page banner flips red.
# 4. Stop:
curl -X DELETE https://emgamer731.com/api/admin/live-override \
  -H "Authorization: Bearer YOUR_SECRET"
```
