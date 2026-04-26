# Checkpoint — v1.1.0 (Roblox blocky background era)

**Saved:** 2026-04-25
**Reason:** User loved v1.1.0 but is upgrading the background to a richer, image-1-style "candy-city breakfast world", swapping the avatar to match their actual uploaded Roblox avatar (image 4), expanding the product line with realistic-photo-style sweats/pants/etc, and overhauling the logo. This snapshot preserves v1.1.0 exactly so it can be restored.

## Files preserved

| File | Original location |
|---|---|
| `Hero.tsx`                   | `src/components/sections/Hero.tsx` |
| `AvatarCard.tsx`             | `src/components/sections/AvatarCard.tsx` |
| `RobloxWorldBackground.tsx`  | `src/components/sections/RobloxWorldBackground.tsx` |
| `products.ts`                | `src/data/products.ts` |
| `SiteHeader.tsx`             | `src/components/layout/SiteHeader.tsx` |
| `SiteFooter.tsx`             | `src/components/layout/SiteFooter.tsx` |

## How to restore

```bash
cp docs/checkpoints/v1.1.0-roblox-bg/Hero.tsx                  src/components/sections/Hero.tsx
cp docs/checkpoints/v1.1.0-roblox-bg/AvatarCard.tsx            src/components/sections/AvatarCard.tsx
cp docs/checkpoints/v1.1.0-roblox-bg/RobloxWorldBackground.tsx src/components/sections/RobloxWorldBackground.tsx
cp docs/checkpoints/v1.1.0-roblox-bg/products.ts               src/data/products.ts
cp docs/checkpoints/v1.1.0-roblox-bg/SiteHeader.tsx            src/components/layout/SiteHeader.tsx
cp docs/checkpoints/v1.1.0-roblox-bg/SiteFooter.tsx            src/components/layout/SiteFooter.tsx
```
