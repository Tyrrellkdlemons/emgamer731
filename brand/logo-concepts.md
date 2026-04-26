# Logo & Wordmark Concepts — EMGamer731

This doc captures the directions to be implemented as SVG in `/public/icons/`. Each concept is described in enough detail for direct illustration.

## Concept A — "Stacked Wordmark"
- Two-line lockup. Line 1: `EMGamer731` in Fraunces 800, slight italic on the `731`.
- Line 2: `eatsswithemm` in Inter 500, lowercase, kerned tight.
- A small mint waffle dot replaces the letter `o` in the wordmark, glossy with a single highlight.
- Use case: header, footer, dark backgrounds (with cream lockup).

## Concept B — "Plate Crest"
- Circular crest, 320×320 baseline.
- Outer ring: berry pink with the slogan "What did you guys eat for breakfast today?" running around it (sentence case).
- Inner: a stacked breakfast plate (waffles + strawberry + sunny egg) inside a cream circle.
- Top of crest: the avatar's black cap silhouette as a tiny anchor.
- Use case: stickers, OG images, merch back-of-neck print.

## Concept C — "Breakfast Squad Badge"
- Hexagon badge, 240×240.
- Mint base with golden syrup outer stroke.
- Centered: the letters `EMG` in Fraunces 900, with `731` as a tiny tab in the lower-right corner.
- Use case: collectible/sticker rewards, leaderboard pins, "verified squad" markers.

## Concept D — "Soft Cap Mark"
- Avatar callback monogram.
- The letter `E` rendered with the brim of the avatar's black cap as the top stroke.
- The serif of the `E` morphs into a tiny waffle texture at its base.
- Use case: favicon, app icon, profile picture across platforms.

## Concept E — "Slogan Banner"
- Horizontal banner mark.
- Cream-filled rounded-rectangle ribbon with mint outline.
- Inside: "What did you guys eat for breakfast today?" in Fraunces 800.
- Two tiny breakfast emoji icons (waffle + egg) bookend the slogan.
- Use case: hero ribbon, end-card for streams, email header.

## Concept F — "Mascot Sticker — Cap+Cardigan Avatar"
- Avatar drawn in a cute, slightly chibi proportion (1.5 head-tall).
- Holding a single waffle on a fork, peeking through a cup of milk-foam.
- Sticker outline 6px cream stroke for white-bg compatibility.
- Use case: live-cam corner sticker, fan giveaway sticker pack.

## Mascot system (sub-set of Concept F)
- "Waffle Wendy" — waffle character, googly-cute
- "Eggy" — sunny-side egg with mini cape
- "Pancake Stack-y" — three pancakes wearing a tiny black cap (avatar callback)
- "Cereal Scout" — cereal bowl with periscope spoon
Mascots act as section dividers and badge designs in the gallery directory.

## File deliverables (to land in `/public/icons/`)
- `wordmark-stacked.svg`
- `wordmark-stacked-dark.svg`
- `crest-plate.svg`
- `badge-hex.svg`
- `mark-cap.svg`
- `mark-cap-favicon-32.png`
- `mark-cap-favicon-180.png`
- `slogan-banner.svg`
- `mascot-waffle-wendy.svg`
- `mascot-eggy.svg`
- `mascot-stack-y.svg`
- `mascot-cereal-scout.svg`

(SVG starter set is generated in `/public/icons/` during the implementation phase — see `scripts/generate-icons.mjs` for the inline-string templates that produced them.)
