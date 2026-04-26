# DEPLOY — EMGamer731 v1.2.0

A single-page deploy guide. Two paths: **(A) one-shot script** that does everything, or **(B) walk-me-through** if you'd rather I drive Chrome / Terminal for you.

---

## Path A — One-shot from your terminal (5 minutes)

Run from inside `C:\Users\TKDL\Desktop\CLAUDE\EmGamer731\Emgamer731`:

```powershell
# 1. Verify build works locally
npm install --legacy-peer-deps
npm run typecheck
npm run build

# 2. Initial commit
git init
git add .
git commit -m "feat: EMGamer731 v1.2.0 — real assets, video integration, YouTube auto-pull, /eats, mobile polish"
git branch -M main

# 3. Create the GitHub repo + push
#    Pick ONE of the two options below.

#    OPTION 3a — GitHub CLI (cleanest, requires `gh auth login` once)
gh repo create emgamer731 --public --source=. --remote=origin --push

#    OPTION 3b — Manual: open https://github.com/new, name it "emgamer731", DON'T initialize with README
#    Then:
git remote add origin https://github.com/<your-username>/emgamer731.git
git push -u origin main
```

After the push:

```powershell
# 4. Deploy to Netlify (assumes `netlify` CLI installed: `npm i -g netlify-cli`)
netlify login
netlify init     # answer: create new site, link to repo
netlify deploy --build --prod
```

OR — easier — open https://app.netlify.com/start, click **Import from GitHub**, pick the repo. Netlify auto-detects Next.js from `netlify.toml`. First build runs in ~3 minutes.

## Path B — Have me drive

If you'd rather I open Chrome and Terminal on your computer and walk you through this end-to-end, just say the word and I'll request access to those apps. I'll need from you:
1. Whether you want the repo public or private
2. Your GitHub username (or I can open the signup page if you don't have an account)
3. Confirmation when each step looks right

---

## Environment variables (Netlify dashboard → Site settings → Environment variables)

| Key | Required | What for | Where to get |
|-----|----------|----------|--------------|
| `NEXT_PUBLIC_SITE_URL` | yes | canonical URLs / OG tags | set to your final domain, e.g. `https://emgamer731.com` |
| `YOUTUBE_CHANNEL_ID` | already set | identifies the channel | pre-filled `UCnSbDaREAHiITX2UPjE44fA` in `.env.example` |
| `YOUTUBE_API_KEY` | yes (for auto-pull) | YouTube Data API v3 | https://console.cloud.google.com → enable YouTube Data API v3 → create API key (5 min) |
| `TIKTOK_HANDLE` | already set | TikTok handle | pre-filled `eatsswithemm` |
| `TIKTOK_WEBHOOK_SECRET` | optional | TikTok-live auto-trigger | generate any random string; paste into TikTok Live for Business webhook config |
| `ADMIN_LIVE_SECRET` | optional | iPhone Shortcut "go live" button | generate any random string |

After setting any env vars, hit **Trigger deploy** in Netlify so the build picks them up.

## Custom domain
Netlify → Domain settings → Add custom domain → `emgamer731.com` (or whichever). Add the DNS records Netlify gives you at your registrar. HTTPS auto-provisioned via Let's Encrypt.

---

## After deploy — smoke test (2 minutes)

| Page | Expect |
|------|--------|
| `/` | Hero photo loads, slogan animates word-by-word, breakfast-of-the-day card, latest YouTube content rail (auto-pulled if API key set), shop spotlight |
| `/live` | Live status card (offline state OK if no stream running), schedule cards, latest replays |
| `/watch` | Video grid with both long-form and Shorts (vertical thumbnails for Shorts), inline player works |
| `/eats` | Curated TikTok food picks with vertical players |
| `/shop` | 60 SKUs across 10 collections, real photos for the two anchor hoodies |
| `/api/youtube` | JSON with auto-pulled videos (if YOUTUBE_API_KEY set) |
| `/api/live` | JSON live status |
| `/api/webhooks/tiktok-live` | `{ ok: true, configured: true }` if `TIKTOK_WEBHOOK_SECRET` set |

Run Lighthouse on the home page — targets: Perf ≥ 92 mobile, A11y ≥ 96, Best Practices = 100, SEO = 100.

---

## What this push includes (v1.2.0)

- Real hero photo (`breakfast-world-1.png` desktop, `breakfast-world-2.png` mobile) with art-direction
- Real avatar wired into AvatarCard (with hand-drawn SVG fallback)
- 60 SKUs (was 40) — sweats, joggers, dad caps, beanies, socks, more hoodie colorways
- New logo system (cap mark with embroidered M + bear-charm callback dot)
- Inline VideoPlayer (YouTube nocookie + TikTok embed) — **visitors never leave the site**
- YouTube auto-pull (videos AND Shorts, 30-min cache, ISR)
- `/eats` curated TikTok food page (separate from main Watch — never auto-bulked)
- TikTok-live webhook + admin override route — banner pops red the moment a stream starts
- Mobile + cross-OS polish (safe-area insets, 44px touch targets, save-data fallback, mobile hero crop, iOS input-zoom prevention)

---

## Rollback (if anything goes wrong)

Netlify dashboard → Deploys → find last green deploy → **Publish deploy**. Reverts in ~5s.

For source rollback see `docs/rollback-notes.md`.

For pre-v1.2 versions:
- `docs/checkpoints/v1.0.0-baseline/` — original (Fraunces fonts, simple emoji floaters)
- `docs/checkpoints/v1.1.0-roblox-bg/` — blocky Roblox-world background era

Each checkpoint folder has its own `CHECKPOINT.md` with restore commands.
