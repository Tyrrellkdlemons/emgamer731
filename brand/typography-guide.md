# Typography Guide — EMGamer731

## Type Stack

### Display — `Fraunces`
A high-contrast variable serif with optical sizing. Used for hero headlines, slogan callouts, page titles, and merch graphics. The serif feels intentional and premium without losing playfulness — it gives the brand its "I show up dressed" personality.

- **Source:** [Google Fonts — Fraunces](https://fonts.google.com/specimen/Fraunces)
- **Weights loaded:** 400, 600, 800, 900
- **Optical settings:** `SOFT 50, WONK 1` for headline moments; `SOFT 30, WONK 0` for sub-headlines.
- **Fallbacks:** `ui-serif, Georgia, "Iowan Old Style", serif`

### Body / UI — `Inter`
The performance-first sans we lean on for everything else. Highly legible at small sizes, beautiful tabular numbers, native-looking on every platform.

- **Source:** [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
- **Weights loaded:** 400, 500, 600, 700
- **Fallbacks:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

### Cute Accent — `Sniglet`
Rounded, friendly, distinctly *not* the body font. Reserved for sticker captions, badge text, and small ornamental moments. Never use in continuous body copy.

- **Source:** [Google Fonts — Sniglet](https://fonts.google.com/specimen/Sniglet)
- **Weights loaded:** 400, 800
- **Fallbacks:** `"Comic Sans MS", "Trebuchet MS", sans-serif`

---

## Type Scale (rem-based, fluid)

| Token | Min | Max | Tracking | Use |
|---|---|---|---|---|
| `display-xl` | 3.25rem | 5.75rem | -0.02em | Hero slogan |
| `display-lg` | 2.5rem  | 4rem    | -0.02em | Section openers |
| `display-md` | 2rem    | 2.75rem | -0.01em | Page titles |
| `h1` | 1.875rem | 2.25rem | -0.01em | Top of section card |
| `h2` | 1.5rem   | 1.75rem | 0      | Sub-section |
| `h3` | 1.25rem  | 1.375rem | 0      | Card titles |
| `body-lg` | 1.125rem | 1.25rem | 0 | Lead paragraph |
| `body`    | 0.9375rem | 1rem | 0 | Default body |
| `body-sm` | 0.8125rem | 0.875rem | 0 | Caption / meta |
| `mono`    | 0.875rem | 0.9375rem | 0 | Schedule times |

Fluid-sizing implementation in Tailwind via `clamp()` utilities (see `src/styles/typography.css`).

---

## Pairing rules

- Hero block: `Fraunces 800 display-xl` over `Inter 500 body-lg` lead
- Card title + body: `Inter 700 h3` over `Inter 400 body`
- Sticker caption: `Sniglet 800 body-sm` only
- Numbers (price, viewer count, schedule): `Inter 500 tabular-nums`
- Slogan tagline: always `Fraunces 800 italic` — italic only allowed in this slot

## Legibility floors

- Minimum body size on mobile: `15px / 0.9375rem`
- Minimum line-height on body: 1.55
- Minimum tap-target text + padding: 44 × 44 px

## Loading strategy

Fonts loaded via Next.js `next/font/google` with `display: swap`. Subset to Latin + Latin-Ext only. Preload Fraunces 800 + Inter 500 for first paint.
