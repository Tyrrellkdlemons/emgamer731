import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About EMM',
  description: 'Behind EMGamer731 — the cozy creator pulling up to the breakfast table every morning.',
};

export default function AboutPage() {
  return (
    <div className="container-soft py-12 sm:py-16 max-w-3xl">
      <h1 className="display text-display-lg text-cocoa">About EMM</h1>
      <div className="prose prose-lg mt-6 text-cocoa/85 max-w-none space-y-5">
        <p className="text-xl leading-relaxed">
          Hi, I'm EMM — your morning host. I make Roblox content with my squad, post breakfast moments, and run a stream where everyone shows up just to hang.
        </p>
        <p>
          EMGamer731 is the gaming side. eatsswithemm is the breakfast side. They live in the same world: cozy, polished, fun, and always asking the same question — <span className="display-italic text-syrup">what did you guys eat for breakfast today?</span>
        </p>
        <h2 className="display text-display-md text-cocoa">The vibe</h2>
        <p>
          Soft pastels. Glossy creator polish. Avatar-first identity. We lean cozy where most gaming creators lean chaotic — and that's the difference.
        </p>
        <h2 className="display text-display-md text-cocoa">The squad</h2>
        <p>
          The Breakfast Squad is anyone who shows up. Watch a stream, grab a wallpaper, send a breakfast pic — that's it. You're in.
        </p>
        <h2 className="display text-display-md text-cocoa">Family-friendly by default</h2>
        <p>
          The site is built privacy-first: no cookies tracking you across the web, no behavioral advertising, no logins required. Designed for kids and teens, polished enough that parents and adults vibe with it too.
        </p>
      </div>
    </div>
  );
}
