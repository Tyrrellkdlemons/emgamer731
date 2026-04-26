import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PATH = path.resolve(__dirname, '..', 'src', 'data', 'products.ts');

function poll(promptStr, seed = 1, w = 800, h = 800) {
  const p = encodeURIComponent(promptStr);
  return `https://image.pollinations.ai/prompt/${p}?width=${w}&height=${h}&seed=${seed}&model=flux&nologo=true&enhance=true`;
}

const STYLE = 'studio product photography, flat lay on pure white background, soft natural drop shadow, photorealistic, ecommerce product photo, centered composition, sharp focus, professional lighting, 4k';

const PROMPTS = {
  'cozy-cream-crewneck':            ['cream off-white pullover crewneck sweatshirt, ribbed cuffs and hem, cozy heavyweight cotton', 4001],
  'pancake-tower-crewneck':         ['butter yellow pullover crewneck sweatshirt with full color illustrated pancake stack print on chest, ribbed cuffs', 4002],
  'breakfast-pajama-set':           ['matching long sleeve pajama set, butter yellow with all over breakfast icons print waffles eggs pancakes, folded flat lay', 4003],
  'eat-with-emm-cropped-tee':       ['cream cropped tshirt with cursive script eat with emm front print in pink', 4004],
  'breakfast-boss-tee':             ['eggshell white tshirt with bold BREAKFAST BOSS black slogan print on chest', 4005],
  'cereal-chaos-tee':               ['lavender purple tshirt printed with floating cereal pieces in pastel colors', 4006],
  'gamer-essentials-tee-3pack':     ['three folded plain tshirts stacked, cream mint and berry pink, neat ecommerce stack', 4007],
  'mint-beanie':                    ['mint green knit cuffed beanie hat with woven label tab', 4008],
  'breakfast-socks-3pack':          ['three pairs of crew socks fanned out, butter yellow cream and pink with breakfast pattern', 4009],
  'pancake-slippers':               ['plush yellow pancake stack shaped slippers with butter pat detail on top, novelty slippers', 4010],
  'breakfast-backpack':             ['mint green canvas backpack with all over tossed breakfast icon print, school bag, padded straps', 4011],
  'lunch-bag-cooler':               ['pink insulated lunch cooler bag with cursive script print, kids size', 4012],
  'tote-waffle':                    ['cream cotton canvas tote bag with single large waffle print in golden brown', 4013],
  'phone-case-egg':                 ['glossy phone case with sunny side up egg pattern on butter yellow background, iPhone form factor', 4014],
  'tablet-sleeve-mint':             ['padded mint green neoprene tablet sleeve with cocoa brown stitching, 11 inch', 4015],
  'morning-mug':                    ['cream stoneware coffee mug with slogan print wrapping the body, on white surface', 4016],
  'syrup-drip-tumbler':             ['honey amber gradient insulated tumbler with caramel drip texture, 20oz, condensation drops', 4017],
  'water-bottle-mint':              ['24oz insulated water bottle, mint green with cocoa brown lid', 4018],
  'desk-mat-breakfast-world':       ['large gaming desk mat with illustrated pastel breakfast world map print, 900x400mm', 4019],
  'mouse-pad-egg':                  ['round mouse pad with sunny egg illustration, butter yellow', 4020],
  'cozy-blanket':                   ['plush throw blanket with breakfast icons pattern, butter yellow and pink, folded neatly', 4021],
  'pancake-pillow':                 ['round 14 inch decorative pillow shaped like a stack of pancakes with butter pat on top', 4022],
  'poster-cereal-galaxy':           ['matte 18x24 inch art print poster, cereal pieces as planets in lavender galaxy, framed', 4023],
  'breakfast-journal':              ['A5 hardcover lined journal notebook, cream soft touch cover with embroidered cap detail', 4024],
  'sticker-sheet-squad':            ['vinyl die cut sticker sheet with cute breakfast mascots, 24 stickers on cream backing', 4025],
  'waffle-wendy-plush':             ['8 inch plush waffle character soft toy with butter pat patch, cute kawaii style', 4026],
  'eggy-plush':                     ['7 inch plush sunny side up egg character soft toy with tiny embroidered cape, cute', 4027],
  'pin-set-breakfast':              ['set of five enamel pins on cream backing card, waffle egg pancake toast cereal shapes', 4028],
  'keychain-bear-charm':            ['cream resin bear charm keychain on white background, cute kawaii style', 4029],
  'sage-cardigan-drop':             ['sage green off shoulder open knit cardigan, womens cropped fit, ribbed knit, flat lay', 4030],
  'bear-charm-purse':               ['white faux leather mini crossbody purse with detachable bear plush charm, cute fashion', 4031],
};

let src = fs.readFileSync(PRODUCTS_PATH, 'utf8');
let updated = 0;
let missed = [];

for (const [slug, [promptText, seed]] of Object.entries(PROMPTS)) {
  const url = poll(`${promptText}, ${STYLE}`, seed);
  const re = new RegExp(`(slug:\\s*'${slug}'[^}]*?hero:\\s*)'([^']+)'`, 's');
  const next = src.replace(re, `$1'${url}'`);
  if (next !== src) {
    src = next;
    updated++;
  } else {
    missed.push(slug);
  }
}

fs.writeFileSync(PRODUCTS_PATH, src);
console.log(`Updated ${updated}/${Object.keys(PROMPTS).length}`);
if (missed.length) console.log(`Missed: ${missed.join(', ')}`);
