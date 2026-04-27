/**
 * Avatar Fits — EMM's Roblox avatar across themes, games, and looks.
 * These are real renders TKDL provided. Surfaced on /gallery and on a dedicated
 * "Avatar Fits" rail on the home page below the breakfast-of-the-day card.
 */

export type AvatarFit = {
  id: string;
  src: string;        // /public path
  title: string;
  vibe: string;       // 1-line description
  category: 'roblox-game' | 'fashion' | 'meme' | 'cozy' | 'breakfast';
  badge?: 'new' | 'featured' | 'limited' | 'iconic';
  width?: number;
  height?: number;
  collection?: string; // optional grouping (e.g. "99 Nights series")
};

export const AVATAR_FITS: AvatarFit[] = [
  // ===== 99 NIGHTS IN THE FOREST series =====
  { id: 'fit-99-poster',  src: '/images/avatars/fits/99-nights-poster.png',  title: '99 NIGHTS — Elite Survivor poster', vibe: 'The forest is watching. Survive. Build. Escape.', category: 'roblox-game', badge: 'featured', collection: '99 Nights' },
  { id: 'fit-99-lantern', src: '/images/avatars/fits/99-nights-lantern.png', title: '99 NIGHTS — Lantern Walk',         vibe: 'Knit beanie + lantern + bear-charm. Eyes in the dark.', category: 'roblox-game', collection: '99 Nights' },
  { id: 'fit-99-camp',    src: '/images/avatars/fits/99-nights-camp.png',    title: '99 NIGHTS — Camp Watch',            vibe: 'Hooded by the fire, axe in hand. KEEP OUT.',           category: 'roblox-game', collection: '99 Nights' },
  { id: 'fit-99-survivor',src: '/images/avatars/fits/99-nights-survivor.png',title: '99 NIGHTS — Lantern (alt)',         vibe: 'Mushroom path + moonlight. Squad of one.',             category: 'roblox-game', collection: '99 Nights' },

  // ===== Couture / Fashion =====
  { id: 'fit-met-gala',   src: '/images/avatars/fits/met-gala-emerald.png',  title: 'Met Gala — Emerald Sweep',         vibe: 'Strapless emerald gown, crystal slick, shutter wall.',  category: 'fashion', badge: 'iconic' },
  { id: 'fit-celestial',  src: '/images/avatars/fits/celestial-moon.png',    title: 'Celestial Moon — Star Crown',      vibe: 'Star-crown + midnight gown. Cosmic runway.',           category: 'fashion', badge: 'limited' },
  { id: 'fit-demon',      src: '/images/avatars/fits/demon-queen.png',       title: 'Demon Queen — Red Moon',           vibe: 'Horned crown, chain corset, blood-moon stage.',         category: 'fashion' },
  { id: 'fit-petit',      src: '/images/avatars/fits/petit-dejeuner-couture.png', title: 'Maison du Petit Déjeuner', vibe: 'Haute brunch couture — pearls + pancake hat.',           category: 'fashion', badge: 'featured' },
  { id: 'fit-runway',     src: '/images/avatars/fits/breakfast-runway.png',  title: 'Breakfast Runway — Strawberry',    vibe: 'Pancake hat + strawberry-syrup gown. CEREAL KILLER mug.', category: 'fashion' },
  { id: 'fit-lv',         src: '/images/avatars/fits/lv-street-luxe.png',    title: 'LV Street Luxe',                   vibe: 'Cap + monogram puffer + Speedy mini outside Vuitton.',   category: 'fashion', badge: 'new' },

  // ===== Cozy / Lifestyle =====
  { id: 'fit-pjs',        src: '/images/avatars/fits/princess-satin-pjs.png',title: 'Princess Satin PJs',               vibe: 'Pink satin set, fluffy slides, Slay pillow, city lights.', category: 'cozy', badge: 'new' },

  // ===== Meme / Brainrot =====
  { id: 'fit-brainrot',   src: '/images/avatars/fits/brainrot-aura.png',     title: 'BRAINROT IS MY LOVE LANGUAGE',     vibe: 'Sigma queen cap, cow-print coat, full meme density.',   category: 'meme', badge: 'iconic' },

  // ===== Breakfast assets =====
  { id: 'fit-cereal-stk', src: '/images/avatars/fits/good-morning-sticker.png', title: 'Good Morning Cereal — Sticker', vibe: 'Rainbow loops in a smiling bowl. Sticker-pack art.',     category: 'breakfast' },
];

export const FITS_BY_CATEGORY = {
  'roblox-game': AVATAR_FITS.filter((f) => f.category === 'roblox-game'),
  fashion:       AVATAR_FITS.filter((f) => f.category === 'fashion'),
  cozy:          AVATAR_FITS.filter((f) => f.category === 'cozy'),
  meme:          AVATAR_FITS.filter((f) => f.category === 'meme'),
  breakfast:     AVATAR_FITS.filter((f) => f.category === 'breakfast'),
};
