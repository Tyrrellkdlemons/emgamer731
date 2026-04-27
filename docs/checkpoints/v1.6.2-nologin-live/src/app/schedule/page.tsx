import type { Metadata } from 'next';
import { SCHEDULE } from '@/data/schedule';

export const metadata: Metadata = {
  title: 'Schedule · Upcoming streams',
  description: 'Set your reminders. Times in your local timezone.',
};

export default function SchedulePage() {
  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-6">
        <h1 className="display text-display-lg text-cocoa">Schedule</h1>
        <p className="text-cocoa/70 mt-2">All times shown in your local timezone. The table's set.</p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {SCHEDULE.map((s) => {
          const date = new Date(s.startsAt);
          return (
            <li key={s.id} className="rounded-2xl bg-cream ring-1 ring-creamShade p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-widest text-syrup font-bold">{s.platform}</div>
                <div className="text-xs text-muted">{s.durationMin} min</div>
              </div>
              <h2 className="display text-2xl text-cocoa mt-1">{s.title}</h2>
              <div className="mt-2 text-cocoa/80">
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' · '}
                {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
              <p className="text-sm text-cocoa/70 mt-2 italic">{s.vibe}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
