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
  //
  // ORDER + NAMES updated 2026-04-26 to match what each rendered
  // card actually shows in the shop grid (the heroCrop coordinates
  // were producing different visuals than the previous names
  // implied). Egg accessories (socks + sock pair + gold keychain)
  // are grouped together at the bottom so they advertise as a set.
  // ─────────────────────────────────────────────────────────────

  // ----- Original hero hoodies (real photos) — first 2 sweaters
  { id: 'p001', slug: 'mint-breakfast-question-hoodie', name: 'Mint "What Did You Eat?" Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'The original. Mint heavyweight pullover with the slogan front and an egg trio graphic. Iykyk.', hero: '/shop/photo-hoodie-mint-breakfast.jpeg', swatches: ['#A8E6CF','#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['slogan','breakfast','egg','mint'], badge: 'fan-fave', featured: true },
  { id: 'p002', slug: 'pink-waffle-stack-hoodie', name: 'Pink Waffle Stack Hoodie', collection: 'waffle-stack', category: 'hoodies', priceCents: 5800, description: 'Berry pink pullover with a four-stack waffle graphic and butter pat detail. She ate.', hero: '/shop/photo-hoodie-pink-waffle.jpeg', swatches: ['#F4B7D6','#FFFCF5'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['waffle','pink','iconic'], badge: 'fan-fave', featured: true },

  // ----- Hero WDYEFB hoodie family (the big colorways)
  { id: 'p066', slug: 'yellow-wdyefb-hoodie', name: 'Yellow "WDYEFB" Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'Sunshine yellow pullover with cocoa "WHAT DID YOU EAT FOR BREAKFAST" front print and sunny-egg motif. Main-character energy.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 0, rows: 2, cols: 3 }, swatches: ['#F4D86A','#3B2A22'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','yellow','wdyefb','slogan'], badge: 'fan-fave', featured: true },
  { id: 'p070', slug: 'black-breakfast-mode-activated-hoodie', name: 'Black "Breakfast Mode Activated" Hoodie', collection: 'breakfast-gamer-essentials', category: 'hoodies', priceCents: 6400, description: 'Heavyweight black pullover with neon "BREAKFAST MODE ACTIVATED" lockup and twin neon-egg graphic. Sigma drop, fr fr.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 0, col: 0, rows: 2, cols: 3 }, swatches: ['#0F0E0D','#A8E6CF','#F4D86A'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','black','neon','breakfast-mode'], badge: 'limited', featured: true },
  { id: 'p067', slug: 'pink-wdyefb-waffle-hoodie', name: 'Pink "WDYEFB" Waffle Hoodie', collection: 'waffle-stack', category: 'hoodies', priceCents: 5800, description: 'Berry-pink pullover with the waffle stack graphic and "WHAT DID YOU EAT FOR BREAKFAST?" front print. Brunch-coded.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 1, rows: 2, cols: 3 }, swatches: ['#F4B7D6','#3B2A22','#E8A53C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','pink','wdyefb','waffle'], badge: 'new', featured: true },
  { id: 'p068', slug: 'sage-wdyefb-eggs-hoodie', name: 'Sage "WDYEFB" Eggs Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'Sage-green pullover with the slogan and a twin sunny-side egg motif on the front pocket. Slay.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#B8D4A8','#3B2A22','#F4D86A'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','sage','wdyefb'], badge: 'new', featured: true },

  // ----- Poster-classic graphic apparel (from the BREAKFAST CLUB collection sheet)
  { id: 'p061', slug: 'breakfast-loading-hoodie', name: '"Breakfast Loading…" Hoodie', collection: 'breakfast-gamer-essentials', category: 'hoodies', priceCents: 5400, description: 'Powder-blue pullover with the "BREAKFAST LOADING…" pixel-bar print. Buffer up.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 0, col: 1, rows: 2, cols: 3 }, swatches: ['#B8D8E8','#3B2A22'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','blue','gamer'], badge: 'new' },
  { id: 'p062', slug: 'powered-by-syrup-tee', name: '"Powered By Syrup" Tee', collection: 'syrup-drip', category: 'tees', priceCents: 3000, description: 'Pink cotton tee with the "POWERED BY SYRUP" stack graphic. Honey-amber drip.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#F4B7D6','#E8A53C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','pink','syrup'], badge: 'new' },
  { id: 'p065', slug: 'waffle-toast-keychain-set', name: '"Waffle & Toast" Keychain Set', collection: 'waffle-stack', category: 'pins', priceCents: 1400, description: 'Two-piece acrylic charm set — one waffle + one toast pat. Tiny breakfast on your bag.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#E8A53C','#F4ECDC'], sizes: ['One Size'], tags: ['keychain','waffle','toast','set'] },

  // ----- Drinkware
  { id: 'p071', slug: 'black-eat-first-neon-mug', name: 'Black "Eat First" Neon Mug', collection: 'breakfast-gamer-essentials', category: 'drinkware', priceCents: 2000, description: 'Matte-black 12oz mug with twin neon-egg motif and "EAT FIRST" wrap print. Iykyk.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 0, col: 2, rows: 2, cols: 3 }, swatches: ['#0F0E0D','#A8E6CF','#F4D86A'], sizes: ['12oz'], tags: ['mug','drinkware','black','eat-first'], badge: 'limited' },

  // ----- Bags
  { id: 'p072', slug: 'waffle-pattern-tote', name: 'Waffle Pattern Tote', collection: 'waffle-stack', category: 'bags', priceCents: 2400, description: 'Cream cotton tote with allover golden-waffle print and dark-chocolate straps. 100% bussin.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 1, col: 1, rows: 2, cols: 3 }, swatches: ['#F4ECDC','#E8A53C','#3B2A22'], sizes: ['One Size'], tags: ['tote','bag','waffle'] },

  // ─────────────────────────────────────────────────────────────
  // EGG ACCESSORIES — ALIGNED ROW. Sock pairs + the gold sunny
  // egg keychain advertise side-by-side: cozy era starter pack.
  // ─────────────────────────────────────────────────────────────
  { id: 'p064', slug: 'crispy-bacon-sock-pair', name: '"Crispy Bacon" Sock Pair', collection: 'breakfast-boss', category: 'socks', priceCents: 1200, description: 'Pink crew socks with allover crispy-bacon strip print. Cozy era.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 1, rows: 2, cols: 3 }, swatches: ['#F4B7D6','#C97B3D'], sizes: ['One Size'], tags: ['socks','pink','bacon'], badge: 'new' },
  { id: 'p063', slug: 'sunny-side-up-sock-pair', name: '"Sunny Side Up" Sock Pair', collection: 'egg-drop', category: 'socks', priceCents: 1200, description: 'Soft-blue crew socks with allover sunny-side-egg print. Aura points.', hero: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-1-mint-tee-mug-cap-tote-keychain.png', row: 1, col: 0, rows: 2, cols: 3 }, swatches: ['#B8D8E8','#F4D86A','#FFFCF5'], sizes: ['One Size'], tags: ['socks','blue','egg','sunny-side'], badge: 'new' },
  { id: 'p069', slug: 'wdyefb-egg-sock-pair', name: 'WDYEFB Egg Sock Pair', collection: 'breakfast-boss', category: 'socks', priceCents: 1200, description: 'Cream crew socks with allover sunny-side-egg motif and the "WDYEFB" cuff label. The matching pair.', hero: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', heroCrop: { src: '/shop/photos/grid-2-black-cream-mug-cap-tote-keychain.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#FFFCF5','#F4D86A','#3B2A22'], sizes: ['One Size'], tags: ['socks','cream','egg','wdyefb','set'], badge: 'new' },
  { id: 'p073', slug: 'gold-sunny-egg-keychain', name: 'Gold Sunny Egg Acrylic Keychain', collection: 'egg-drop', category: 'pins', priceCents: 1000, description: 'Single sunny-side-up egg charm — glossy enamel on acrylic with a gold ring. Aura point pickup.', hero: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', heroCrop: { src: '/shop/photos/grid-4-wdyefb-3color-keychain-socks.png', row: 1, col: 2, rows: 2, cols: 3 }, swatches: ['#F4D86A','#FFFCF5'], sizes: ['One Size'], tags: ['keychain','egg','gold','accessory'], badge: 'new' },

  // ----- Standalone real-photo sticker
  { id: 'p074', slug: 'good-morning-cereal-sticker', name: '"Good Morning" Cereal Sticker', collection: 'cereal-chaos', category: 'stickers', priceCents: 400, description: 'Vinyl sticker — pastel cereal bowl with "good morning" handwriting. Stick it everywhere fr.', hero: '/shop/photos/sticker-good-morning-cereal.jpeg', swatches: ['#FF9EC0','#A8E6CF','#FFD89C'], sizes: ['3 in'], tags: ['sticker','cute','vinyl'], badge: 'new' },
];

/** Featured selection for home — anything flagged featured: true. */
export const FEATURED_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.featured).slice(0, 8);
