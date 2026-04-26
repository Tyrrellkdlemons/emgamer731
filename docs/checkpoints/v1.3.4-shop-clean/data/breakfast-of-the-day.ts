export type BreakfastPick = {
  id: string;
  title: string;
  emoji: string;
  vibe: 'cozy' | 'speed' | 'celebration' | 'cool' | 'classic';
  blurb: string;
  pairing: string;
};

// Rotating pool — server picks one per UTC day (deterministic).
export const BREAKFAST_POOL: BreakfastPick[] = [
  { id: 'waffle-stack',    title: 'Triple Waffle Stack',  emoji: '🧇', vibe: 'cozy',        blurb: 'Crispy edges, warm middle, syrup pooled like a moat.',                pairing: 'Strawberry milk + chill Roblox build session' },
  { id: 'sunny-trio',      title: 'Sunny Egg Trio',       emoji: '🍳', vibe: 'classic',     blurb: 'Three sunny eggs on toast — yolks intact, butter melted in.',         pairing: 'Orange juice + obby speedrun' },
  { id: 'pancake-tower',   title: 'Pancake Power-Up',     emoji: '🥞', vibe: 'celebration', blurb: 'Five pancakes, butter pat, raining berries.',                         pairing: 'Cocoa + birthday stream' },
  { id: 'cereal-galaxy',   title: 'Cereal Galaxy Bowl',   emoji: '🥣', vibe: 'cool',        blurb: 'Two cereals, cold milk, marshmallow constellations.',                 pairing: 'Saturday cartoon energy' },
  { id: 'toast-soldier',   title: 'Toast Soldiers',       emoji: '🍞', vibe: 'classic',     blurb: 'Buttered toast cut into strips for dipping. Squad-friendly.',          pairing: 'Soft-boiled egg + lazy Sunday' },
  { id: 'breakfast-burrito', title: 'Breakfast Burrito',  emoji: '🌯', vibe: 'speed',       blurb: 'Eggs, cheese, bacon, hash — wrapped tight for the run.',              pairing: 'Hot sauce + fast-food obby' },
  { id: 'fruit-cloud',     title: 'Fruit Cloud',          emoji: '🍓', vibe: 'cool',        blurb: 'Whipped yogurt, strawberries, blueberries — basically a pillow.',     pairing: 'Lemonade + chill build mode' },
  { id: 'french-toast',    title: 'French Toast Drip',    emoji: '🥞', vibe: 'cozy',        blurb: 'Cinnamon-crusted, syrup-drowned, dusted with sugar.',                  pairing: 'Hot chocolate + cozy stream' },
];

export function todaysPick(now: Date = new Date()): BreakfastPick {
  // Deterministic pick by UTC day of year so server + client agree
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return BREAKFAST_POOL[dayOfYear % BREAKFAST_POOL.length];
}
