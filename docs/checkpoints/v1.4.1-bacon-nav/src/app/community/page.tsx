import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community · Breakfast Squad',
  description: 'Submit your breakfast, claim your squad badge, and grab the freebies.',
};

export default function CommunityPage() {
  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="display text-display-lg text-cocoa">Community</h1>
        <p className="text-cocoa/70 mt-2 max-w-2xl">
          The Breakfast Squad is anyone who shows up. Share a plate, snag a freebie, repeat tomorrow.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-mood-mint p-6 ring-1 ring-creamShade shadow-soft">
          <div className="text-4xl">📸</div>
          <h2 className="display text-2xl text-cocoa mt-2">Show us your plate</h2>
          <p className="text-cocoa/80 mt-1">Tag <strong>#BreakfastSquad</strong> on TikTok. Best plates land in next month's gallery.</p>
        </div>
        <div className="rounded-3xl bg-mood-berry p-6 ring-1 ring-creamShade shadow-soft">
          <div className="text-4xl">🎟️</div>
          <h2 className="display text-2xl text-cocoa mt-2">Claim your badge</h2>
          <p className="text-cocoa/80 mt-1">Browse all 10 collections to unlock the Breakfast Boss badge — saved locally, never to a server.</p>
        </div>
        <div className="rounded-3xl bg-mood-waffle p-6 ring-1 ring-creamShade shadow-soft">
          <div className="text-4xl">📥</div>
          <h2 className="display text-2xl text-cocoa mt-2">Free wallpapers + stickers</h2>
          <p className="text-cocoa/80 mt-1">Grab the digital pack from the shop — phone wallpapers, sticker sheets, printable cards.</p>
        </div>
        <div className="rounded-3xl bg-mood-cereal p-6 ring-1 ring-creamShade shadow-soft">
          <div className="text-4xl">🛎️</div>
          <h2 className="display text-2xl text-cocoa mt-2">Stream reminders</h2>
          <p className="text-cocoa/80 mt-1">Subscribe on YouTube + tap the bell. We don't ask for emails — your inbox stays clean.</p>
        </div>
      </div>
    </div>
  );
}
