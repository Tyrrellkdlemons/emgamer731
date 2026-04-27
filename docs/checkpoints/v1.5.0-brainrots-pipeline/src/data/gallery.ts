export type GalleryItem = {
  id: string;
  title: string;
  src: string;        // /public path
  thumb?: string;
  aspect: 'square' | 'portrait' | 'landscape' | 'wide';
  category: GalleryCategory;
  tags: string[];
  collection?: string;
  description?: string;
  downloadable?: boolean;
};

export type GalleryCategory =
  | 'hero' | 'avatar' | 'breakfast' | 'merch' | 'wallpaper'
  | 'sticker' | 'overlay' | 'social' | 'mockup' | 'seasonal'
  | 'icon' | 'badge';

// Seed set — populated alongside the image-pipeline outputs.
// See content/images/master-image-manifest.json for the full 120+ generation set.
export const GALLERY: GalleryItem[] = [
  // Heroes
  { id: 'g001', title: 'Breakfast Castle Hero', src: '/images/hero/hero-breakfast-castle.svg', aspect: 'wide', category: 'hero', tags: ['hero','castle','breakfast','waffle'], description: 'Hero: avatar in front of a syrup-castle skyline.' },
  { id: 'g002', title: 'Cozy Stream Room', src: '/images/hero/hero-stream-room.svg', aspect: 'wide', category: 'hero', tags: ['hero','stream','room','cozy'], description: 'Hero: stream-room interior with breakfast plate on desk.' },
  { id: 'g003', title: 'Cereal Galaxy Hero', src: '/images/hero/hero-cereal-galaxy.svg', aspect: 'wide', category: 'hero', tags: ['hero','cereal','galaxy','lavender'], description: 'Hero: cereal-piece galaxy with avatar floating in cup-saucer ship.' },
  // Avatar portraits
  { id: 'g010', title: 'Avatar — Sage Cardigan', src: '/images/avatars/avatar-sage-cardigan.svg', aspect: 'portrait', category: 'avatar', tags: ['avatar','sage','cardigan','signature'], description: 'Anchor avatar portrait: sage cardigan + black cap.' },
  { id: 'g011', title: 'Avatar — Pancake Plate', src: '/images/avatars/avatar-pancake-plate.svg', aspect: 'square', category: 'avatar', tags: ['avatar','pancake','holding'] },
  { id: 'g012', title: 'Avatar — Squad Wave', src: '/images/avatars/avatar-squad-wave.svg', aspect: 'portrait', category: 'avatar', tags: ['avatar','wave'] },
  // Breakfast
  { id: 'g020', title: 'Triple Waffle Stack', src: '/images/gallery/breakfast-triple-waffle.svg', aspect: 'square', category: 'breakfast', tags: ['waffle','breakfast'] },
  { id: 'g021', title: 'Sunny Egg Trio', src: '/images/gallery/breakfast-egg-trio.svg', aspect: 'square', category: 'breakfast', tags: ['egg','breakfast'] },
  { id: 'g022', title: 'Pancake Tower', src: '/images/gallery/breakfast-pancake-tower.svg', aspect: 'portrait', category: 'breakfast', tags: ['pancake','breakfast'] },
  // Merch
  { id: 'g030', title: 'Mint Breakfast Hoodie', src: '/shop/hoodie-mint-breakfast.svg', aspect: 'square', category: 'merch', tags: ['hoodie','mint','signature'] },
  { id: 'g031', title: 'Pink Waffle Hoodie', src: '/shop/hoodie-pink-waffle.svg', aspect: 'square', category: 'merch', tags: ['hoodie','pink'] },
  // Wallpapers
  { id: 'g040', title: 'Wallpaper — Mint Morning', src: '/downloads/wallpaper-mint-morning.svg', aspect: 'portrait', category: 'wallpaper', tags: ['wallpaper','mint'], downloadable: true },
  { id: 'g041', title: 'Wallpaper — Berry Toast', src: '/downloads/wallpaper-berry-toast.svg', aspect: 'portrait', category: 'wallpaper', tags: ['wallpaper','berry'], downloadable: true },
  // Stickers
  { id: 'g050', title: 'Squad Sticker Sheet', src: '/shop/stickers-squad.svg', aspect: 'square', category: 'sticker', tags: ['sticker'] },
  // Overlays
  { id: 'g060', title: 'Going Live Overlay', src: '/shop/digital-overlays.svg', aspect: 'wide', category: 'overlay', tags: ['overlay','live'] },
];

export const GALLERY_FILTERS = [
  'all', 'hero', 'avatar', 'breakfast', 'merch', 'wallpaper',
  'sticker', 'overlay', 'social', 'mockup', 'seasonal',
] as const;
