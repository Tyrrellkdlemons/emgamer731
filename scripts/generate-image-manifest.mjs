// Generates content/images/master-image-manifest.json with 120+ image prompts.
// Run: node scripts/generate-image-manifest.mjs
//
// Each entry is structured for downstream image-generation pipelines (Midjourney, SDXL,
// DALL·E, Imagen) AND for manual hand-illustration. Style notes apply to all.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'content', 'images');

const STYLE_GLOBAL =
  'Cute glossy stylized illustration, blocky-playful Roblox-creator energy reinterpreted as polished modern illustration. Soft pastel breakfast palette (mint #A8E6CF, berry pink #FF9EC0, butter pancake #FFD89C, syrup amber #E8A53C, cream #FFF8EE, soft sky #BDE3FF, lavender #E2D6FF, cocoa text #3B2A22). Soft drop shadows, subtle film grain, premium creator-merch energy. AVOID: copying any first-party Roblox key art, photorealism, gritty textures, dark moody palettes, sexualized styling. Always child-friendly.';

const AVATAR =
  'Anchor avatar: feminine Roblox-style character with long wavy brown hair below a forward black baseball cap, soft glam expression, sage off-shoulder cardigan over white inner top, distressed light-blue jeans, brown/white shoes, white mini purse with a small bear charm. Keep cap, hair, and bear-charm purse as recognition anchors.';

const STYLE_BLOCKY = 'Stylized blocky-cute Roblox-inspired silhouette but softened with rounded corners and gloss highlights — never an exact replica of Roblox first-party assets.';

const collections = {
  hero: 'breakfast-boss',
  avatar: 'eat-with-emm',
  breakfast: 'cozy-breakfast-club',
  merch: 'breakfast-gamer-essentials',
  wallpaper: 'breakfast-gamer-essentials',
  sticker: 'breakfast-gamer-essentials',
  overlay: 'morning-spawn',
  social: 'breakfast-boss',
  mockup: 'breakfast-gamer-essentials',
  seasonal: 'cozy-breakfast-club',
  icon: 'breakfast-gamer-essentials',
  badge: 'breakfast-gamer-essentials',
};

const ratios = {
  wide: '16:9',
  hero: '21:9',
  square: '1:1',
  portrait: '4:5',
  story: '9:16',
  ogcard: '1200x630',
  banner: '3:1',
};

let counter = 1;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const id = () => `emg-${String(counter++).padStart(3, '0')}`;

function entry({
  title, category, collection, aspect, use, prompt, alt, tags, styleNotes,
}) {
  const ident = id();
  const fname = `emgamer731-${category}-${slug(title)}-${ident.split('-')[1]}.png`;
  return {
    id: ident,
    filename: fname,
    title,
    category,
    collection: collection ?? collections[category] ?? 'breakfast-boss',
    aspectRatio: ratios[aspect] ?? aspect,
    use,
    styleNotes: [STYLE_GLOBAL, AVATAR, styleNotes].filter(Boolean).join(' '),
    prompt,
    altText: alt,
    tags,
  };
}

const manifest = { version: '1.0.0', generatedAt: new Date().toISOString(), entries: [] };
const push = (e) => manifest.entries.push(e);

// 1. HERO BANNERS (12)
const heroes = [
  ['Breakfast Castle Hero',     'wide', 'Home page hero — wide banner', 'Avatar standing in front of a castle made of stacked waffles and pancakes, syrup waterfalls, mint sky with cereal-piece stars.', 'Avatar in front of a waffle-and-pancake castle with a mint sky.'],
  ['Cozy Stream Room Hero',     'wide', 'Home variant — stream-day vibe', 'Avatar at a streaming desk in a cozy bedroom set, mint walls, neon "ON AIR" sign, breakfast plate beside the keyboard.', 'Avatar at a stream desk with a breakfast plate and ON AIR sign.'],
  ['Cereal Galaxy Hero',        'hero', 'Seasonal/featured hero — galaxy theme', 'Avatar floating inside a cup-saucer ship through a galaxy of cereal pieces and milk-cloud nebulae, lavender skyscape.', 'Avatar in a saucer ship through a galaxy of cereal pieces.'],
  ['Pancake Tower Hero',        'wide', 'Drop campaign hero — power-up theme', 'Avatar climbing a giant pancake tower like a video-game level, butter pat clouds, syrup drips on the side.', 'Avatar climbing a giant pancake tower with butter-pat clouds.'],
  ['Egg Cloud Hero',            'wide', 'Calm/soft hero variant', 'Avatar lying on an egg-shaped cloud at sunrise, sky soft pink-mint gradient, sun is a sunny-side-up egg.', 'Avatar on an egg-shaped cloud at sunrise; sun is a sunny egg.'],
  ['Toast Party Hero',          'wide', 'Community event hero', 'Avatar on a stage made of toast slices, butter spotlights, jam confetti raining down, mascots in the crowd.', 'Avatar on a toast-slice stage with butter spotlights and jam confetti.'],
  ['Syrup Slide Hero',          'wide', 'Action/play hero', 'Avatar sliding down a glossy syrup waterslide that empties into a strawberry bowl pool.', 'Avatar sliding down a syrup waterslide into a strawberry pool.'],
  ['Breakfast City Hero',       'hero', 'Universe/about hero', 'Stylized aerial of "Breakfast City" — buildings shaped like cereal boxes, milk towers, waffle plazas, the avatar walking the main street.', 'Aerial of Breakfast City with cereal-box buildings and milk towers.'],
  ['Waffle Kingdom Hero',       'wide', 'Fantasy hero variant', 'Avatar as the queen of a waffle kingdom — throne of stacked waffles, syrup banners, butter-pat orb in hand.', 'Avatar on a waffle throne with syrup banners.'],
  ['School Morning Hero',       'wide', 'Back-to-school seasonal', 'Avatar at a kitchen counter packing a lunch bag, school backpack ready, breakfast bagel on a plate.', 'Avatar packing a lunch bag with breakfast bagel on counter.'],
  ['Weekend Breakfast Hero',    'wide', 'Saturday vibe hero', 'Avatar still in cardigan + pajama pants, oversized cereal bowl on lap, controller on couch arm, soft morning light.', 'Avatar in cozy weekend mode with oversized cereal bowl.'],
  ['Holiday Breakfast Hero',    'wide', 'Holiday seasonal hero', 'Avatar in a holiday cardigan colorway (cranberry + cream), pancake stack with whipped-cream snowman on top.', 'Avatar in holiday colorway with snowman pancake stack.'],
];
heroes.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'hero', aspect, use, prompt, alt,
  tags: ['hero', 'banner', slug(title)],
  styleNotes: 'Wide-format hero composition; subject offset to right-of-center; ample left-side breathing room for slogan overlay. ' + STYLE_BLOCKY,
})));

// 2. WEBSITE SECTION ART (10)
const sections = [
  ['Section Divider — Mint Wave',   'wide', 'Section divider on mint sections', 'Cute mint wave pattern with floating waffle and egg motifs, soft cream highlights.', 'Mint wave pattern with floating breakfast motifs.'],
  ['Section Divider — Berry Toast', 'wide', 'Pink section divider', 'Berry-pink wave with toast-soldier silhouettes, soft sparkle dots.', 'Pink wave divider with toast-soldier shapes.'],
  ['Empty State Cereal Bowl',       'square', 'Empty state for filtered gallery', 'Lonely cereal bowl with single floating spoon, captioned "still cooking" — minimal composition on cream bg.', 'Cereal bowl on cream background — empty state visual.'],
  ['Loading State Pancake Stack',   'square', 'Skeleton loading visual', 'Animated-ready pancake stack with shimmer highlights, alternating mint and butter pats.', 'Pancake stack ready for shimmer animation.'],
  ['404 Page Sleeping Toast',       'square', 'Not-found page art', 'Toast slice tucked under a tiny duvet, sleep-mask on, "zzz" steam rising from a coffee cup beside it.', 'Toast slice under a duvet with coffee cup — 404 art.'],
  ['Coming Soon Sign',              'square', 'Placeholder for upcoming content', 'Cream-board sign held by Eggy mascot reading "Coming Soon — pull up a chair".', 'Eggy mascot holding a Coming Soon sign.'],
  ['Subscribe Reminder',            'wide', 'Subscribe banner with avatar', 'Avatar holding a tiny bell, mint background, sparkle confetti.', 'Avatar holding a bell with mint background.'],
  ['Stream Countdown Card',         'square', 'Countdown widget art', 'Clock made of waffle texture with butter-pat hands, mint border.', 'Clock with waffle texture and butter-pat hands.'],
  ['Newsletter Free Zone',          'wide', 'Decorative banner: "no email needed"', 'Mailbox crossed-out with a friendly "we don\'t want your inbox" caption, cream + mint.', 'Crossed-out mailbox illustration in cream and mint.'],
  ['Footer Decorative Strip',       'banner', 'Site footer decorative strip', 'Repeating breakfast icons in a horizontal ribbon: waffle, egg, pancake, toast, cereal, fruit.', 'Repeating breakfast icon ribbon for footer.'],
];
sections.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['section', 'ui', slug(title)],
  styleNotes: 'Decorative — should not compete with text overlay; muted contrast.',
})));

// 3. AVATAR PORTRAITS (12)
const avatars = [
  ['Avatar Sage Cardigan Portrait',     'portrait', 'Master avatar reference', 'Avatar in standard outfit, three-quarter pose, soft mint backdrop with halo of sparkles.', 'Avatar portrait in sage cardigan with mint halo.'],
  ['Avatar Pancake Plate Portrait',     'square',   'Avatar holding pancake plate', 'Avatar smiling, holding a stack of pancakes on a plate, cream background.', 'Avatar holding a pancake plate.'],
  ['Avatar Cereal Bowl Portrait',       'portrait', 'Avatar with cereal bowl', 'Avatar sitting cross-legged with a giant cereal bowl in lap, soft pink backdrop.', 'Avatar holding a giant cereal bowl.'],
  ['Avatar Waffle Plate Portrait',      'square',   'Avatar with waffle plate', 'Avatar holding a single waffle on a fork, butter pat melting, mint backdrop.', 'Avatar holding a waffle on a fork.'],
  ['Avatar Wave Portrait',              'portrait', 'Greeting / hero wave', 'Avatar waving hello, walk-in pose, butter sun behind her.', 'Avatar waving hello with butter-yellow sun.'],
  ['Avatar Squad Pose Portrait',        'square',   'Squad selfie', 'Avatar making a peace-sign with three mascots peeking from behind her.', 'Avatar with peace-sign and mascots peeking.'],
  ['Avatar Stream Setup Portrait',      'portrait', 'Avatar at gaming desk', 'Avatar sitting at a streaming desk with controller, breakfast plate to one side, mic in front.', 'Avatar at streaming desk with controller.'],
  ['Avatar Backpack Pose Portrait',     'portrait', 'School/back-to-school avatar', 'Avatar with the breakfast backpack on, ready to walk to school.', 'Avatar with breakfast backpack ready for school.'],
  ['Avatar Holiday Outfit Portrait',    'portrait', 'Holiday colorway', 'Avatar in a cranberry cardigan colorway with a snowman pancake plate.', 'Avatar in holiday cranberry outfit with snowman pancake.'],
  ['Avatar Summer Visor Portrait',      'portrait', 'Summer colorway', 'Avatar swapping the cap for a sun visor, fruit plate in hand.', 'Avatar in sun visor with fruit plate.'],
  ['Avatar Cozy Crewneck Portrait',     'portrait', 'Cozy/quiet luxe', 'Avatar in cream crewneck reading a book, soft afternoon light.', 'Avatar reading in cream crewneck.'],
  ['Avatar Surprise Drop Portrait',     'square',   'Drop announcement art', 'Avatar gasping with hands on cheeks, confetti of breakfast icons exploding behind.', 'Avatar gasping with breakfast-icon confetti.'],
];
avatars.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'avatar', aspect, use, prompt, alt,
  tags: ['avatar', 'character', slug(title)],
  styleNotes: 'Avatar identity must be locked — same hair, cap, cardigan, jeans, bear-charm purse. ' + STYLE_BLOCKY,
})));

// 4. BREAKFAST + AVATAR MASHUPS (10)
const mashups = [
  ['Avatar Inside Waffle World',      'wide', 'Surreal mashup hero', 'Avatar standing inside a waffle grid as if it were a chess board, syrup pools as squares.', 'Avatar standing inside a waffle grid like a chess board.'],
  ['Avatar Surfing Pancake Stack',    'wide', 'Action mashup', 'Avatar surfing down a sloped pancake stack on a butter-pat board.', 'Avatar surfing down a pancake stack.'],
  ['Avatar Egg Hot Air Balloon',      'portrait', 'Whimsy mashup', 'Avatar floating in a hot air balloon shaped like a sunny-side egg.', 'Avatar in an egg-shaped hot air balloon.'],
  ['Avatar Cereal Galaxy Pilot',      'wide', 'Adventure mashup', 'Avatar piloting a cereal-bowl spaceship through space.', 'Avatar piloting a cereal-bowl spaceship.'],
  ['Avatar Toast Throne',             'square', 'Fantasy mashup', 'Avatar on a throne made of toast slices, jam crown.', 'Avatar on a toast throne with a jam crown.'],
  ['Avatar Strawberry Skydive',       'portrait', 'Action mashup', 'Avatar parachuting with a strawberry-shaped parachute, fruit raining around her.', 'Avatar parachuting with strawberry parachute.'],
  ['Avatar Bacon Bridge Walk',        'wide', 'Path mashup', 'Avatar walking across a bridge made of bacon strips toward a waffle island.', 'Avatar walking a bacon-strip bridge to a waffle island.'],
  ['Avatar Pancake Pool Float',       'square', 'Chill mashup', 'Avatar lounging on a pancake pool float in syrup-water.', 'Avatar on a pancake pool float in syrup water.'],
  ['Avatar Breakfast Bouquet',        'portrait', 'Romantic mashup', 'Avatar holding a bouquet of waffles, eggs, and strawberries.', 'Avatar holding a breakfast-icon bouquet.'],
  ['Avatar Cereal Rain',              'portrait', 'Weather mashup', 'Avatar holding a butter-pat umbrella while cereal pieces rain down on a mint sidewalk.', 'Avatar with butter-pat umbrella in cereal rain.'],
];
mashups.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'breakfast', aspect, use, prompt, alt,
  tags: ['mashup', 'breakfast', 'avatar', slug(title)],
  styleNotes: 'Surreal but cute. Maintain avatar identity. Background should suggest a "Breakfast World".',
})));

// 5. CUTE PROMOTIONAL POSTERS (10)
const posters = [
  ['Poster — Breakfast Boss',         'portrait', 'Collection promo poster', 'Avatar in mint hoodie center frame, slogan above, BREAKFAST BOSS title below.', 'Promo poster for Breakfast Boss collection.'],
  ['Poster — Waffle Stack Drop',      'portrait', 'Drop announcement poster', 'Pink hoodie front and center, "WAFFLE STACK DROP — limited" headline, waffle stack illustration.', 'Drop poster for the Waffle Stack collection.'],
  ['Poster — Egg Drop',               'portrait', 'Sunny egg poster', 'Sunny egg burst in center, "SUNNY-SIDE EVERYTHING" headline.', 'Sunny egg poster with bold headline.'],
  ['Poster — Pancake Power-Up',       'portrait', 'Power-up themed poster', 'Pancake stack illustration with arcade-style "POWER UP" letters.', 'Pancake Power-Up poster with arcade lettering.'],
  ['Poster — Cereal Chaos',           'portrait', 'Chaos theme poster', 'Cereal pieces and milk splashes radiating outward, bold "CEREAL CHAOS" lettering.', 'Cereal chaos poster with bold lettering.'],
  ['Poster — Morning Spawn',          'portrait', 'Gamer essentials poster', 'Pixel-style "SPAWN POINT" sign over a desk illustration with mint chair.', 'Morning Spawn gamer-essentials poster.'],
  ['Poster — Syrup Drip',             'portrait', 'Premium drip poster', 'Glossy honey-amber drip running down poster, "SYRUP DRIP" headline.', 'Glossy syrup drip premium poster.'],
  ['Poster — Cozy Breakfast Club',    'portrait', 'Cozy collection poster', 'Avatar in cream crewneck with mug, "COZY BREAKFAST CLUB" headline.', 'Cozy Breakfast Club poster with warm tones.'],
  ['Poster — Eat With EMM',           'portrait', 'Signature drop poster', 'Avatar with bear-charm purse front and center, signature "EAT WITH EMM".', 'Eat With EMM signature drop poster.'],
  ['Poster — Squad Goals',            'portrait', 'Community/squad poster', 'Avatar + 4 mascots posed together, "SQUAD GOALS" headline.', 'Squad goals group poster.'],
];
posters.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'social', aspect, use, prompt, alt,
  tags: ['poster', 'promo', slug(title)],
  styleNotes: 'Bold, readable typography area at top OR bottom — leave room. Avoid clutter.',
})));

// 6. SOCIAL MEDIA POSTS (12)
const socials = [
  ['Social — Slogan Tile Mint',       'square', 'Instagram/TikTok slogan tile', 'Slogan typeset in Fraunces 800 on mint background, single waffle in corner.', 'Slogan tile on mint with waffle accent.'],
  ['Social — Slogan Tile Pink',       'square', 'Pink slogan tile variant', 'Slogan typeset on berry pink with waffle stack accent.', 'Slogan tile on berry pink.'],
  ['Social — Quote Card Cocoa',       'square', 'Quote card with cocoa text', 'Cream background with single quote: "Eat well. Game better." in serif.', 'Quote card on cream background.'],
  ['Social — TikTok Cover Vertical',  'story', 'TikTok video cover', 'Vertical 9:16 with avatar centered, slogan at top.', 'TikTok cover with avatar and slogan.'],
  ['Social — Stream Promo Story',     'story', 'Story stream announcement', 'Vertical with "Stream tonight 9:30PM" callout, mint base.', 'Story announcing tonight\'s stream.'],
  ['Social — New Drop Story',         'story', 'Drop announcement story', 'Vertical hoodie reveal with "NEW DROP" header.', 'Story announcing a new merch drop.'],
  ['Social — Milestone Tile',         'square', 'Milestone celebration tile', 'Confetti of breakfast icons, "thanks 10K squad" caption.', 'Milestone tile with confetti.'],
  ['Social — Behind Scenes Tile',     'square', 'BTS content tile', 'Avatar at desk with "BTS" overlay corner.', 'Behind-the-scenes tile with avatar at desk.'],
  ['Social — Today\'s Plate Tile',    'square', 'Daily breakfast post', 'Big plate front and center, "today\'s plate" caption.', 'Today\'s plate daily post tile.'],
  ['Social — Schedule Card',          'square', 'Weekly schedule post', 'Calendar visual with stream times, mint accents.', 'Weekly schedule social card.'],
  ['Social — Squad Shoutout',         'square', 'Fan shoutout tile', 'Avatar pointing to a heart, "SQUAD LOVE" caption.', 'Squad shoutout tile with avatar.'],
  ['Social — Pinned Bio Tile',        'square', 'Top-of-bio pinned tile', 'Avatar portrait with "@eatsswithemm" handle and 3 quick links.', 'Pinned bio tile for socials.'],
];
socials.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'social', aspect, use, prompt, alt,
  tags: ['social', 'tile', slug(title)],
  styleNotes: 'Optimized for small-screen social previews. High-contrast text area required.',
})));

// 7. MERCH MOCKUPS (12)
const merchM = [
  ['Mockup Mint Hoodie Front',        'square', 'Hero mockup of mint slogan hoodie', 'Mint pullover hoodie flat-lay with slogan + egg trio graphic, soft shadow.', 'Mint slogan hoodie front flat-lay mockup.'],
  ['Mockup Mint Hoodie Lifestyle',    'portrait', 'Lifestyle shot of mint hoodie', 'Avatar wearing mint hoodie outdoors with breakfast bag in hand.', 'Avatar wearing mint hoodie outdoors lifestyle.'],
  ['Mockup Pink Waffle Hoodie Front', 'square', 'Hero mockup of pink waffle hoodie', 'Pink pullover hoodie flat-lay with waffle stack graphic.', 'Pink waffle hoodie front flat-lay mockup.'],
  ['Mockup Pink Hoodie Lifestyle',    'portrait', 'Lifestyle shot of pink hoodie', 'Avatar in pink hoodie at a kitchen counter with waffle plate.', 'Avatar wearing pink hoodie at kitchen counter.'],
  ['Mockup Cap EMG731 Front',         'square', 'Black cap mockup', 'Black 6-panel cap with white EMG731 embroidery — front view on cream background.', 'Black EMG731 cap mockup front view.'],
  ['Mockup Beanie Mint',              'square', 'Mint beanie mockup', 'Mint cuffed beanie flat-lay on cream surface.', 'Mint beanie cuffed mockup.'],
  ['Mockup Tote Waffle',              'square', 'Cotton tote mockup', 'Cream cotton tote with single waffle print, hanging from a hook.', 'Cream tote with waffle print mockup.'],
  ['Mockup Tumbler Syrup',            'square', 'Tumbler mockup with drip', 'Honey-amber tumbler with drip texture, condensation drops.', 'Honey-amber syrup-drip tumbler mockup.'],
  ['Mockup Mug Morning',              'square', 'Slogan mug mockup', 'Cream stoneware mug with slogan wrap, on a saucer with toast.', 'Cream slogan mug with toast saucer mockup.'],
  ['Mockup Sticker Sheet',            'square', 'Sticker sheet mockup', 'Vinyl sticker sheet of mascots, waffle, egg, pancake on cream backer.', 'Vinyl sticker sheet mockup with mascots.'],
  ['Mockup Backpack Breakfast',       'portrait', 'Backpack mockup', 'Mint backpack with tossed breakfast icon print, leaning against a chair.', 'Mint breakfast backpack leaning on chair.'],
  ['Mockup Pajama Set Flatlay',       'square', 'Pajama set flat-lay mockup', 'Long-sleeve pajama set with breakfast icon print, neatly folded on cream sheet.', 'Pajama set flat-lay with icon print.'],
];
merchM.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'merch', aspect, use, prompt, alt,
  tags: ['mockup', 'merch', slug(title)],
  styleNotes: 'Studio-style flat-lay or lifestyle, soft shadow under garment, clean cream background.',
})));

// 8. STICKER SHEET DESIGNS (8)
const stickers = [
  ['Sticker Waffle Wendy',     'square', 'Mascot sticker', 'Waffle character with arms, butter-pat patch, googly cute eyes, 6px outline.', 'Waffle mascot sticker.'],
  ['Sticker Eggy',             'square', 'Egg mascot sticker', 'Sunny-side egg mascot with tiny embroidered cape, 6px outline.', 'Sunny egg mascot sticker.'],
  ['Sticker Stack-y',          'square', 'Pancake stack mascot', 'Three pancakes stacked, wearing a tiny black cap, 6px outline.', 'Pancake stack mascot in tiny black cap.'],
  ['Sticker Cereal Scout',     'square', 'Cereal mascot sticker', 'Cereal bowl with periscope-spoon and tiny radar, 6px outline.', 'Cereal scout mascot with periscope spoon.'],
  ['Sticker Slogan Banner',    'wide',   'Slogan ribbon sticker', 'Cream ribbon with mint outline carrying the full slogan.', 'Slogan ribbon sticker for fan use.'],
  ['Sticker EMG731 Tab',       'square', 'Wordmark tab sticker', 'EMG731 wordmark sticker in black-cream colorway.', 'EMG731 wordmark tab sticker.'],
  ['Sticker Squad Badge',      'square', 'Squad hex badge sticker', 'Hex badge with EMG inside, golden outer stroke.', 'Squad hex badge sticker.'],
  ['Sticker Holiday Snowflake','square', 'Seasonal sticker', 'Snowflake made of waffle pieces.', 'Holiday waffle-snowflake sticker.'],
];
stickers.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'sticker', aspect, use, prompt, alt,
  tags: ['sticker', slug(title)],
  styleNotes: 'Cream-stroke 6px outline; should read on white, black, or pastel backgrounds equally.',
})));

// 9. STREAM OVERLAYS (6)
const overlays = [
  ['Overlay Going Live 1080p',     'wide', '"Going live" intro overlay', 'Full-screen "GOING LIVE — pull up a chair" with avatar peeking from corner, mint base.', 'Going-live full-screen overlay 1080p.'],
  ['Overlay Be Right Back 1080p',  'wide', '"BRB" interstitial overlay', '"BACK IN A SEC — eating waffles" full-screen with avatar at desk.', 'Be-right-back full-screen overlay.'],
  ['Overlay Stream End 1080p',     'wide', '"Thanks for hanging" outro overlay', '"THANKS FOR HANGING" with avatar wave and squad mascots in corner.', 'Stream end overlay with avatar wave.'],
  ['Overlay Webcam Frame',         'square', 'Webcam border overlay', 'Decorative cream-mint webcam border with EMG731 wordmark tab.', 'Webcam border overlay frame.'],
  ['Overlay Donation Alert',       'wide', 'Sub/donation alert', 'Animated-ready alert with confetti waffles and "+1 squad member" text.', 'Donation/sub alert with waffle confetti.'],
  ['Overlay Top Bar',              'banner', 'Top bar with slogan ticker', 'Slim top bar with slogan ticker and live time.', 'Top bar overlay with slogan ticker.'],
];
overlays.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'overlay', aspect, use, prompt, alt,
  tags: ['overlay', 'stream', slug(title)],
  styleNotes: 'Reserve safe area for streamer-supplied text. 1080p safe-area, 4K safe-area variants.',
})));

// 10. LOADING / SPLASH SCREENS (6)
const loaders = [
  ['Splash Mint Sunrise',         'square', 'App-style splash for mobile launch', 'Mint sunrise gradient with waffle sun centered.', 'Mint sunrise splash with waffle sun.'],
  ['Splash Pink Pancake',         'square', 'Pink splash variant', 'Pink gradient with pancake stack icon centered.', 'Pink pancake splash.'],
  ['Loader Waffle Spinner',       'square', 'Waffle-grid spinner', 'Waffle grid that spins in animation; static frame here.', 'Waffle-grid loader frame.'],
  ['Loader Egg Crack',            'square', 'Egg-crack progress visual', 'Egg cracking open in three frames sequence.', 'Egg-crack loader frame.'],
  ['Loader Pancake Flip',         'square', 'Pancake flip progress', 'Pancake mid-flip with shadow underneath.', 'Pancake flip loader frame.'],
  ['Splash Cocoa Sunset',         'square', 'Dark mode splash', 'Midnight cocoa gradient with golden EMG mark.', 'Dark mode cocoa splash.'],
];
loaders.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['splash', 'loader', slug(title)],
  styleNotes: 'Single-frame; consider an animated counterpart in motion guidelines.',
})));

// 11. BACKGROUND PATTERNS (6)
const patterns = [
  ['Pattern Waffle Tile',          'square', 'Repeatable waffle tile background', 'Seamless tile of waffle squares in butter color on cream base.', 'Repeating waffle tile pattern.'],
  ['Pattern Egg Polka',            'square', 'Egg polka dot background', 'Seamless tile of small sunny eggs polka-dot style.', 'Egg polka-dot seamless pattern.'],
  ['Pattern Pancake Toss',         'square', 'Tossed pancake icons pattern', 'Seamless tile with tossed pancake icons in mint.', 'Pancake-toss seamless tile.'],
  ['Pattern Cereal Star',          'square', 'Cereal-piece scattered pattern', 'Seamless tile of cereal pieces as stars on lavender.', 'Cereal-piece star pattern.'],
  ['Pattern Strawberry Field',     'square', 'Strawberry pattern', 'Seamless tile of strawberries in berry pink.', 'Strawberry seamless pattern.'],
  ['Pattern Squad Mascots',        'square', 'Mascot scatter pattern', 'Seamless tile mixing all four mascot icons.', 'Mascot scatter seamless pattern.'],
];
patterns.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['pattern', 'background', slug(title)],
  styleNotes: 'Seamless tileability; minimum 600×600 PNG with transparent fallback.',
})));

// 12. SEASONAL VARIANTS (8)
const seasonal = [
  ['Seasonal Holiday Wreath',       'square', 'Holiday landing visual', 'Wreath made of breakfast icons (bacon, waffle, strawberry, holly).', 'Breakfast-icon holiday wreath.'],
  ['Seasonal Valentine\'s Plate',   'square', 'Valentine\'s seasonal art', 'Heart-shaped pancakes with strawberry hearts and a tiny cap on top.', 'Heart pancakes with strawberry hearts.'],
  ['Seasonal Spring Bunny Toast',   'square', 'Spring/Easter art', 'Toast cut into bunny shape with strawberry-jam ears.', 'Bunny-shaped toast for spring.'],
  ['Seasonal Summer Cereal Pop',    'square', 'Summer popsicle art', 'Cereal-coated popsicle on a beach towel of breakfast pattern.', 'Cereal popsicle on patterned towel.'],
  ['Seasonal Back-to-School',       'square', 'School season art', 'Avatar by lockers with breakfast bag.', 'Avatar at school lockers with breakfast bag.'],
  ['Seasonal Halloween Pumpkin',    'square', 'Halloween waffle pumpkin', 'Waffle carved as a pumpkin with friendly face.', 'Waffle carved pumpkin Halloween art.'],
  ['Seasonal Thanksgiving Plate',   'square', 'Thanksgiving art', 'Stack of pancakes with turkey-shape whipped cream.', 'Thanksgiving pancake stack art.'],
  ['Seasonal New Year Sparkler',    'square', 'New Year art', 'Pancake stack with sparkler candle and "10K SQUAD" banner.', 'New Year pancake stack with sparkler.'],
];
seasonal.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'seasonal', aspect, use, prompt, alt,
  tags: ['seasonal', slug(title)],
  styleNotes: 'Match season with appropriate palette accent; remain on-brand.',
})));

// 13. WALLPAPERS (12)
const wallpapers = [
  ['Wallpaper Mint Morning Phone',    'story', 'Phone wallpaper — mint vibe', 'Vertical mint gradient with floating waffle and avatar silhouette small at bottom.', 'Mint phone wallpaper with waffle and avatar.'],
  ['Wallpaper Pink Waffle Phone',     'story', 'Phone wallpaper — pink waffle', 'Vertical pink gradient with waffle stack centered.', 'Pink phone wallpaper with waffle stack.'],
  ['Wallpaper Cereal Galaxy Phone',   'story', 'Phone wallpaper — galaxy', 'Lavender galaxy with cereal-piece stars.', 'Cereal galaxy phone wallpaper.'],
  ['Wallpaper Pancake Tower Phone',   'story', 'Phone wallpaper — pancake tower', 'Pancake tower from below, butter sky.', 'Pancake tower phone wallpaper.'],
  ['Wallpaper Squad Phone',           'story', 'Phone wallpaper — squad', 'Avatar + 4 mascots posed for phone wallpaper.', 'Squad phone wallpaper.'],
  ['Wallpaper Egg Cloud Phone',       'story', 'Phone wallpaper — egg cloud', 'Avatar lying on egg cloud at sunrise.', 'Egg-cloud phone wallpaper.'],
  ['Wallpaper Mint Morning Desktop',  'wide',  'Desktop wallpaper — mint', '4K wide mint gradient with floating waffle and pancake.', 'Mint desktop wallpaper 4K.'],
  ['Wallpaper Berry Toast Desktop',   'wide',  'Desktop wallpaper — berry', '4K wide berry gradient with toast soldiers.', 'Berry toast desktop wallpaper.'],
  ['Wallpaper Cereal Galaxy Desktop', 'wide',  'Desktop wallpaper — galaxy', '4K wide cereal galaxy.', 'Cereal galaxy desktop wallpaper 4K.'],
  ['Wallpaper Pancake Power Desktop', 'wide',  'Desktop wallpaper — pancake', '4K wide pancake power-up scene.', 'Pancake power-up desktop wallpaper 4K.'],
  ['Wallpaper Avatar Portrait Phone', 'story', 'Phone wallpaper — avatar focus', 'Vertical avatar portrait with mint background.', 'Avatar portrait phone wallpaper.'],
  ['Wallpaper Squad Goals Desktop',   'wide',  'Desktop wallpaper — squad', '4K wide squad pose wallpaper.', 'Squad goals 4K desktop wallpaper.'],
];
wallpapers.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'wallpaper', aspect, use, prompt, alt,
  tags: ['wallpaper', slug(title)],
  styleNotes: 'Phone safe-area for Dynamic Island/notch on top 90px and Home indicator on bottom 60px. Desktop: keep subject within central 60% safe area.',
})));

// 14. PRODUCT LIFESTYLE MOCKUPS (8)
const lifestyle = [
  ['Lifestyle Mint Hoodie Cafe',     'wide', 'Cafe lifestyle for mint hoodie', 'Avatar in mint hoodie at a cafe with breakfast plate, soft sunlight.', 'Mint hoodie cafe lifestyle.'],
  ['Lifestyle Pink Hoodie Park',     'wide', 'Park lifestyle for pink hoodie', 'Avatar in pink hoodie sitting in a park with cereal bowl.', 'Pink hoodie park lifestyle.'],
  ['Lifestyle Cap Skate Park',       'wide', 'Cap lifestyle at skate park', 'Avatar wearing the EMG731 cap at a skate park, holding skateboard.', 'Cap skate-park lifestyle.'],
  ['Lifestyle Pajama Bedroom',       'square', 'Pajama lifestyle in bedroom', 'Avatar in pajama set on cozy bed with mug.', 'Pajama bedroom lifestyle shot.'],
  ['Lifestyle Backpack School',      'wide', 'Backpack lifestyle at school', 'Avatar with breakfast backpack at locker, friends in background.', 'Backpack lifestyle at school.'],
  ['Lifestyle Mug Stream Desk',      'square', 'Mug lifestyle on stream desk', 'Mug on stream desk with mic visible, avatar reaching for it.', 'Mug stream-desk lifestyle.'],
  ['Lifestyle Tumbler Park',         'square', 'Tumbler lifestyle outdoors', 'Tumbler on picnic blanket with breakfast spread.', 'Tumbler picnic lifestyle.'],
  ['Lifestyle Plush Bed',            'square', 'Plush lifestyle on bed', 'Waffle Wendy plush propped on bed pillow.', 'Waffle plush on bed lifestyle.'],
];
lifestyle.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['mockup', 'lifestyle', slug(title)],
  styleNotes: 'Softly lit, natural daylight feel, avoid heavy shadows.',
})));

// 15. QUOTE / SLOGAN CARDS (6)
const quotes = [
  ['Card Slogan Cream',     'square', 'Cream slogan card', 'Slogan in serif on cream with single waffle accent.', 'Slogan card on cream with waffle.'],
  ['Card Slogan Mint',      'square', 'Mint slogan card', 'Slogan in serif on mint with egg accent.', 'Slogan card on mint with egg.'],
  ['Card Slogan Pink',      'square', 'Pink slogan card', 'Slogan in serif on pink with strawberry accent.', 'Slogan card on pink with strawberry.'],
  ['Card Eat Well',         'square', 'Eat well, game better card', '"Eat well. Game better." in serif on cream with controller silhouette.', 'Eat well game better card.'],
  ['Card Pull Up A Chair',  'square', 'Pull up a chair card', '"Pull up a chair" in serif italic with chair silhouette.', 'Pull up a chair card.'],
  ['Card Squad Goals',      'square', '"Squad goals" card', '"Squad goals" big serif word + mascots in corners.', 'Squad goals quote card.'],
];
quotes.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'social', aspect, use, prompt, alt,
  tags: ['quote', 'card', slug(title)],
  styleNotes: 'High readability for social previews and screenshots.',
})));

// 16. BREAKFAST CHARACTER ILLUSTRATIONS (8)
const characters = [
  ['Character Waffle Wendy Full',     'portrait', 'Full character of Waffle mascot', 'Full body Waffle Wendy with arms and legs, butter-pat patch.', 'Waffle Wendy full body character.'],
  ['Character Eggy Full',             'portrait', 'Full character of Egg mascot', 'Full body Eggy with cape.', 'Eggy mascot full body.'],
  ['Character Pancake Stack-y Full',  'portrait', 'Full character of Pancake mascot', 'Full body pancake stack with cap.', 'Pancake stack mascot full body.'],
  ['Character Cereal Scout Full',     'portrait', 'Full character of Cereal mascot', 'Full body cereal scout with periscope spoon.', 'Cereal scout full body.'],
  ['Character Toast Soldier',         'portrait', 'Toast soldier character', 'Toast slice with little legs, marching pose.', 'Toast soldier marching.'],
  ['Character Bacon Buddy',           'portrait', 'Bacon buddy character', 'Bacon strip mascot with cool pose.', 'Bacon buddy mascot.'],
  ['Character Strawberry Star',       'portrait', 'Strawberry star character', 'Strawberry with star eyes and mini cape.', 'Strawberry star mascot.'],
  ['Character Milk Cloud',            'portrait', 'Milk cloud character', 'Anthropomorphic milk cloud, soft and friendly.', 'Milk cloud mascot.'],
];
characters.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'avatar', aspect, use, prompt, alt,
  tags: ['mascot', 'character', slug(title)],
  styleNotes: 'Squad-style — sticker-friendly, friendly faces, no sharp angles.',
})));

// 17. THUMBNAIL CONCEPTS (6)
const thumbs = [
  ['Thumb Cereal Galaxy Speedrun',   'wide', 'YouTube thumbnail concept', 'Cereal galaxy with avatar, big "SPEEDRUN" text.', 'Cereal galaxy speedrun YouTube thumbnail.'],
  ['Thumb Pancake Stream Replay',    'wide', 'YouTube replay thumbnail', 'Pancake tower hero crop with "REPLAY" badge.', 'Pancake stream replay thumbnail.'],
  ['Thumb Avatar Fits Drop',         'wide', 'Fits-drop thumbnail', 'Avatar in mint hoodie with "NEW FITS" text.', 'Avatar fits drop thumbnail.'],
  ['Thumb Breakfast Reveal',         'wide', 'Reveal thumbnail', 'Plate cover lifting off pancakes with "REVEAL" text.', 'Breakfast reveal thumbnail.'],
  ['Thumb Squad Q&A',                'wide', 'Q&A thumbnail', 'Avatar at desk with "SQUAD Q&A" text.', 'Squad Q&A thumbnail.'],
  ['Thumb Going Live Now',           'wide', 'Going-live thumbnail', 'Avatar with mic and red dot, "GOING LIVE" big text.', 'Going-live YouTube thumbnail.'],
];
thumbs.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'social', aspect, use, prompt, alt,
  tags: ['thumbnail', 'youtube', slug(title)],
  styleNotes: 'YouTube thumbnail safe area: avoid bottom-right where duration appears. Big readable text.',
})));

// 18. FEATURE / UI ILLUSTRATIONS (6)
const ui = [
  ['UI — Live Hub Illustration',     'wide', 'Empty live hub illustration', 'Stage curtains opening with "LIVE" sign.', 'Live hub stage illustration.'],
  ['UI — Watch Page Empty State',    'wide', 'Watch page empty state', 'Pancake stack with film-strip ribbon.', 'Watch page empty state illustration.'],
  ['UI — Gallery Filter Empty',      'wide', 'Gallery filter empty state', 'Empty plate with cooking lid.', 'Gallery filter empty illustration.'],
  ['UI — Schedule Calendar Hero',    'wide', 'Schedule page hero illustration', 'Calendar made of waffle squares.', 'Schedule waffle calendar illustration.'],
  ['UI — Community Hero',            'wide', 'Community page hero illustration', 'Group photo style with avatar and mascots.', 'Community group illustration.'],
  ['UI — FAQ Helper',                'wide', 'FAQ page helper illustration', 'Avatar pointing at speech bubble.', 'FAQ helper avatar illustration.'],
];
ui.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['ui', 'illustration', slug(title)],
  styleNotes: 'Pair with on-page heading; allow safe area for UI overlay.',
})));

// 19. ICON PACKS / BADGES (6)
const icons = [
  ['Icon Pack Breakfast Set',  'square', 'Core breakfast icon set', 'Set of 6: waffle, egg, pancake, cereal, toast, fruit. Rounded corners, 2px stroke set.', 'Core breakfast icon set.'],
  ['Icon Pack Squad Symbols',  'square', 'Squad symbols icon set', 'Set of 6 symbols: cap, purse, controller, cardigan, fork, sparkle.', 'Squad symbols icon set.'],
  ['Badge Squad Hex',          'square', 'Squad hex badge', 'Hex badge with EMG inside, golden outer stroke.', 'Squad hex badge icon.'],
  ['Badge Plate Crest',        'square', 'Plate crest badge', 'Circular badge with stacked plate inside.', 'Plate crest badge icon.'],
  ['Badge Live Pulse',         'square', 'Live pulse badge', 'Live pulse dot badge with halo ring (static).', 'Live pulse badge icon.'],
  ['Badge Verified Squad',     'square', 'Verified squad badge', 'Mint star with "Verified Squad" microtext.', 'Verified squad badge icon.'],
];
icons.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'badge', aspect, use, prompt, alt,
  tags: ['icon', 'badge', slug(title)],
  styleNotes: 'Crisp at 32px and 256px. Provide both filled and outline variants.',
})));

// 20. PRINTABLES / EXTRAS (4)
const extras = [
  ['Printable Breakfast Cards',    'portrait', 'Printable cards for journaling', '7 cards (one per day) for breakfast notes — A4/Letter ready.', 'Printable breakfast journaling cards.'],
  ['Printable Coloring Page',      'portrait', 'Coloring page', 'Avatar + plate of food line-art coloring page.', 'Avatar coloring page line-art.'],
  ['Printable Sticker Sheet PDF',  'portrait', 'Printable sticker sheet PDF', 'Cut-out friendly sticker sheet for fans to print.', 'Printable sticker sheet PDF layout.'],
  ['Printable Squad Membership',   'portrait', 'Squad membership card', 'Wallet-sized squad membership card design.', 'Squad membership wallet card.'],
];
extras.forEach(([title, aspect, use, prompt, alt]) => push(entry({
  title, category: 'mockup', aspect, use, prompt, alt,
  tags: ['printable', 'extra', slug(title)],
  styleNotes: 'A4 + US Letter safe-area; CMYK considerations for home printing.',
})));

// Summary
manifest.summary = {
  total: manifest.entries.length,
  byCategory: manifest.entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {}),
  topPicks: {
    heroes: manifest.entries.filter(e => e.category === 'hero').slice(0, 20).map(e => e.id),
    productReady: manifest.entries.filter(e => e.tags.includes('mockup')).slice(0, 20).map(e => e.id),
    socialContent: manifest.entries.filter(e => e.category === 'social').slice(0, 20).map(e => e.id),
    seasonal: manifest.entries.filter(e => e.category === 'seasonal').slice(0, 20).map(e => e.id),
  },
};

fs.writeFileSync(
  path.join(OUT, 'master-image-manifest.json'),
  JSON.stringify(manifest, null, 2),
);
console.log(`Wrote ${manifest.entries.length} entries to master-image-manifest.json`);
