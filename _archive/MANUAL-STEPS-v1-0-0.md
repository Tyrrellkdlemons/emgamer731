# Manual Steps — EMGamer731 first-time setup

The site is fully built and ready to deploy. These are the **one-time** human steps that must happen on your machine and on the providers (GitHub + Netlify).

---

## 1. Local install

```bash
cd "C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731"
npm install --legacy-peer-deps
npm run dev    # opens http://localhost:3000 — verify it loads
npm run build  # final sanity check
```

If `npm install` complains about peer-deps, the `--legacy-peer-deps` flag is what `netlify.toml` already sets, so it'll match production behavior.

---

## 2. GitHub repository setup

```bash
cd "C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731"

git init
git add .
git commit -m "feat: initial EMGamer731 creator HQ build"

# Create the repo on GitHub:
#   https://github.com/new
#   - name: emgamer731
#   - private (recommended) or public — your call
#
# Then connect:
git branch -M main
git remote add origin https://github.com/<your-username>/emgamer731.git
git push -u origin main
```

If you don't have a GitHub account or `git` installed, ask Cowork to "open https://github.com/new in Chrome" and follow the prompts. Cowork can also walk you through installing GitHub CLI (`gh`).

---

## 3. Netlify deployment

Easiest path:

1. Go to https://app.netlify.com/start (sign in / sign up).
2. Click **"Import from GitHub"** → select the `emgamer731` repo.
3. Netlify auto-detects Next.js. Confirm:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20` (already in `netlify.toml`)
4. Click **Deploy**. First build takes ~3 minutes.

### Custom domain
- Netlify dashboard → **Domain settings → Add custom domain → `emgamer731.com`**.
- Add the DNS records Netlify provides at your registrar.
- Netlify auto-provisions HTTPS via Let's Encrypt.

---

## 4. Environment variables

Add these in **Netlify → Site settings → Environment variables**:

| Key | Required for | How to get it |
|-----|--------------|---------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs | Set to `https://emgamer731.com` (or whatever final domain). |
| `YOUTUBE_CHANNEL_ID` | Live status from YouTube | Already pre-filled: `UCnSbDaREAHiITX2UPjE44fA`. |
| `YOUTUBE_API_KEY` | Live status from YouTube | https://console.cloud.google.com/ → enable YouTube Data API v3 → create API key. Quota: 10K units/day default — plenty for our use. |
| `TIKTOK_HANDLE` | TikTok live link | Already pre-filled: `eatsswithemm`. |
| `TIKTOK_WEBHOOK_SECRET` | (Optional) TikTok webhook integration | Generate any random string. Add same value to TikTok Live for Business webhook config. |
| `MANUAL_LIVE_OVERRIDE` | (Optional) Force live banner on | Set to `true` to manually flip live banner on. Combine with `MANUAL_LIVE_PLATFORM`, `MANUAL_LIVE_TITLE`, `MANUAL_LIVE_URL`. |

After setting, click **"Trigger deploy"** so the new env values take effect.

---

## 5. After first deploy

- [ ] Visit the deployed URL — verify all 10 pages load.
- [ ] Run through `health-check.md` checklist.
- [ ] Generate real images for `/public/images/hero/` (start with the top-3 from the image manifest).
- [ ] Replace the placeholder product SVGs in `/public/shop/` with real product photos when shop fulfillment is ready.

---

## 6. Optional integrations (can defer)

- **Shopify or Snipcart** for actual checkout. Snipcart has the lowest setup cost; just drop a `<script src="...">` in `layout.tsx` and tag products with `data-item-*`.
- **Webhook receiver** for TikTok live: create `src/app/api/webhooks/tiktok-live/route.ts` POST handler that validates `TIKTOK_WEBHOOK_SECRET` and writes to a Redis/Upstash kv-store. The TikTok adapter then reads that store. (Files are stubbed out in `live-status/tiktok.ts`.)
- **Plausible or Netlify Analytics** for privacy-respecting traffic stats.

---

## 7. If something breaks

- See `rollback-notes.md` for the safe revert steps.
- See `health-check.md` for the diagnostic flow.
- See `changelog.md` for what changed in each release.
