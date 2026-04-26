export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: CollectionId;
  category: ProductCategory;
  priceCents: number;
  compareAtCents?: number;
  description: string;
  hero: string; // /public path
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
  // ----- Hoodies & sweats
  { id: 'p001', slug: 'mint-breakfast-question-hoodie', name: 'Mint "What Did You Eat?" Hoodie', collection: 'breakfast-boss', category: 'hoodies', priceCents: 5800, description: 'The original. Mint heavyweight pullover with the slogan front and an egg trio graphic.', hero: '/shop/photo-hoodie-mint-breakfast.jpeg', swatches: ['#A8E6CF','#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['slogan','breakfast','egg','mint'], badge: 'fan-fave', featured: true },
  { id: 'p002', slug: 'pink-waffle-stack-hoodie', name: 'Pink Waffle Stack Hoodie', collection: 'waffle-stack', category: 'hoodies', priceCents: 5800, description: 'Berry pink pullover with a four-stack waffle graphic and butter pat detail.', hero: '/shop/photo-hoodie-pink-waffle.jpeg', swatches: ['#F4B7D6','#FFFCF5'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['waffle','pink','iconic'], badge: 'fan-fave', featured: true },
  { id: 'p003', slug: 'syrup-drip-zip-hoodie', name: 'Syrup Drip Zip Hoodie', collection: 'syrup-drip', category: 'hoodies', priceCents: 6200, description: 'Honey-amber zip with caramel drip embroidery on the chest.', hero: '/shop/photo-hoodie-syrup-amber.svg', swatches: ['#E8A53C','#C97B3D'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['premium','drip','syrup'], badge: 'new' },
  { id: 'p004', slug: 'cozy-cream-crewneck', name: 'Cozy Cream Crewneck', collection: 'cozy-breakfast-club', category: 'crewnecks', priceCents: 4800, description: 'Heavyweight cream crewneck with subtle slogan tonal print.', hero: '/shop/crewneck-cream.svg', swatches: ['#FFF8EE'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['cream','quiet-luxe'] },
  { id: 'p005', slug: 'pancake-tower-crewneck', name: 'Pancake Tower Crewneck', collection: 'pancake-power-up', category: 'crewnecks', priceCents: 4800, description: 'Buttery yellow crewneck with a six-stack pancake tower print.', hero: '/shop/crewneck-pancake.svg', swatches: ['#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['pancake','butter'] },
  { id: 'p006', slug: 'morning-spawn-sweatpants', name: 'Morning Spawn Sweatpants', collection: 'morning-spawn', category: 'sweatpants', priceCents: 4400, description: 'Soft jogger fit with EMG731 hem tag and pocket waffle texture.', hero: '/shop/photo-sweatpants-cocoa.svg', swatches: ['#3B2A22','#A8E6CF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['joggers','soft'] },
  { id: 'p007', slug: 'breakfast-pajama-set', name: 'Breakfast Squad Pajama Set', collection: 'cozy-breakfast-club', category: 'pajamas', priceCents: 5400, description: 'Two-piece long-sleeve set covered in tossed breakfast icons.', hero: '/shop/pajamas-set.svg', swatches: ['#FFD89C','#FF9EC0'], sizes: ['XS','S','M','L','XL'], tags: ['pajamas','print'] },
  // ----- Tees
  { id: 'p008', slug: 'eat-with-emm-cropped-tee', name: '"Eat With EMM" Cropped Tee', collection: 'eat-with-emm', category: 'tees', priceCents: 3200, description: 'Cropped cream tee with cursive front print.', hero: '/shop/tee-cropped-eatwithemm.svg', swatches: ['#FFFCF5','#FF9EC0'], sizes: ['XS','S','M','L','XL'], tags: ['cropped','signature'] },
  { id: 'p009', slug: 'breakfast-boss-tee', name: 'Breakfast Boss Tee', collection: 'breakfast-boss', category: 'tees', priceCents: 2800, description: 'Eggshell cotton tee with bold "BREAKFAST BOSS" lockup.', hero: '/shop/tee-breakfast-boss.svg', swatches: ['#FFFCF5','#A8E6CF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['classic','slogan'] },
  { id: 'p010', slug: 'cereal-chaos-tee', name: 'Cereal Chaos Tee', collection: 'cereal-chaos', category: 'tees', priceCents: 2800, description: 'Lavender tee printed with floating cereal pieces.', hero: '/shop/tee-cereal-chaos.svg', swatches: ['#E2D6FF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['cereal','playful'] },
  { id: 'p011', slug: 'gamer-essentials-tee-3pack', name: 'Gamer Essentials Tee 3-Pack', collection: 'breakfast-gamer-essentials', category: 'tees', priceCents: 6800, description: 'Three core colorways: cream, mint, berry. Best value.', hero: '/shop/tee-3pack.svg', swatches: ['#FFFCF5','#A8E6CF','#FF9EC0'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['bundle','value'], badge: 'new' },
  // ----- Hats / accessories
  { id: 'p012', slug: 'avatar-callback-cap', name: 'Avatar Callback Black Cap', collection: 'eat-with-emm', category: 'hats', priceCents: 3200, description: 'Black 6-panel cap embroidered with "EMG731" — the iconic avatar callback.', hero: '/shop/photo-cap-black-emg731.svg', swatches: ['#1F1611'], sizes: ['One Size'], tags: ['cap','avatar','signature'], badge: 'fan-fave', featured: true },
  { id: 'p013', slug: 'mint-beanie', name: 'Mint Squad Beanie', collection: 'cozy-breakfast-club', category: 'hats', priceCents: 2200, description: 'Cuffed mint beanie with woven Squad tab.', hero: '/shop/beanie-mint.svg', swatches: ['#A8E6CF'], sizes: ['One Size'], tags: ['beanie','winter'] },
  { id: 'p014', slug: 'breakfast-socks-3pack', name: 'Breakfast Socks 3-Pack', collection: 'breakfast-gamer-essentials', category: 'socks', priceCents: 2400, description: 'Three crew-length socks: waffle / egg / pancake patterns.', hero: '/shop/socks-3pack.svg', swatches: ['#FFD89C','#FFFCF5','#FF9EC0'], sizes: ['One Size'], tags: ['socks','set'] },
  { id: 'p015', slug: 'pancake-slippers', name: 'Pancake Slippers', collection: 'pancake-power-up', category: 'slippers', priceCents: 3800, description: 'Plush pancake slippers — yes really. Butter-pat embroidery on top.', hero: '/shop/slippers-pancake.svg', swatches: ['#FFD89C'], sizes: ['S','M','L'], tags: ['slippers','plush','novelty'], badge: 'limited' },
  // ----- Bags
  { id: 'p016', slug: 'breakfast-backpack', name: 'Breakfast Squad Backpack', collection: 'breakfast-gamer-essentials', category: 'bags', priceCents: 5400, description: '20L school-ready backpack with tossed-icon print and laptop sleeve.', hero: '/shop/backpack-breakfast.svg', swatches: ['#A8E6CF','#FFD89C'], sizes: ['One Size'], tags: ['backpack','school'], badge: 'new' },
  { id: 'p017', slug: 'lunch-bag-cooler', name: '"Eat With EMM" Lunch Cooler', collection: 'eat-with-emm', category: 'bags', priceCents: 2800, description: 'Insulated lunch bag — keeps morning waffles cool until 11am.', hero: '/shop/lunchbag-eatwithemm.svg', swatches: ['#FF9EC0'], sizes: ['One Size'], tags: ['lunch','school'] },
  { id: 'p018', slug: 'tote-waffle', name: 'Waffle Tote', collection: 'waffle-stack', category: 'bags', priceCents: 1800, description: 'Cotton tote with single waffle print. Carry your snacks.', hero: '/shop/tote-waffle.svg', swatches: ['#FFFCF5'], sizes: ['One Size'], tags: ['tote'] },
  // ----- Cases
  { id: 'p019', slug: 'phone-case-egg', name: 'Sunny Egg Phone Case', collection: 'egg-drop', category: 'cases', priceCents: 2400, description: 'Glossy phone case with floating sunny egg pattern. iPhone + Pixel.', hero: '/shop/case-phone-egg.svg', swatches: ['#FFD89C','#FFFCF5'], sizes: ['iPhone 15','iPhone 15 Pro','iPhone 14','Pixel 8'], tags: ['phone','case','egg'] },
  { id: 'p020', slug: 'tablet-sleeve-mint', name: 'Mint Tablet Sleeve', collection: 'cozy-breakfast-club', category: 'cases', priceCents: 3200, description: 'Padded sleeve fits up to 11" tablets. Mint with cocoa stitch.', hero: '/shop/case-tablet-mint.svg', swatches: ['#A8E6CF'], sizes: ['10"','11"'], tags: ['tablet','sleeve'] },
  // ----- Drinkware
  { id: 'p021', slug: 'morning-mug', name: 'Morning Mug', collection: 'morning-spawn', category: 'drinkware', priceCents: 1800, description: 'Stoneware mug — slogan wraps the body. Dishwasher-safe.', hero: '/shop/mug-morning.svg', swatches: ['#FFF8EE'], sizes: ['12oz'], tags: ['mug'] },
  { id: 'p022', slug: 'syrup-drip-tumbler', name: 'Syrup Drip Tumbler', collection: 'syrup-drip', category: 'drinkware', priceCents: 3200, description: '20oz insulated tumbler. Honey-amber gradient.', hero: '/shop/tumbler-syrup.svg', swatches: ['#E8A53C','#C97B3D'], sizes: ['20oz'], tags: ['tumbler'] },
  { id: 'p023', slug: 'water-bottle-mint', name: 'Mint Water Bottle', collection: 'breakfast-gamer-essentials', category: 'drinkware', priceCents: 2800, description: '24oz insulated bottle, mint w/ cocoa lid. Carry it everywhere.', hero: '/shop/waterbottle-mint.svg', swatches: ['#A8E6CF'], sizes: ['24oz'], tags: ['bottle'] },
  // ----- Home
  { id: 'p024', slug: 'desk-mat-breakfast-world', name: 'Breakfast World Desk Mat', collection: 'morning-spawn', category: 'home', priceCents: 3800, description: '900x400mm gaming desk mat — illustrated breakfast world map.', hero: '/shop/deskmat-breakfastworld.svg', swatches: ['#FFD89C'], sizes: ['900x400'], tags: ['desk','gaming'], badge: 'new' },
  { id: 'p025', slug: 'mouse-pad-egg', name: 'Sunny Egg Mouse Pad', collection: 'egg-drop', category: 'home', priceCents: 1600, description: 'Round mouse pad — single sunny egg.', hero: '/shop/mousepad-egg.svg', swatches: ['#FFD89C'], sizes: ['200mm'], tags: ['mouse','desk'] },
  { id: 'p026', slug: 'cozy-blanket', name: 'Cozy Breakfast Blanket', collection: 'cozy-breakfast-club', category: 'home', priceCents: 6800, description: 'Plush throw blanket — tossed breakfast icons + slogan border.', hero: '/shop/blanket-cozy.svg', swatches: ['#FFD89C','#FF9EC0'], sizes: ['50x60in'], tags: ['blanket','plush'] },
  { id: 'p027', slug: 'pancake-pillow', name: 'Pancake Stack Pillow', collection: 'pancake-power-up', category: 'home', priceCents: 3400, description: 'Round 14" pillow shaped like a pancake stack with butter pat.', hero: '/shop/pillow-pancake.svg', swatches: ['#FFD89C'], sizes: ['14"'], tags: ['pillow','plush'], badge: 'new' },
  { id: 'p028', slug: 'poster-cereal-galaxy', name: 'Cereal Galaxy Poster', collection: 'cereal-chaos', category: 'paper', priceCents: 2200, description: 'Matte 18x24" poster — cereal pieces as planets.', hero: '/shop/poster-cereal-galaxy.svg', swatches: ['#E2D6FF'], sizes: ['18x24'], tags: ['poster','wall-art'] },
  // ----- Paper / journals
  { id: 'p029', slug: 'breakfast-journal', name: 'Breakfast Journal', collection: 'eat-with-emm', category: 'paper', priceCents: 2800, description: '128-page lined journal — soft-touch cover with cap embroidery.', hero: '/shop/journal-breakfast.svg', swatches: ['#FFF8EE'], sizes: ['A5'], tags: ['journal','paper'] },
  { id: 'p030', slug: 'sticker-sheet-squad', name: 'Squad Sticker Sheet', collection: 'breakfast-gamer-essentials', category: 'stickers', priceCents: 800, description: '24 die-cut vinyl stickers featuring all the mascots.', hero: '/shop/stickers-squad.svg', swatches: ['#FFD89C','#A8E6CF','#FF9EC0'], sizes: ['One Sheet'], tags: ['stickers'] },
  // ----- Plush
  { id: 'p031', slug: 'waffle-wendy-plush', name: 'Waffle Wendy Plush', collection: 'waffle-stack', category: 'plush', priceCents: 3200, description: 'Soft 8" waffle plush mascot. Removable butter-pat patch.', hero: '/shop/plush-waffle-wendy.svg', swatches: ['#FFD89C'], sizes: ['8"'], tags: ['plush','mascot'], badge: 'fan-fave' },
  { id: 'p032', slug: 'eggy-plush', name: 'Eggy Plush', collection: 'egg-drop', category: 'plush', priceCents: 3200, description: 'Soft sunny-egg plush with tiny embroidered cape.', hero: '/shop/plush-eggy.svg', swatches: ['#FFD89C','#FFFCF5'], sizes: ['7"'], tags: ['plush','mascot'] },
  // ----- Pins / keychains
  { id: 'p033', slug: 'pin-set-breakfast', name: 'Breakfast Pin Set', collection: 'breakfast-gamer-essentials', category: 'pins', priceCents: 1800, description: 'Five enamel pins: waffle, egg, pancake, toast, cereal.', hero: '/shop/pins-breakfast.svg', swatches: ['#FFD89C'], sizes: ['One Set'], tags: ['pins'] },
  { id: 'p034', slug: 'keychain-bear-charm', name: 'Bear Charm Keychain', collection: 'eat-with-emm', category: 'pins', priceCents: 1200, description: 'Cream resin bear charm — same vibe as the avatar bag charm.', hero: '/shop/keychain-bear.svg', swatches: ['#FFF8EE'], sizes: ['Single'], tags: ['keychain','charm','signature'] },
  // ----- Digital
  { id: 'p035', slug: 'wallpaper-pack', name: 'Phone Wallpaper Pack', collection: 'breakfast-gamer-essentials', category: 'digital', priceCents: 0, description: 'Free — 12 phone wallpapers for the squad.', hero: '/shop/digital-wallpapers.svg', swatches: ['#FFD89C','#A8E6CF','#FF9EC0'], sizes: ['Phone'], tags: ['wallpaper','digital','free'], badge: 'new' },
  { id: 'p036', slug: 'stream-overlay-pack', name: 'Stream Overlay Pack', collection: 'breakfast-gamer-essentials', category: 'digital', priceCents: 1800, description: '"Going live", "Be right back", and intermission overlays.', hero: '/shop/digital-overlays.svg', swatches: ['#A8E6CF'], sizes: ['1080p','4K'], tags: ['overlay','digital','stream'] },
  { id: 'p037', slug: 'printable-breakfast-cards', name: 'Printable Breakfast Cards', collection: 'eat-with-emm', category: 'digital', priceCents: 600, description: '7 printable cards — one per day of the week — for breakfast notes.', hero: '/shop/digital-cards.svg', swatches: ['#FFD89C'], sizes: ['A4','Letter'], tags: ['printable','digital'] },
  { id: 'p038', slug: 'digital-sticker-pack', name: 'Digital Sticker Pack', collection: 'eat-with-emm', category: 'digital', priceCents: 0, description: 'Free — 30 digital stickers for chats, journals, edits.', hero: '/shop/digital-stickers.svg', swatches: ['#FF9EC0'], sizes: ['PNG'], tags: ['sticker','digital','free'] },
  // ----- Drops
  { id: 'p039', slug: 'sage-cardigan-drop', name: 'Sage Cardigan — Limited Drop', collection: 'eat-with-emm', category: 'tees', priceCents: 7400, description: 'The avatar callback cardigan, made real. Limited run.', hero: '/shop/cardigan-sage.svg', swatches: ['#A8E6CF'], sizes: ['XS','S','M','L','XL'], tags: ['drop','signature','avatar'], badge: 'limited', featured: true },
  { id: 'p040', slug: 'bear-charm-purse', name: 'Bear Charm Mini Purse', collection: 'eat-with-emm', category: 'bags', priceCents: 4800, description: 'White mini purse with detachable bear charm — straight from the avatar.', hero: '/shop/purse-bear.svg', swatches: ['#FFFCF5'], sizes: ['Mini'], tags: ['purse','signature','avatar'], badge: 'limited' },

  // ===== v1.2.0 EXPANSION — sweats, joggers, more caps, beanies, hoodie colorways, tees =====
  { id: 'p041', slug: 'mint-breakfast-sweatpants', name: 'Mint Breakfast Sweatpants', collection: 'breakfast-boss', category: 'sweatpants', priceCents: 4800, description: 'Match the mint slogan hoodie. Heavyweight cotton blend, drawstring waist, side pockets.', hero: '/shop/photo-sweatpants-mint-breakfast.svg', swatches: ['#A8E6CF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['sweatpants','mint','set'], badge: 'new', featured: true },
  { id: 'p042', slug: 'pink-waffle-sweatpants',    name: 'Pink Waffle Sweatpants',    collection: 'waffle-stack',  category: 'sweatpants', priceCents: 4800, description: 'Match the pink waffle hoodie. Soft brushed inside, drawstring waist.', hero: '/shop/photo-sweatpants-pink-waffle.svg', swatches: ['#F4B7D6'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['sweatpants','pink','set'], badge: 'new', featured: true },
  { id: 'p043', slug: 'cream-classic-sweatpants',  name: 'Cream Classic Sweatpants',  collection: 'cozy-breakfast-club', category: 'sweatpants', priceCents: 4800, description: 'Quiet-luxe cream sweats. Pairs with literally everything.', hero: '/shop/photo-sweatpants-cream.svg', swatches: ['#F4ECDC'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['sweatpants','cream'] },
  { id: 'p044', slug: 'mint-tapered-joggers',      name: 'Mint Tapered Joggers',      collection: 'morning-spawn', category: 'sweatpants', priceCents: 5200, description: 'Tapered fit with ribbed ankle cuffs. Stream-room ready.', hero: '/shop/photo-joggers-mint-tapered.svg', swatches: ['#A8E6CF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['joggers','tapered','mint'], badge: 'new' },
  { id: 'p045', slug: 'pink-tapered-joggers',      name: 'Pink Tapered Joggers',      collection: 'waffle-stack',  category: 'sweatpants', priceCents: 5200, description: 'Tapered pink joggers with ribbed cuffs.', hero: '/shop/photo-joggers-pink-tapered.svg', swatches: ['#F4B7D6'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['joggers','tapered','pink'] },
  { id: 'p046', slug: 'cocoa-tapered-joggers',     name: 'Cocoa Tapered Joggers',     collection: 'morning-spawn', category: 'sweatpants', priceCents: 5200, description: 'Deep cocoa brown joggers — lounge-soft.', hero: '/shop/photo-joggers-cocoa-tapered.svg', swatches: ['#3B2A22'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['joggers','tapered','cocoa'] },
  { id: 'p047', slug: 'mint-breakfast-cap',        name: 'Mint Breakfast Dad Cap',    collection: 'breakfast-boss', category: 'hats', priceCents: 3200, description: 'Soft mint dad cap, embroidered "BREAKFAST" front.', hero: '/shop/photo-cap-mint-breakfast.svg', swatches: ['#A8E6CF'], sizes: ['One Size'], tags: ['cap','dad-hat','mint'], badge: 'new' },
  { id: 'p048', slug: 'pink-waffle-cap',           name: 'Pink Waffle Dad Cap',       collection: 'waffle-stack',  category: 'hats', priceCents: 3200, description: 'Soft pink dad cap, embroidered "WAFFLE" front.', hero: '/shop/photo-cap-pink-waffle.svg', swatches: ['#F4B7D6'], sizes: ['One Size'], tags: ['cap','dad-hat','pink'], badge: 'new' },
  { id: 'p049', slug: 'cream-emg-cap',             name: 'Cream EMG Cap',             collection: 'eat-with-emm',  category: 'hats', priceCents: 3200, description: 'Cream cap with cocoa "EMG" embroidery.', hero: '/shop/photo-cap-cream-emg.svg', swatches: ['#F4ECDC'], sizes: ['One Size'], tags: ['cap','dad-hat','cream'] },
  { id: 'p050', slug: 'pink-emg-beanie',           name: 'Pink EMG Beanie',           collection: 'cozy-breakfast-club', category: 'hats', priceCents: 2400, description: 'Knit beanie with pom and cream tab.', hero: '/shop/beanie-pink.svg', swatches: ['#F4B7D6'], sizes: ['One Size'], tags: ['beanie','pink'] },
  { id: 'p051', slug: 'cocoa-731-beanie',          name: 'Cocoa 731 Beanie',          collection: 'cozy-breakfast-club', category: 'hats', priceCents: 2400, description: 'Cocoa knit beanie with mint "731" tab.', hero: '/shop/beanie-cocoa.svg', swatches: ['#3B2A22'], sizes: ['One Size'], tags: ['beanie','cocoa'] },
  { id: 'p052', slug: 'mint-breakfast-socks',      name: 'Mint Breakfast Socks',      collection: 'breakfast-boss', category: 'socks', priceCents: 1400, description: 'Crew-length mint socks — EMG731 stripe band.', hero: '/shop/socks-mint-breakfast.svg', swatches: ['#A8E6CF'], sizes: ['One Size'], tags: ['socks','mint'] },
  { id: 'p053', slug: 'pink-waffle-socks',         name: 'Pink Waffle Socks',         collection: 'waffle-stack',  category: 'socks', priceCents: 1400, description: 'Crew-length pink socks — waffle motif.', hero: '/shop/socks-pink-waffle.svg', swatches: ['#F4B7D6'], sizes: ['One Size'], tags: ['socks','pink','waffle'] },
  { id: 'p054', slug: 'syrup-amber-tee',           name: 'Syrup Amber Tee',           collection: 'syrup-drip',    category: 'tees', priceCents: 3200, description: 'Honey-amber tee — "POUR IT ON." headline.', hero: '/shop/tee-syrup-amber.svg', swatches: ['#E8A53C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','syrup'] },
  { id: 'p055', slug: 'butter-pancake-tee',        name: 'Butter Pancake Tee',        collection: 'pancake-power-up', category: 'tees', priceCents: 3200, description: 'Butter yellow tee with full pancake stack print.', hero: '/shop/tee-yellow-pancake.svg', swatches: ['#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','pancake'] },
  { id: 'p056', slug: 'pink-waffle-tee',           name: 'Pink Waffle Tee',           collection: 'waffle-stack',  category: 'tees', priceCents: 3200, description: 'Soft pink tee — same waffle stack as the hoodie.', hero: '/shop/tee-pink-waffle.svg', swatches: ['#F4B7D6'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['tee','pink','waffle'] },
  { id: 'p057', slug: 'cream-emg-classic-hoodie',  name: 'Cream EMG Classic Hoodie',  collection: 'eat-with-emm',  category: 'hoodies', priceCents: 5800, description: 'Cream hoodie with the EMG731 logo badge — quiet flex.', hero: '/shop/photo-hoodie-cream-classic.svg', swatches: ['#F4ECDC'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','cream','classic'] },
  { id: 'p058', slug: 'lavender-cereal-hoodie',    name: 'Lavender Cereal Hoodie',    collection: 'cereal-chaos',  category: 'hoodies', priceCents: 5800, description: 'Lavender hoodie — Cereal Chaos colorway.', hero: '/shop/photo-hoodie-lavender-cereal.svg', swatches: ['#E2D6FF'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','lavender'] },
  { id: 'p059', slug: 'butter-pancake-hoodie',     name: 'Butter Pancake Hoodie',     collection: 'pancake-power-up', category: 'hoodies', priceCents: 5800, description: 'Butter yellow pullover with pancake stack graphic.', hero: '/shop/photo-hoodie-butter-pancake.svg', swatches: ['#FFD89C'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','pancake'] },
  { id: 'p060', slug: 'black-emg-hoodie',          name: 'Black EMG731 Hoodie',       collection: 'eat-with-emm',  category: 'hoodies', priceCents: 6200, description: 'Black hoodie with the cap-callback EMG731 wordmark in cream + amber.', hero: '/shop/photo-hoodie-black-cap.svg', swatches: ['#1F1611'], sizes: ['XS','S','M','L','XL','2XL'], tags: ['hoodie','black','signature'], badge: 'new' },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);
