# Motion Guidelines — EMGamer731

Motion is part of the brand identity, not decoration. Every animation must read as **warm, settled, and intentional** — the morning energy of someone who is awake and dialed in, never of someone over-caffeinated.

## Eases

| Token | Curve | Use |
|---|---|---|
| `easeMorning` | `cubic-bezier(0.32, 0.72, 0, 1)` | Default for entrance, hover, page transitions |
| `easeStretch` | `cubic-bezier(0.16, 1, 0.3, 1)` | "Show off" transitions — hero reveal, modal |
| `easeSyrup` | `cubic-bezier(0.65, 0, 0.35, 1)` | Slow press-state, settled returns |
| `easeBounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Stickers, badges, micro-rewards (use sparingly) |

## Durations

- 80ms — taps, color flashes
- 200ms — hovers, simple opacity
- 320ms — UI transitions (default)
- 480ms — card reveals
- 600ms — entrance / hero reveal
- 1200ms — wow moments (page-load hero, breakfast-of-day swap)
- 1400ms — live pulse (loop)
- 1600–4000ms — idle floating motifs

## Library choice

- **Framer Motion** for component-level orchestration (variants, stagger, layout transitions)
- **CSS `@keyframes`** for idle-loop motifs (cheaper, no JS work)
- **`prefers-reduced-motion`** universally respected:
  - Idle motion → static
  - Entrance → 200ms opacity only
  - Live pulse → static dot, no halo

## Patterns

### 1. Hero entrance
- Slogan word-by-word stagger: 80ms gap, 600ms each, easeStretch
- Avatar slides up from y=24 to y=0 with opacity 0 → 1, easeMorning, 720ms
- Floating breakfast motifs fade in at +400ms with scale 0.92 → 1

### 2. Idle floats
- Float duration: 4–6s loop, easeMorning
- Translate-Y range: ±6px, never X
- Rotate range: -2° to +2°
- Use `transform` only — never `top/left`. Promote with `will-change: transform`.

### 3. Card hover
- `scale(1.02)` + `translateY(-2px)`
- Soft shadow grows: `0 4px 12px → 0 14px 28px`
- 200ms easeMorning

### 4. Live pulse
- Outer halo at `scale(1)` opacity 0.45 → `scale(1.6)` opacity 0
- 1400ms ease-out, infinite
- Only ONE simultaneous halo per badge
- Pause when tab hidden via `visibilitychange`

### 5. Page transitions
- Fade between routes: 240ms
- Shared-layout for the live badge (so it persists across nav)
- No "swipe-in" or directional transitions — keeps reduced-motion mode trivially identical

### 6. Section reveal on scroll
- Trigger when 25% in viewport
- Translate-Y 16 → 0, opacity 0 → 1, 480ms easeMorning
- Stagger children at 60ms

### 7. Breakfast-mood color swap
- Background gradient cross-fade 800ms easeMorning
- Floating motif color tween over the same window
- Single state in `MoodContext`

## Performance budget

- No animation loop > 30fps without `requestAnimationFrame`
- Max 3 concurrent JS-driven animations on screen at once
- All hero animations must be GPU-eligible (transform/opacity only)
- LCP element must NOT be animated for the first 1s after load

## Reduced motion

Every motion variant has a static counterpart:

```ts
const motionVariants = useReducedMotion()
  ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
  : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
```
