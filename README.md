# EMGamer731 — Creator Universe

> **"What did you guys eat for breakfast today?"**

The official EMGamer731 / eatsswithemm creator HQ — a polished, animated, mobile-first creator destination built around Roblox + breakfast + livestreaming.

This repo contains the full brand system, image-generation pipeline (120+ assets), shop catalog, and a production-ready Next.js 14 site with a live-stream hub that auto-updates when EMGamer731 goes live on YouTube or TikTok.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve production build
```

## Folder map

| Path | Purpose |
|------|---------|
| `/docs` | Research, launch status, health checks, manual steps, changelog, rollback notes |
| `/brand` | Brand guide, colors, typography, motion, voice, logo concepts |
| `/content/images` | 120+ image prompts, manifests, collections, references |
| `/content/copy` | Page-by-page copy modules |
| `/shop` | Shop strategy, product catalog, copy, collection structure |
| `/src/app` | Next.js App Router pages |
| `/src/components` | UI, layout, sections, motion, live, shop, gallery |
| `/src/data` | Site data: products, collections, gallery, schedule |
| `/src/lib` | Live-status adapters, formatters, utils |
| `/public` | Static assets — images, icons, favicons, downloads |
| `/scripts` | Image-pipeline + content sync helpers |

## Deployment

This project is configured for **Netlify** (primary) and **Vercel** (alternate).

1. Push to GitHub (see `docs/manual-steps.md` for the exact one-time steps).
2. Connect the repo on Netlify — the included `netlify.toml` handles everything.
3. Add environment variables (see `.env.example`) for live-stream polling.

See `docs/launch-status.md` for the latest deployment readiness checklist.

## Brand at a glance

- **Persona:** EMGamer731 / eatsswithemm — Roblox-fashion creator + breakfast personality
- **Slogan:** "What did you guys eat for breakfast today?"
- **Aesthetic:** Soft pastel breakfast palette + glossy creator polish + Roblox blocky playfulness
- **Audience:** Children/teens primary, family-friendly, broadly appealing
- **Channels:** YouTube + TikTok (modular adapters ready for more)

## Compliance

- Original visuals only — no copying of Roblox official key art
- Privacy-conscious for young audiences (no behavioral tracking, minimal data collection)
- WCAG 2.1 AA target, prefers-reduced-motion respected

---

Built by Claude as senior autonomous designer + engineer for EMGamer731. See `docs/changelog.md` for build history.
