# EMGamer731 — Launch Checklist

You're launching EMGamer731 / eatsswithemm — Roblox + breakfast + livestreaming creator HQ. This is the complete playbook in TKDL-standard checklist form.

---

## 0. Five-minute setup (one-time)

- [ ] Open project root in PowerShell or Terminal: `cd "C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731"`
- [ ] Skim `LAUNCH-STATUS-v1-2-0.md` for the 12-thing release summary
- [ ] Skim `MANUAL-STEPS-v1-2-0.md` for the env-var + secret list

## 1. Local verify (3 min)

- [ ] `npm install --legacy-peer-deps`
- [ ] `npm run typecheck` → expect clean
- [ ] `npm run build` → expect successful build
- [ ] `npm run dev` → open http://localhost:3000 → verify hero loads with real photo

## 2. Push to GitHub (3 min)

**Easy path:**
- [ ] `bash scripts/push.sh` (mac/Linux/Git Bash) OR `.\scripts\push.ps1` (Windows)
- [ ] Confirm repo created on GitHub at https://github.com/<your-username>/emgamer731

**Manual path:**
- [ ] `git init && git add . && git commit -m "feat: EMGamer731 v1.2.0"`
- [ ] Create repo at https://github.com/new (name: `emgamer731`, don't initialize with README)
- [ ] `git remote add origin https://github.com/<your-username>/emgamer731.git`
- [ ] `git push -u origin main`

## 3. Netlify deploy (2 clicks)

- [ ] Go to https://app.netlify.com/start
- [ ] Click **Import from GitHub** → pick `emgamer731`
- [ ] Confirm build settings auto-detect (Next.js, build command `npm run build`, publish dir `.next`)
- [ ] Click **Deploy** — first build takes ~3 min

## 4. Domain (10 min)

- [ ] Buy `emgamer731.com` (or chosen) at any registrar (~$10/year)
- [ ] Netlify → Site settings → Domain management → **Add custom domain**
- [ ] Add the DNS records Netlify provides at your registrar
- [ ] HTTPS auto-provisions (Let's Encrypt) within 5–60 min

## 5. YouTube auto-pull (5 min)

- [ ] Get a free YouTube Data API v3 key at https://console.cloud.google.com/
- [ ] Netlify → Site settings → Environment variables → add `YOUTUBE_API_KEY`
- [ ] Trigger redeploy
- [ ] Verify https://emgamer731.com/api/youtube returns real videos

## 6. TikTok live trigger (10 min)

- [ ] Generate two random strings (UUIDs work)
- [ ] Netlify env vars: `TIKTOK_WEBHOOK_SECRET` + `ADMIN_LIVE_SECRET` → trigger redeploy
- [ ] **Path A** — TikTok Live for Business → Webhooks → add the webhook URL with the secret header (see `MANUAL-STEPS-v1-2-0.md` §2.1)
- [ ] **Path B** — Make an iPhone Shortcut for one-tap "go live" toggle (see §2.2)

## 7. Curate the `/eats` TikTok food picks (15 min)

- [ ] Pick your 6–12 best food TikToks from `@eatsswithemm`
- [ ] For each, copy the long video ID from the URL
- [ ] Edit `src/data/latest-content.ts` → `EATS_TIKTOKS` array → fill in `embedId` and update `title`
- [ ] Commit + push (Netlify auto-rebuilds)

## 8. Smoke test (10 min)

- [ ] Visit every page: `/`, `/live`, `/watch`, `/eats`, `/gallery`, `/shop`, `/schedule`, `/community`, `/about`, `/links`, `/faq`
- [ ] Click any video on `/watch` → confirm it plays inline
- [ ] Click any TikTok on `/eats` → confirm it plays inline
- [ ] Test the live trigger via iPhone Shortcut → confirm banner flips red on home page within 60s
- [ ] Open `/api/youtube`, `/api/live`, `/api/breakfast` → confirm valid JSON
- [ ] Check on iPhone (if available) → confirm hero photo loads, no horizontal scroll, touch targets feel right
- [ ] Check on Android (if available) → same checks

## 9. Tell the world (15 min)

- [ ] Update YouTube channel description to link `emgamer731.com`
- [ ] Update TikTok bio link to `emgamer731.com`
- [ ] Pin `emgamer731.com` to every social bio
- [ ] Post a "the site is live" stream/short on YouTube + TikTok
- [ ] Send the link to your squad

## 10. Week-1 ops

- [ ] Watch site analytics (Netlify provides server-side analytics with no cookies)
- [ ] Add new TikTok food picks to `EATS_TIKTOKS` weekly
- [ ] Test the live banner the first time you go live for Roblox
- [ ] Check that new YouTube uploads auto-appear within 30 min

## 11. Long-term (30+ days)

- [ ] Submit `emgamer731.com` to https://hstspreload.org/ once you've been live 30+ days
- [ ] Wire shop fulfillment via Snipcart (or hand-fulfilled via Etsy / Printful) when ready to take orders
- [ ] Generate real images for the 168-prompt manifest (start with the top-12 hero entries)

---

## What you have in v1.2.0

- **15 pages** + **3 API routes** + **2 webhook/admin endpoints**
- **20 components** with full Framer Motion + GPU-only background motion
- **60 products** across 10 collections (with real photos on the 2 anchor hoodies)
- **168-prompt image manifest** ready for Midjourney / SDXL / DALL·E generation
- **YouTube auto-pull** for videos AND Shorts (30-min cache + ISR)
- **Inline video player** — visitors never leave the site
- **TikTok-live trigger** with 3 redundant paths
- **`/eats` curated food page** (TikTok narrow-role rule enforced)
- **Logo system** with cap-mark + bear-charm callback
- **Mobile + cross-OS perfection** (iPhone, Android, Samsung, Windows, macOS)
- **Three rollback checkpoints** (v1.0.0 baseline, v1.1.0 Roblox-bg, current = v1.2.0)
- **Owner-private setup guide** at `MANUAL-STEPS-v1-2-0.md`

You are ready. Push and ship.

— TKDL workflow conventions, EMGamer731 v1.2.0, April 2026
