# Research Summary — EMGamer731 / eatsswithemm

**Date:** 2026-04-25
**Sources reviewed:**
- YouTube channel: `https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA`
- TikTok handle: `@eatsswithemm` — `https://www.tiktok.com/@eatsswithemm`
- Provided visual references (avatar + 2 hoodie mockups)
- Project brief

> **Limitation note:** Direct platform scraping of these specific handles returned limited public metadata at search time. The brand system below is built on the explicit project brief plus the provided references, and the site is structured so live-feed pulls (subscriber count, latest video, live status) populate automatically once API keys are added in `.env`. See `platform-integration-notes.md`.

---

## Creator Identity (extracted from brief + references)

### Account names
- **EMGamer731** — primary YouTube/gaming handle
- **eatsswithemm** — TikTok handle, breakfast/lifestyle leaning
- Numerical "731" tag suggests the YouTube handle was registered around an early-creator account convention; treat the number as part of the wordmark, not a date.

### Persona signals
| Signal | Read |
|---|---|
| Roblox avatar in feminine outfit (sage cardigan, distressed jeans, white bear-charm purse, black cap) | Soft glam / cute fashion-forward Roblox fashion creator |
| TikTok handle `eatsswithemm` | Breakfast/food content is a defining content pillar |
| YouTube + TikTok dual handles | Cross-platform creator with stream + short-form aspirations |
| Hoodie merch already designed (mint "what did you guys eat for breakfast" + pink waffle stack) | Brand voice is already playful, slogan-led, food-graphic heavy |

### Likely content focus
1. Roblox gameplay + avatar fashion showcases
2. Breakfast vlogs / "what I ate" formats
3. Livestreams (YouTube/TikTok)
4. Cute outfit lookbooks for in-game and merch
5. Community participation / fan response moments

### Recurring themes (anchor for site + image system)
- Breakfast foods: waffles, eggs, pancakes, cereal, toast, bacon, fruit
- Cute Roblox fashion + cap-wearing avatar
- "What did you guys eat for breakfast today?" as recurring opener
- Soft pastels (mint, pink, butter)
- Morning energy

### Posting style assumptions
- TikTok: quick, trendy, vertical, food-mashup or reaction format
- YouTube: longer-form gameplay + breakfast vlogs, livestream replays
- Cadence: assume 3–5 TikToks/wk, 1–3 YouTube uploads/wk, irregular livestreams (site must show live status reliably to convert traffic)

### Audience expectations
- Primary: children/teens (6–16) who love Roblox + cute aesthetics
- Secondary: parents who screen content (must feel safe + clean)
- Tertiary: peer creators / squad members ("breakfast squad")

---

## Brand opportunities (summary)

The detail breakdown lives in `brand-opportunities.md`, but the strongest opportunities are:
1. **"Breakfast-of-the-day"** as a daily content engine that the site itself participates in
2. **A recurring avatar-anchored mascot system** so every visual ties back to the same identity
3. **Squad / collectible badge system** that gives kids a low-friction reason to return
4. **Premium pastel-glossy aesthetic** that distinguishes from typical Roblox-creator chaos
5. **Fully modular live-feed hub** — site stays useful even when EMGamer is offline

---

## Site implications (carried into the build)

- Hero must instantly say "breakfast + creator + Roblox" without text-loading
- Live status needs to pop on the home page the moment a stream starts on YouTube or TikTok
- Gallery must support fast browsing for kids — taggable, filterable, mobile-first
- Shop must be inspirational (kids saving for, parents buying) — not a pure ecommerce-grid
- Performance and reduced-motion compliance is non-negotiable for the audience age band
