# Image Pipeline — EMGamer731

## Status
- **168 image concepts** ready in `master-image-manifest.json`.
- Categories covered: hero (12), avatar (12+8 mascots), breakfast/mashup (10), promo posters (10), social tiles (12+6 quote + 6 thumb), merch mockup (12+8 lifestyle), sticker (8), overlay (6), splash/loader (6), background patterns (6), seasonal (8), wallpaper (12), UI illustrations (6), icon/badge sets (6), printable extras (4), section dividers (10).

## Pipeline

```
              ┌────────────────────────────┐
              │  master-image-manifest.json │ — single source of truth (168 entries)
              └──────────────┬──────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
    /prompts/{category}/        /generated/{category}/
    individual prompt cards     final rendered PNGs
            │                                 │
            ▼                                 ▼
    /thumbnails/{category}/      /collections/{collection-id}/
    256x256 web preview         curated grouping per shop collection
```

## Folder spec

| Folder | Purpose |
|--------|---------|
| `/prompts/` | Individual prompt cards (one per entry) — easy to copy into MJ/SDXL/DALL·E |
| `/generated/` | Final rendered PNGs (organized by category) |
| `/thumbnails/` | 256×256 web previews used in /public/gallery |
| `/reference/` | Reference photos / style boards (the avatar references, hoodie refs) |
| `/collections/` | Per-collection curated subsets — used to build collection page heroes |
| `/manifests/` | JSON shards (per-category subsets of the master) |

## Generating images

The manifest is **format-agnostic**. Pick any pipeline:

### Midjourney v6
Append the global style notes + the `prompt` to a `/imagine` command. Use the `aspectRatio` field as `--ar` (e.g. `16:9` → `--ar 16:9`).

### Stable Diffusion XL / Flux
Use the `prompt` as the positive prompt; the `styleNotes` field as a style preamble. Negative prompt: "photorealistic, gritty, dark, lowres, copyrighted Roblox key art, sexualized minor".

### DALL·E 3 / Imagen
Concatenate `styleNotes` + `prompt`. Resize to `aspectRatio`.

### Manual illustration
Each entry's `prompt` + `styleNotes` is enough for an illustrator to deliver. Use the `alt` field for the final HTML alt attribute.

## File naming

`emgamer731-{category}-{slug-of-title}-{nnn}.png`

Example: `emgamer731-hero-breakfast-castle-hero-001.png`

## Top picks (curated lists in the manifest)

- **Top 20 heroes** — for home, live, and seasonal heroes
- **Top 20 product-ready** — merch flat-lay mockups
- **Top 20 social** — Instagram + TikTok content
- **Top 20 seasonal** — refresh quarterly

## Compliance

- Never reference Roblox first-party characters/key art
- Avatar identity must remain consistent (cap + sage cardigan + brown hair + bear-charm purse)
- Child-safe: no sexualized styling; no unsafe contexts
- Original visuals only

## Regeneration

If a re-run is needed:

```bash
node scripts/generate-image-manifest.mjs
```

This is idempotent — re-running produces a deterministic output (same IDs).
