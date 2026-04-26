import type { CollectionId } from './products';

export type Collection = {
  id: CollectionId;
  name: string;
  tagline: string;
  description: string;
  accent: string; // hex
  icon: string;   // emoji
  cover: string;  // /public path
  order: number;
};

export const COLLECTIONS: Collection[] = [
  { id: 'breakfast-boss',           name: 'Breakfast Boss',            tagline: 'Run the table.',                      description: 'Slogan-led essentials. The flagship collection — start here.',                accent: '#A8E6CF', icon: '🥞', cover: '/images/gallery/cover-breakfast-boss.svg', order: 1 },
  { id: 'waffle-stack',             name: 'Waffle Stack',              tagline: 'Crispy edges. Warm centers.',         description: 'Pieces built around the iconic waffle stack.',                                accent: '#FFD89C', icon: '🧇', cover: '/images/gallery/cover-waffle-stack.svg', order: 2 },
  { id: 'egg-drop',                 name: 'Egg Drop',                  tagline: 'Sunny side everything.',              description: 'Sunny egg motifs across cases, pillows, and tees.',                           accent: '#E8A53C', icon: '🍳', cover: '/images/gallery/cover-egg-drop.svg', order: 3 },
  { id: 'pancake-power-up',         name: 'Pancake Power-Up',          tagline: 'Stack high. Game higher.',            description: 'Towering pancake-themed staples + cozy plush.',                               accent: '#FFD89C', icon: '🥞', cover: '/images/gallery/cover-pancake-power-up.svg', order: 4 },
  { id: 'cereal-chaos',             name: 'Cereal Chaos',              tagline: 'Marshmallow constellations.',         description: 'Lavender + dawn vibes. Galaxy-inspired prints.',                              accent: '#E2D6FF', icon: '🥣', cover: '/images/gallery/cover-cereal-chaos.svg', order: 5 },
  { id: 'morning-spawn',            name: 'Morning Spawn',             tagline: 'Loaded. Logged in.',                  description: 'Game-room essentials: desk mats, joggers, mugs.',                             accent: '#A8E6CF', icon: '🎮', cover: '/images/gallery/cover-morning-spawn.svg', order: 6 },
  { id: 'syrup-drip',               name: 'Syrup Drip',                tagline: 'Pour it on.',                         description: 'Honey-amber drip pieces. Premium drops only.',                                accent: '#E8A53C', icon: '🍯', cover: '/images/gallery/cover-syrup-drip.svg', order: 7 },
  { id: 'cozy-breakfast-club',      name: 'Cozy Breakfast Club',       tagline: 'Soft fits, slow mornings.',           description: 'Crewnecks, pajamas, blankets, beanies.',                                      accent: '#FFD89C', icon: '☕', cover: '/images/gallery/cover-cozy-breakfast-club.svg', order: 8 },
  { id: 'breakfast-gamer-essentials', name: 'Breakfast Gamer Essentials', tagline: 'Daily-driver squad gear.',          description: 'Tee 3-packs, socks, backpacks, free wallpapers.',                              accent: '#A8E6CF', icon: '🎒', cover: '/images/gallery/cover-breakfast-gamer-essentials.svg', order: 9 },
  { id: 'eat-with-emm',             name: 'Eat With EMM',              tagline: 'Avatar callbacks. Signature drops.',  description: 'Pieces that reference the avatar directly — sage cardigan, bear charm, black cap.', accent: '#FF9EC0', icon: '🧢', cover: '/images/gallery/cover-eat-with-emm.svg', order: 10 },
];

export function getCollection(id: CollectionId): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}
