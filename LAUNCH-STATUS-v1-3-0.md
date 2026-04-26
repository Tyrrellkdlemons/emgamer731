# LAUNCH STATUS — v1.3.0 (Giant Theme Upgrade)

**Status:** Ready to push
**Date:** 2026-04-26
**Owner:** TKDL
**Live URL:** https://emgamer731.netlify.app

---

## What ships in v1.3.0

This is the "giant theme upgrade" pass. The site keeps the look you already love — but every section gets richer, the merch grid gets real listings, and the copy now sounds like the audience.

### 1. New banner-sky hero photo
- Desktop now uses `breakfast-world-banner.png` — the candy-city scene with the gold "WHAT DID YOU EAT FOR BREAKFAST?" banner stretched across the sky.
- Mobile keeps the centered `breakfast-world-2.png` crop so the avatar stays in frame on small screens.
- Both layers use Next/Image with priority + responsive sizes for fast LCP.

### 2. Avatar Fits rail (new section on home)
- New file: `src/data/avatar-fits.ts` — 13 EMM avatar renders across 5 categories (Roblox-game, fashion, cozy, meme, breakfast).
- New section: `src/components/sections/AvatarFitsRail.tsx` — horizontal-scroll rail, 2:3 cards, dark-cocoa overlay with title + italic vibe text, badge + collection chip.
- Wired into `src/app/page.tsx` between Breakfast-of-the-Day and Latest Content.
- Includes the 99 Nights series (4 looks), Met Gala emerald, Celestial Moon, Demon Queen, Petit-déjeuner Couture, Breakfast Runway, LV Street Luxe, Princess Satin PJs, BRAINROT IS MY LOVE LANGUAGE, Good-morning cereal sticker.

### 3. Real merch — composite grid splitting (no image processing required)
- New product field: `heroCrop?: { src; row; col; rows; cols }` on the `Product` type.
- New component: `src/components/shop/ProductPhoto.tsx` — renders a single cell of a composite grid via CSS `background-position` math (no Sharp / no Pillow needed).
- 14 new SKUs (p061 – p074) wired to the four real product photos:
  - **grid-1** (3×2): white smiley-egg tee, breakfast-first mug, egg-keychain pair, black egg-patch cap, waffle-pattern tote (cream).
  - **grid-2** (3×2): black "Breakfast Mode" neon hoodie, cream cereal-bowl tee, black "Eat First" neon mug, egg acrylic keychain.
  - **grid-4** (3×2): yellow WDYEFB hoodie, sage WDYEFB hoodie (2-eggs), gold egg keychain, WDYEFB egg sock pair.
  - **standalone**: "Good Morning" cereal sticker.
- Both `ShopGrid` and `FeaturedMerch` updated to use `ProductPhoto` so cropped composites render in both places.

### 4. 67/Gen-Z slang weave across copy
The site now sounds like the audience. Edits include:
- Hero pill: "iykyk" appended to the welcome chip.
- Hero subhead: "main-character aura, breakfast plates that ate, no cap."
- Hero CTAs: "Catch the live (it's giving)", "Shop the merch · slay", "Explore the avatar fits".
- BreakfastOfTheDay header: "today's plate is bussin"; CTAs: "Tell us what you ate (slay)", "More plates · iykyk".
- BreakfastQuestion subhead: "totally anon, just main-character fun. Fr fr."; confirmation: "Ate that — {choice} aura unlocked. The squad pulled up. Bussin, no cap."
- LatestContent header: "Latest from EMM · she ate"; sub: "Sigma drops only."
- CollectionsRail header: "the rotation"; sub: "Each drop ate, fr."
- FeaturedMerch header: "Spotlight merch — it's giving plate"; sub: "big sigma aura. No cap, the cozy era."
- LiveHero offline: "EMM is offline rn — touching grass"; CTAs: "See the sched (sigma drop)", "Latest replay · she ate", "Today's eats · bussin".
- 404 page: "This page slept in. Delulu." + "the plate is giving" copy.

---

## Files changed

```
src/app/not-found.tsx                       — slang
src/app/page.tsx                            — wire AvatarFitsRail
src/components/live/LiveHero.tsx            — slang offline + live copy
src/components/sections/AvatarFitsRail.tsx  — NEW
src/components/sections/BreakfastOfTheDay.tsx — slang
src/components/sections/BreakfastQuestion.tsx — slang
src/components/sections/CollectionsRail.tsx — slang
src/components/sections/FeaturedMerch.tsx   — ProductPhoto + slang
src/components/sections/Hero.tsx            — banner-sky photo + slang
src/components/sections/LatestContent.tsx   — slang
src/components/shop/ProductPhoto.tsx        — NEW (composite grid splitter)
src/components/shop/ShopGrid.tsx            — ProductPhoto integration
src/data/avatar-fits.ts                     — NEW (13 avatar fits)
src/data/products.ts                        — heroCrop field + 14 new SKUs (p061–p074)
public/images/avatars/fits/*.png            — 13 NEW (avatar renders)
public/images/hero/breakfast-world-banner.png — NEW (sky-banner hero)
public/shop/photos/grid-1..4.png            — NEW (composite product photos)
public/shop/photos/sticker-good-morning-cereal.jpeg — NEW
docs/checkpoints/v1.2.1-merch-real/         — pre-upgrade snapshot
LAUNCH-STATUS-v1-3-0.md                     — this doc
_archive/LAUNCH-STATUS-v1-2-0.md            — moved
_archive/HEALTH-CHECK-v1-2-0.md             — moved
_archive/MANUAL-STEPS-v1-2-0.md             — moved
_archive/HANDOFF-v1-2-0.md                  — moved
```

---

## Deploy

1. Run `push-to-github.bat` (double-click from Explorer or run it from terminal).
2. Netlify watches `main` on `Tyrrellkdlemons/emgamer731` and auto-builds on push.
3. Watch the Netlify deploy log — green = live in 60–90 seconds.

If the build fails, check `_archive/` for the prior LAUNCH-STATUS doc — the same hotfix patterns apply (lint-disable, tsconfig excludes, env-var `||` fallbacks).

---

## Verification checklist (post-push)

- [ ] Home page hero shows the gold "WHAT DID YOU EAT FOR BREAKFAST?" banner across the sky.
- [ ] Avatar Fits rail appears below Breakfast-of-the-Day; cards scroll horizontally; 99 Nights, Met Gala, BRAINROT cards visible.
- [ ] Merch page shows new SKUs at the bottom (white smiley-egg tee, breakfast-first mug, black egg-patch cap, yellow WDYEFB hoodie, sage WDYEFB hoodie, etc.).
- [ ] Each composite-grid SKU shows ONLY its correct slice of the source photo (not the whole grid).
- [ ] Featured Merch on home shows the new fan-fave SKUs with slang headline.
- [ ] BreakfastQuestion confirmation reads "Ate that — {choice} aura unlocked."
- [ ] Live hero offline state reads "EMM is offline rn — touching grass."
- [ ] No console errors, no missing images.

---

## Rollback

If anything goes sideways:
1. `cd Emgamer731 && git revert HEAD --no-edit && git push origin main`
2. Or restore from `docs/checkpoints/v1.2.1-merch-real/` (pre-upgrade snapshot).
