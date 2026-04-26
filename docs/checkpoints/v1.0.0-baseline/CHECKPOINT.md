# Checkpoint — v1.0.0 baseline

**Saved:** 2026-04-25
**Reason:** User approved the v1.0.0 build but wants the background and font stack upgraded. This snapshot preserves the original Hero + AvatarCard + BreakfastFloaters + globals.css + layout.tsx + tailwind.config.ts so the previous look can be restored.

## What's in this checkpoint

| File | Original location |
|---|---|
| `Hero.tsx`               | `src/components/sections/Hero.tsx` |
| `AvatarCard.tsx`         | `src/components/sections/AvatarCard.tsx` |
| `BreakfastFloaters.tsx`  | `src/components/sections/BreakfastFloaters.tsx` |
| `globals.css`            | `src/styles/globals.css` |
| `layout.tsx`             | `src/app/layout.tsx` |
| `tailwind.config.ts`     | `tailwind.config.ts` |

## How to restore

```bash
cp docs/checkpoints/v1.0.0-baseline/Hero.tsx              src/components/sections/Hero.tsx
cp docs/checkpoints/v1.0.0-baseline/AvatarCard.tsx        src/components/sections/AvatarCard.tsx
cp docs/checkpoints/v1.0.0-baseline/BreakfastFloaters.tsx src/components/sections/BreakfastFloaters.tsx
cp docs/checkpoints/v1.0.0-baseline/globals.css           src/styles/globals.css
cp docs/checkpoints/v1.0.0-baseline/layout.tsx            src/app/layout.tsx
cp docs/checkpoints/v1.0.0-baseline/tailwind.config.ts    tailwind.config.ts
```

After restore: `npm run build`. The avatar, hero copy, motion variants, color tokens, and overall layout return exactly to the v1.0.0 state.

## What v1.1.0 changes (what's coming next)

- New `RobloxWorldBackground` component — original isometric blocky world (waffle islands, pancake towers, walking blocky avatars). Replaces (or augments) the simple emoji floaters in the hero.
- Font stack upgrade: Bricolage Grotesque (display) + Plus Jakarta Sans (body) + JetBrains Mono (numbers) + Sniglet (cute accent).
- Tailwind font-family tokens updated to match.

The v1.0.0 baseline remains here forever; v1.1.0 ships the upgrade.
