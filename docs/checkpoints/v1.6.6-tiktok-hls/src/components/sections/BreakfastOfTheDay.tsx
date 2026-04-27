import { todaysPick } from '@/data/breakfast-of-the-day';

export function BreakfastOfTheDay() {
  const pick = todaysPick();
  return (
    <section className="container-soft py-14 sm:py-20" aria-labelledby="botd-title">
      <div className="rounded-3xl bg-gradient-to-br from-pancake via-cream to-mint p-6 sm:p-10 ring-1 ring-creamShade shadow-soft relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-[200px] opacity-20 select-none" aria-hidden>{pick.emoji}</div>
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cream ring-1 ring-creamShade px-3 py-1 text-xs font-semibold text-cocoa shadow-soft">
              <span aria-hidden>🌅</span> Breakfast of the day · today&apos;s plate is bussin
            </div>
            <h2 id="botd-title" className="display text-display-lg text-cocoa mt-4">
              {pick.emoji} {pick.title}
            </h2>
            <p className="text-cocoa/80 text-lg mt-3 max-w-xl">{pick.blurb}</p>
            <p className="text-sm text-syrup font-semibold mt-4">Pair with: {pick.pairing}</p>
          </div>
          <div className="grid gap-2">
            <a href="/community" className="btn-primary w-full justify-center">Tell us what you ate (slay) →</a>
            <a href="/gallery?filter=breakfast" className="btn-ghost w-full justify-center">More plates · iykyk</a>
          </div>
        </d