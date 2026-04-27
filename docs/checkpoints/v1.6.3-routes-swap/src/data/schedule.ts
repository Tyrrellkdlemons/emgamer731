export type ScheduledStream = {
  id: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'both';
  startsAt: string; // ISO
  durationMin: number;
  vibe: string;
};

// Seed schedule — replace from CMS or admin override
export const SCHEDULE: ScheduledStream[] = [
  { id: 'sat-am',   title: 'Saturday Pancake Stream', platform: 'youtube', startsAt: '2026-04-26T13:30:00Z', durationMin: 90, vibe: 'cozy build session' },
  { id: 'sun-vibe', title: 'Sunday Cereal Vibes',     platform: 'tiktok',  startsAt: '2026-04-27T15:00:00Z', durationMin: 45, vibe: 'short live + chats' },
  { id: 'wed-fits', title: 'Wednesday Fits Drop',     platform: 'youtube', startsAt: '2026-04-30T22:00:00Z', durationMin: 60, vibe: 'avatar fashion + new merch reveal' },
];
