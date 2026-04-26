export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: CollectionId;
  category: ProductCategory;
  priceCents: number;
  compareAtCents?: number;
  description: string;
  hero: string; // /public path or external URL
  /** Optional crop window — if set, render a cell of a composite grid image. */
  heroCrop?: { src: string; row: number; col: number; rows: number; cols: number };
  swatches: string[];
  sizes?: string[];
  tags: string[];
  badge?: 'new' | 'limited' | 'fan-fave' | 'restock';
  featured?: boolean;
};

export type CollectionId =
  | 'breakfast-boss'
  | 'waffle-stack'
  | 'egg-drop'
  | 'pancake-power-up'
  | 'cereal-chaos'
  | 'morning-spawn'
  | 'syrup-drip'
  | 'cozy-breakfast-club'
  | 'breakfast-gamer-essentials'
  | 'eat-with-emm';

export type ProductCategory =
  | 'hoodies' | 'tees' | 'crewnecks' | 'sweatpants' | 'pajamas'
  | 'hats' | 'socks' | 'slippers'
  | 'bags' | 'cases' | 'drinkware' | 'home'
  | 'paper' | 'plush' | 'pins' | 'stickers'
  | 'digital';

export const PRODUCTS: Product[] = [
  // ─────────────────────────────────────────────────────────────
  // REAL, sellable products only. Each `hero` (and `heroCrop.src`)
  // points to an actual photo file in /public/shop/photos/ or to a
  // hero JPEG. No SVG/animation placeholders, no AI-generated URLs.
  // To add a new SKU: shoot the product, drop the photo into
  // /public/shop/photos/, and add a row here following this shape.
  // ─────────────────────────────────────────────────────────────

  // ----- Original hero hoodies (real photos)
  { id: 'p001', slug: 'mint-breakfast-question-hoodie', name: 'Mint "What Did You Eat?" Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'The original. Mint heavyweight pullover with the slogan front and an egg trio graphic. Iykyk.', hero: '/shop/photo-hoodie-mint-breakfast.jpeg', swatches: ['#A8E6CF','#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['slogan','breakfast','egg','mint'], badge: 'fan-fave', featured: true },
  { id: 'p002', slug: 'pink-waffle-stack-hoodie', name: 'Pink Waffle Stack Hoodie', collection: 'waffle-stack', category: 'hoodies', priceCents: 5800, description: 'Berry pink pullover with a four-stack waffle graphic and butter pat detail. She ate.', hero: '/shop/photo-hoodie-pink-waffle.jpeg', swatches: ['#F4B7D6','#FFFCF5'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['waffle','pink','iconic'], badge: 'fan-fave', featured: true },

  // ----- Grid 1 (real composite photo split via heroCrop)
  { id: 'p061', slug: 'white-smiley-egg-tee', name: 'White Smiley Egg Tee', collection: 'egg-drop', category: 'tees', priceCents: 3000, description: 'White cotton tee, soft smiley-egg embroidery on the chest. Morning-person aura.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 0, col: 1, rows: 2, cols: 3 }, swatches: ['#FFFCF5','#F4D86A'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','egg','smiley'], badge: 'new', featured: true },
  { id: 'p062', slug: 'breakfast-first-mug', name: '"Breakfast First" Mug', collection: 'breakfast-boss', category: 'drinkware', priceCents: 1800, description: 'Glossy white 12oz mug with cocoa "BREAKFAST FIRST" type. The main-character mug.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#FFFCF5','#3B2A22'], sizes: ['12oz'], tags: ['mug','drinkware','slogan'], badge: 'fan-fave', featured: true },
  { id: 'p063', slug: 'egg-keychain-pair', name: 'Egg Keychain Pair', collection: 'egg-drop', category: 'pins', priceCents: 1200, description: 'Two acrylic egg keychains — one mint, one cream. Tiny aura, max delulu.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 0, rows: 2, cols: 3 }, swatches: ['#A8E6CF','#FFFCF5'], sizes: ['One Size'], tags: ['keychain','egg','accessory'], badge: 'new' },
  { id: 'p064', slug: 'black-egg-patch-cap', name: 'Black Egg Patch Cap', collection: 'breakfast-gamer-essentials', category: 'hats', priceCents: 3000, description: 'Curved-brim black dad cap, sunny-side egg patch dead center. Ate that.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 1, rows: 2, cols: 3 }, swatches: ['#0F0E0D','#F4D86A'], sizes: ['One Size'], tags: ['cap','dad-hat','black','egg'], badge: 'new', featured: true },
  { id: 'p065', slug: 'waffle-pattern-tote-cream', name: 'Waffle Pattern Tote (Cream)', collection: 'waffle-stack', category: 'bags', priceCents: 2400, description: 'Heavy cotton tote, allover waffle print, syrup-amber straps. 100% bussin.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#F4ECDC','#E8A53C'], sizes: ['One Size'], tags: ['tote','bag','waffle'] },

  // ----- Grid 2 (real composite photo split via heroCrop)
  { id: 'p066', slug: 'black-breakfast-mode-neon-hoodie', name: 'Black "Breakfast Mode" Neon Hoodie', collection: 'breakfast-gamer-essentials', category: 'hoodies', priceCents: 6400, description: 'Heavyweight black pullover, neon-mint "BREAKFAST MODE" lockup. Sigma drop, fr fr.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 0, rows: 2, cols: 3 }, swatches: ['#0F0E0D','#A8E6CF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','black','neon'], badge: 'limited', featured: true },
  { id: 'p067', slug: 'cream-cereal-bowl-tee', name: 'Cream Cereal Bowl Tee', collection: 'cereal-chaos', category: 'tees', priceCents: 3000, description: 'Cream tee with retro cereal-bowl illustration. Brunch-coded delulu.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 1, rows: 2, cols: 3 }, swatches: ['#FFFCF5','#FF8AA1'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','cereal','cream'], badge: 'new' },
  { id: 'p068', slug: 'black-eat-first-neon-mug', name: 'Black "Eat First" Neon Mug', collection: 'breakfast-gamer-essentials', category: 'drinkware', priceCents: 2000, description: 'Matte black 12oz mug, neon-mint "EAT FIRST" wrap print. Iykyk.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#0F0E0D','#A8E6CF'], sizes: ['12oz'], tags: ['mug','drinkware','black'], badge: 'limited' },
  { id: 'p069', slug: 'egg-acrylic-keychain', name: 'Egg Acrylic Keychain', collection: 'egg-drop', category: 'pins', priceCents: 800, description: 'Single acrylic egg charm with gold ring. Tiny W.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#FFD89C','#3B2A22'], sizes: ['One Size'], tags: ['keychain','egg'] },

  // ----- Grid 4 (real composite photo split via heroCrop)
  { id: 'p070', slug: 'yellow-wdyefb-hoodie', name: 'Yellow "WDYEFB" Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'Sunshine yellow pullover, soft cocoa "WHAT DID YOU EAT FOR BREAKFAST" front print. Main-character energy.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 0, col: 0, rows: 2, cols: 3 }, swatches: ['#F4D86A','#3B2A22'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','yellow','slogan'], badge: 'fan-fave', featured: true },
  { id: 'p071', slug: 'sage-wdyefb-hoodie-2eggs', name: 'Sage "WDYEFB" Hoodie (2-Eggs)', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'Sage-green pullover with double sunny-side egg motif under the slogan. Slay.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#B8D4A8','#3B2A22','#F4D86A'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','sage','slogan'], badge: 'new', featured: true },
  { id: 'p072', slug: 'gold-egg-keychain', name: 'Gold Egg Keychain', collection: 'egg-drop', category: 'pins', priceCents: 1000, description: 'Tiny enamel sunny-side egg charm with gold ring. Aura point pickup.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 1, col: 1, rows: 2, cols: 3 }, swatches: ['#F4D86A','#FFFCF5'], sizes: ['One Size'], tags: ['keychain','egg','gold'] },
  { id: 'p073', slug: 'wdyefb-egg-sock-pair', name: 'WDYEFB Egg Sock Pair', collection: 'breakfast-boss', category: 'socks', priceCents: 1200, description: 'Crew-length cream socks with allover egg motif and slogan stripe. Cozy era.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#FFFCF5','#F4D86A'], sizes: ['One Size'], tags: ['socks','cream','egg'], badge: 'new' },

  // ----- Standalone real-photo sticker
  { id: 'p074', slug: 'good-morning-cereal-sticker', name: '"Good Morning" Cereal Sticker', collection: 'cereal-chaos', category: 'stickers', priceCents: 400, description: 'Vinyl sticker — pastel cereal bowl with "good morning" handwriting. Stick it everywhere fr.', hero: '/shop/photos/sticker-good-morning-cereal.jpeg', swatches: ['#FF9EC0','#A8E6CF','#FFD89C'], sizes: ['3 in'], tags: ['sticker','cute','vinyl'], badge: 'new' },
];

/** Featured selection for home — anything flagged featured: true. */
export const FEATURED_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.featured).slice(0, 8);
