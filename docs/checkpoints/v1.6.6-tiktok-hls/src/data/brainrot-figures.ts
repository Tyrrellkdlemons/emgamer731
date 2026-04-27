/**
 * 67 BRAINROT FIGURES — sellable collectible characters that pair with the
 * 67 educational brainrots. The "67" comes from the Gen-Z "67" slang that
 * runs across the site; not literal.
 *
 * Two figure families:
 *   - "brot" → chibi brainrot mascots (full collectible drops — sticker +
 *     printable poster + lockscreen wallpaper bundle).
 *   - "ava"  → EMM's actual Roblox avatar fits (drops as wearable avatar
 *     code + sticker + wallpaper).
 *
 * MONETIZATION (per creator brief):
 *   - Multiple payment methods supported in pipeline: Robux, Stripe (card,
 *     Apple Pay, Google Pay), PayPal.
 *   - "Subscribe + watch a short / replay" unlocks figures FREE — the
 *     reward funnel that promotes YouTube growth. Tracked client-side via
 *     localStorage so unlocks survive sessions.
 *   - Tiers (common/rare/limited) gate by watch-count or paid.
 */

export type FigureRarity = 'common' | 'rare' | 'limited' | 'mythic';
export type FigureFamily = 'brot' | 'ava' | 'menu';

export type BrainrotFigure = {
  id: string;
  /** Display name. */
  name: string;
  /** One-line vibe. */
  tagline: string;
  family: FigureFamily;
  rarity: FigureRarity;
  /** Slug — also used to construct the image path /images/figures/<slug>.webp */
  slug: string;
  /** USD price in cents — Robux equivalent computed at render-time. */
  priceCents: number;
  /** Robux equivalent (for display). 1 USD ≈ 80 Robux at Roblox standard rate. */
  priceRobux: number;
  /** Subscribe-to-unlock tier — how many YouTube shorts to watch to unlock free. */
  unlockShorts?: number;
  /** Subscribe-to-unlock tier — how many replays to watch to unlock free. */
  unlockReplays?: number;
  /** Bundle contents — what the buyer actually gets. */
  formats: string[];
  /** Color used for the card accent (matches the figure photo's palette). */
  accent: string;
};

/* ─────────────────────────────────────────────────────────────────
   PRICING + UNLOCK TIERS — easy to tune in one place.
   ───────────────────────────────────────────────────────────────── */
export const RARITY_PRICE: Record<FigureRarity, { usdCents: number; robux: number; label: string; ring: string }> = {
  common:  { usdCents:  299, robux: 240,  label: 'Common',  ring: '#A8E6CF' },
  rare:    { usdCents:  599, robux: 480,  label: 'Rare',    ring: '#7B61FF' },
  limited: { usdCents:  999, robux: 800,  label: 'Limited', ring: '#FF4757' },
  mythic:  { usdCents: 1999, robux: 1600, label: 'Mythic',  ring: '#FFD700' },
};

export const UNLOCK_RULES = {
  /** Watch this many shorts on /watch to earn 1 unlock credit. */
  shortsPerCredit: 3,
  /** Watch this many full replays to earn 1 unlock credit. */
  replaysPerCredit: 1,
  /** Subscribe to YT — instant 1 credit. */
  subscribeCredit: 1,
} as const;

/* ─────────────────────────────────────────────────────────────────
   THE FIGURES — every entry maps to an actual photo in
   /public/images/figures/ that has been optimized to webp.
   ───────────────────────────────────────────────────────────────── */
const make = (
  id: string, name: string, tagline: string, family: FigureFamily,
  slug: string, rarity: FigureRarity, accent: string,
  unlockShorts?: number, unlockReplays?: number,
): BrainrotFigure => ({
  id, name, tagline, family, slug, rarity,
  priceCents: RARITY_PRICE[rarity].usdCents,
  priceRobux: RARITY_PRICE[rarity].robux,
  unlockShorts, unlockReplays,
  formats: family === 'ava'
    ? ['Avatar code', 'Sticker', 'Wallpaper']
    : family === 'menu'
      ? ['Poster (digital)', 'Wallpaper', 'Lockscreen']
      : ['Sticker', 'Wallpaper', 'Lockscreen'],
  accent,
});

export const BRAINROT_FIGURES: BrainrotFigure[] = [
  // ─── BROT MASCOTS (chibi brainrot characters) ───
  make('f-og',     'OG Brainrot',         'Where it all started. Original cap, blue glow, classic.',         'brot', 'og-brot',      'common',  '#5BD2D8', 3),
  make('f-731',    '731 Brainrot',        'The HQ mascot. Number drop, varsity vibes, sneaker-coded.',        'brot', '731-brot',     'rare',    '#7B61FF', undefined, 1),
  make('f-pcake',  'Pancake Brainrot',    'Stack-on-head energy. Syrup core. Brunch-coded.',                  'brot', 'pancake-brot', 'common',  '#FFD89C', 3),
  make('f-pcake2', 'Pancake Brainrot 2',  'The remix. Fresh berry crown.',                                    'brot', 'pcake-2-brot', 'common',  '#FF9EC0', 3),
  make('f-pj',     'PJ Brainrot',         'Cozy era. Pajama set, silk slippers, breakfast-in-bed dream.',     'brot', 'new-pj-brot',  'rare',    '#F4B7D6', undefined, 1),
  make('f-kpop',   'K-Pop Brainrot',      'Stage drop. Idol fit. Encore unlocks.',                            'brot', 'kpopd-brot',   'limited', '#FF4757'),
  make('f-brot',   'Brainrot Mini',       'Tiny W. Pocket-sized brainrot with zero rights.',                  'brot', 'br-brot',      'common',  '#A8E6CF', 3),
  make('f-brotx',  'Brainrot Sample',     'Free trial of brainrot. The sample plate.',                        'brot', 'brot-ex',      'common',  '#FFD89C', 0),

  // ─── AVA FITS (Roblox avatar drops) ───
  make('f-99n1',   '99 NIGHTS — Lantern',     'Survivor in the dark forest. Lantern + bear charm.',            'ava', '99-nights-ava-1',  'rare',    '#3B2A22', undefined, 1),
  make('f-99n2',   '99 NIGHTS — Survivor 2',  'Camp watch fit. Cozy by the fire, axe ready.',                  'ava', '99-nights-2-ava',  'rare',    '#5C2C18', undefined, 1),
  make('f-99n3',   '99 NIGHTS — Mushroom',    'Moonlit mushroom path. Squad of one.',                          'ava', '99-nights-3-ava',  'limited', '#7B3A12'),
  make('f-99n4',   '99 NIGHTS — Elite',       'Top-tier survivor fit. Earned, not bought.',                    'ava', '99-nights-4-ava',  'limited', '#1A0F0A'),
  make('f-met',    'Met Gala Drip',           'Strapless emerald, crystal slick, shutter wall.',               'ava', 'metgala-ava',      'mythic',  '#1F8A4F'),
  make('f-pj-ava', 'Princess Satin PJs',      'Pink satin set, fluffy slides, Slay pillow, city lights.',      'ava', 'pajama-ava',       'rare',    '#F4B7D6', undefined, 1),
  make('f-bluski', 'Bluskii',                 'Cool tones, ice-cream blue. Quiet flex.',                       'ava', 'bluskii-ava',      'common',  '#7DC9F1', 3),
  make('f-okay',   'OkayLilMama',             'Soft glam. Strawberry milkshake palette.',                      'ava', 'okaylilmama-ava',  'common',  '#FF9EC0', 3),
  make('f-berry',  'Lil Berry Bfast',         'Strawberry breakfast couture. Pink runway.',                    'ava', 'lil-berry-bfast-ava', 'rare', '#FF5C8A', undefined, 1),
  make('f-street', 'Street Ninja',            'Urban runway. Hood up, all eyes.',                              'ava', 'streetninja-ava',  'limited', '#3B2A22'),
  make('f-kpopa',  'K-Pop Diva',              'Stage avatar. Encore-only fit.',                                'ava', 'kpopd-ava',        'limited', '#FF4757'),
  make('f-newkp',  'K-Pop Diva v2',           'Fresh remix of the stage fit.',                                 'ava', 'new-kpopd-ava',    'rare',    '#FF9EC0', undefined, 1),
  make('f-brot-ava','Brainrot Avatar',        'Become the brainrot. Wear the meme.',                           'ava', 'b-rot-ava',        'mythic',  '#5BD2D8'),

  // ─── COLLECTOR MENU POSTERS ───
  make('f-menu1',  'Brainrot Menu — Vol 1',   'Full character lineup poster. Wall-worthy.',                    'menu', 'brot-menu-1',      'limited', '#FFD89C'),
  make('f-menu2',  'Brainrot Menu — Vol 2',   'Lineup poster, color swap edition.',                            'menu', 'brot-menu-2',      'limited', '#FF9EC0'),
];

/* Helpers ─────────────────────────────────────────────────────────── */
export const FIGURE_FAMILIES: { id: FigureFamily; label: string; emoji: string }[] = [
  { id: 'brot', label: 'Brot mascots',  emoji: '🤖' },
  { id: 'ava',  label: 'Avatar fits',   emoji: '👗' },
  { id: 'menu', label: 'Posters',       emoji: '🖼️' },
];

export function figureImagePath(fig: BrainrotFigure, ext: 'webp' | 'jpg' = 'webp'): string {
  return `/images/figures/${fig.slug}.${ext}`;
}
