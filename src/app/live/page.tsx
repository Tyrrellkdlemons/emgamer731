import type { Metadata } from 'next';
import { LiveHero } from '@/components/live/LiveHero';
import { ReplaysGrid } from '@/components/live/ReplaysGrid';
import { SCHEDULE } from '@/data/schedule';
import { LATEST_CONTENT } from '@/data/latest-content';

export const metadata: Metadata = {
  title: 'Live · Stream hub',
  description: 'EMM\'s live stream status across YouTube and TikTok, plus the schedule and latest replays.',
};

export default function LivePage() {
  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6">
        <h1 className="display text-display-lg text-cocoa">Stream hub</h1>
        <p className="text-cocoa/70 mt-2">Live status across every platform — auto-refreshes every 60 seconds.</p>
      </header>

      <LiveHero />

      <section className="mt-12">
        <h2 className="display text-display-md text-cocoa mb-4">Coming up</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCHEDULE.map((s) => {
            const date = new Date(s.startsAt);
            return (
              <li key={s.id} className="rounded-2xl bg-cream ring-1 ring-creamShade p-4 shadow-soft">
                <div className="text-xs uppercase tracking-widest text-syrup font-bold">{s.platform}</div>
                <div className="font-semibold text-cocoa mt-1">{s.title}</div>
                <div className="text-sm text-cocoa/70 mt-1">
                  {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  {' · '}
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {' · '}
                  {s.durationMin} min
                </div>
                <div className="text-xs text-muted mt-2 italic">{s.vibe}</div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="display text-display-md text-cocoa">Latest replays · she ate</h2>
            <p className="text-cocoa/70 text-sm mt-1">
              Tap any card to watch inline on the site — no leaving for YouTube.
            </p>
          </div>
          <a href="/watch" className="text-sm font-semibold text-syrup hover:underline">
            All replays →
          </a>
        </div>
        <ReplaysGrid items={LATEST_CONTENT} />
      </section>
    </div>
  );
}
