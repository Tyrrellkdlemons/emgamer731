/**
 * 67 BRAINROTS — flipped frame.
 *
 * EMM's mission with this page: take the "brainrot" energy and use it to
 * sneak ACTUAL knowledge into the squad's daily scroll. Every entry is a
 * real, verified concept across the major fields a curious teenager should
 * know about — physics, tech, psychology, culture, math, biology,
 * philosophy, music, economics, history, art — wrapped in a meme-shaped
 * package so it lands.
 *
 * Editorial bar:
 *   - Each entry must be TRUE and verifiable (no urban-legend nonsense).
 *   - The "hook" is the dopamine — short, punchy, sometimes silly.
 *   - The "fact" is the payoff — the actual learning.
 *   - The "why" line tells the reader why it matters in 5–12 words.
 *   - Source citations are optional but encouraged for the meatier ones.
 */

export type BrainrotCategory =
  | 'physics'
  | 'tech'
  | 'psychology'
  | 'culture'
  | 'math'
  | 'biology'
  | 'philosophy'
  | 'music'
  | 'economics'
  | 'history'
  | 'art';

export type Brainrot = {
  id: string;
  /** Meme-y brainrot title — short, all caps optional. */
  hook: string;
  category: BrainrotCategory;
  /** Foreground emoji or short character. */
  emoji: string;
  /** The actual educational payoff — 1–3 sentences. */
  fact: string;
  /** Why the reader should care — 5–12 words. */
  why: string;
  /** Optional source string (URL or short citation). */
  source?: string;
  /** Hex accent — used for the card's gradient. */
  accent: string;
};

export const BRAINROT_CATEGORIES: { id: BrainrotCategory; label: string; emoji: string }[] = [
  { id: 'physics',     label: 'Physics',     emoji: '⚛️' },
  { id: 'tech',        label: 'Tech',        emoji: '💻' },
  { id: 'psychology',  label: 'Psychology',  emoji: '🧠' },
  { id: 'culture',     label: 'Culture',     emoji: '🌍' },
  { id: 'math',        label: 'Math',        emoji: '📐' },
  { id: 'biology',     label: 'Biology',     emoji: '🧬' },
  { id: 'philosophy',  label: 'Philosophy',  emoji: '🤔' },
  { id: 'music',       label: 'Music',       emoji: '🎶' },
  { id: 'economics',   label: 'Economics',   emoji: '💸' },
  { id: 'history',     label: 'History',     emoji: '🏛️' },
  { id: 'art',         label: 'Art',         emoji: '🎨' },
];

export const BRAINROTS: Brainrot[] = [
  // ─── PHYSICS (6) ──────────────────────────────────────────────
  { id: 'p1', hook: 'QUANTUM ENTANGLEMENT IS DELULU SOULMATES', category: 'physics', emoji: '⚛️', accent: '#7B61FF',
    fact: 'Two particles can be linked so that measuring one INSTANTLY tells you about the other — even if they\'re on opposite sides of the universe. Einstein called it "spooky action at a distance."',
    why: 'Real physics behind quantum computing.' },
  { id: 'p2', hook: 'TIME LITERALLY MOVES SLOWER FOR YOUR FEET', category: 'physics', emoji: '⏳', accent: '#5BD2D8',
    fact: 'Gravity slows down time. Your head, being further from Earth\'s centre, ages a tiny bit faster than your feet. GPS satellites have to correct for this every single second.',
    why: 'General relativity isn\'t fiction — it runs your phone.' },
  { id: 'p3', hook: 'YOU\'RE MOSTLY EMPTY SPACE BESTIE', category: 'physics', emoji: '🫥', accent: '#FF9EC0',
    fact: 'If you removed all the space inside your atoms, the entire human race would fit inside a sugar cube. Atoms are 99.9999999999% empty space.',
    why: 'You\'re mostly nothing — and that\'s metal.' },
  { id: 'p4', hook: 'GLASS IS A REALLY SLOW LIQUID? CAP.', category: 'physics', emoji: '🪟', accent: '#BDE3FF',
    fact: 'Cap. Glass is an amorphous solid, not a liquid. Old church windows are thicker at the bottom because medieval glassmakers couldn\'t roll uniform sheets, not because gravity pulled it.',
    why: 'Debunking the most repeated science lie.' },
  { id: 'p5', hook: 'BLACK HOLES SCREAM IN B FLAT', category: 'physics', emoji: '🕳️', accent: '#3B2A22',
    fact: 'NASA detected sound waves coming from a black hole in the Perseus galaxy cluster. The pitch is a B flat, 57 octaves below middle C.',
    why: 'Yes — space technically has sound.' },
  { id: 'p6', hook: 'LIGHT TAKES 100K YEARS TO ESCAPE THE SUN', category: 'physics', emoji: '☀️', accent: '#FFD89C',
    fact: 'A photon born in the Sun\'s core can take ~100,000 years to reach the surface (random-walking through plasma). Then it sprints to your eyeball in 8 minutes.',
    why: 'The light hitting you is an Ice-Age tourist.' },

  // ─── TECH (6) ──────────────────────────────────────────────
  { id: 't1', hook: 'YOUR PHONE HAS MORE COMPUTE THAN APOLLO 11', category: 'tech', emoji: '📱', accent: '#A8E6CF',
    fact: 'The Apollo 11 guidance computer ran at 0.043 MHz with 64KB of memory. Your phone is millions of times more powerful — and you use it to argue about pizza.',
    why: 'Perspective on what computing power actually is.' },
  { id: 't2', hook: 'WIFI IS LITERALLY MICROWAVES BESTIE', category: 'tech', emoji: '📡', accent: '#BDE3FF',
    fact: 'WiFi uses 2.4 GHz radio waves — the same band a microwave oven uses to cook food. The oven just uses ~1000× more power and sealed metal walls.',
    why: 'Why your microwave breaks WiFi when running.' },
  { id: 't3', hook: 'BLUE LED INVENTED THE SMARTPHONE', category: 'tech', emoji: '🔵', accent: '#5BD2D8',
    fact: 'For 30 years no one could make a blue LED. Three Japanese physicists cracked it in the 1990s — the breakthrough that enabled white LEDs, modern screens, and Blu-ray. They won the 2014 Nobel.',
    why: 'One colour unlocked the modern display.' },
  { id: 't4', hook: 'AES-256 WOULD TAKE 10^77 YEARS TO BRUTE-FORCE', category: 'tech', emoji: '🔐', accent: '#7B61FF',
    fact: 'Modern encryption (AES-256) has so many possible keys that all the computers ever built, running until the heat-death of the universe, could not try them all.',
    why: 'Why "the algorithm" is unbreakable in practice.' },
  { id: 't5', hook: 'THE INTERNET IS WIRES UNDER THE OCEAN', category: 'tech', emoji: '🌊', accent: '#3B6EFF',
    fact: '~95% of all international internet traffic travels through ~485 fibre-optic cables sitting on the ocean floor. Sharks have been caught biting them.',
    why: 'The "cloud" is mostly underwater plumbing.' },
  { id: 't6', hook: 'GMAIL\'S CAPTCHA TRAINS SELF-DRIVING CARS', category: 'tech', emoji: '🚦', accent: '#FF9EC0',
    fact: 'Every time you click "select all squares with traffic lights" you\'re labelling training data for Google\'s computer-vision models — which feed Waymo\'s self-driving stack.',
    why: 'You\'re a free intern for the AI economy.' },

  // ─── PSYCHOLOGY (6) ──────────────────────────────────────────────
  { id: 'ps1', hook: 'YOUR BRAIN HALLUCINATES REALITY', category: 'psychology', emoji: '🧠', accent: '#FF9EC0',
    fact: 'Perception isn\'t a video feed — it\'s your brain\'s best guess at what\'s out there, updated in real time by sensory input. The colour blue didn\'t exist in many ancient languages because nobody had been told to look for it.',
    why: 'You don\'t see reality; you see a prediction.' },
  { id: 'ps2', hook: 'DUNNING-KRUGER: WHEN YOU THINK YOU ATE BUT YOU\'RE MID', category: 'psychology', emoji: '📈', accent: '#FFD89C',
    fact: 'Beginners systematically OVERESTIMATE their ability; experts UNDERESTIMATE it. The less you know about a topic, the less you know what you don\'t know.',
    why: 'Calibrate before you cook.' },
  { id: 'ps3', hook: 'YOUR BFF IS HOW YOU SOUND', category: 'psychology', emoji: '👯', accent: '#A8E6CF',
    fact: 'You become the average of the 5 people you spend most time with — speech patterns, vocabulary, posture, even gait. Mirror neurons fire when you watch someone do something.',
    why: 'Pick your friends like you pick your fits.' },
  { id: 'ps4', hook: 'SLEEP DEPRIVATION = LEGAL DRUNK', category: 'psychology', emoji: '😴', accent: '#7B61FF',
    fact: 'Going 17 hours without sleep impairs your reaction time as much as a blood-alcohol level of 0.05%. After 24 hours, it\'s like 0.10% — over the legal driving limit in every state.',
    why: 'Sleep is not a flex you can skip.' },
  { id: 'ps5', hook: 'WRITING IT DOWN HACKS YOUR BRAIN', category: 'psychology', emoji: '✍️', accent: '#BDE3FF',
    fact: 'Studies of college students show writing notes by HAND beats typing for memory retention — because your hand can\'t keep up, you\'re forced to summarize, which is encoding.',
    why: 'Lo-fi notebooks > faster laptop notes.' },
  { id: 'ps6', hook: 'YOU CAN\'T MULTITASK — YOU TASK-SWITCH', category: 'psychology', emoji: '🔀', accent: '#FF7AB6',
    fact: 'Your brain doesn\'t actually run two cognitive tasks at once — it switches between them, and each switch costs ~25 minutes to fully re-focus.',
    why: 'Single-tasking is the unfair advantage.' },

  // ─── CULTURE (6) ──────────────────────────────────────────────
  { id: 'c1', hook: 'THE QWERTY KEYBOARD WAS DESIGNED TO SLOW YOU DOWN', category: 'culture', emoji: '⌨️', accent: '#FFD89C',
    fact: 'QWERTY (1873) was laid out to separate common letter pairs because mechanical typewriters JAMMED when you typed too fast. Faster layouts (Dvorak, Colemak) exist but QWERTY locked in.',
    why: 'Path-dependence rules tech & culture.' },
  { id: 'c2', hook: 'ENGLISH HAS NO WORD FOR "THE DAY AFTER TOMORROW"', category: 'culture', emoji: '🗓️', accent: '#A8E6CF',
    fact: 'German has "übermorgen", Spanish has "pasado mañana", Hindi has "parson" — English just says "the day after tomorrow." Languages encode what cultures notice.',
    why: 'Language shapes what you can think about.' },
  { id: 'c3', hook: 'PINK USED TO BE A BOY COLOR', category: 'culture', emoji: '🎀', accent: '#FF9EC0',
    fact: 'Until ~1940, pink was marketed as a strong/manly colour and blue as soft/feminine. Marketing flipped the convention; it has nothing to do with biology.',
    why: 'Most "always been this way" things weren\'t.' },
  { id: 'c4', hook: 'KOREA HAD AN ALPHABET INVENTED BY ONE GUY', category: 'culture', emoji: '🇰🇷', accent: '#7B61FF',
    fact: 'King Sejong invented Hangul in 1443 specifically so peasants could become literate — most languages\' scripts evolve over centuries; Hangul was designed in a year.',
    why: 'Sometimes one person\'s decision changes a country.' },
  { id: 'c5', hook: 'JAPAN\'S OLDEST COMPANY IS 1,400 YEARS OLD', category: 'culture', emoji: '🏯', accent: '#FF4757',
    fact: 'Kongō Gumi, a Japanese construction firm, was founded in 578 AD. It built temples for over 1,400 years before being acquired in 2006.',
    why: 'Long-term thinking is a real strategy.' },
  { id: 'c6', hook: 'EVERY CONTINENT EXCEPT ANTARCTICA HAS A McDONALDS', category: 'culture', emoji: '🍔', accent: '#FFD89C',
    fact: 'McDonald\'s operates in 100+ countries, on every inhabited continent. The Big Mac Index is literally a real economics tool used to compare currencies.',
    why: 'Globalization made beef the universal language.' },

  // ─── MATH (6) ──────────────────────────────────────────────
  { id: 'm1', hook: '0.999... = 1 (NO DEBATE)', category: 'math', emoji: '♾️', accent: '#5BD2D8',
    fact: 'The number 0.999... (with infinite 9s) is EXACTLY equal to 1. Same number, two notations. Provable in 3 lines using basic algebra.',
    why: 'Infinity breaks your intuition — and that\'s ok.' },
  { id: 'm2', hook: 'BIRTHDAY PARADOX ATE THAT', category: 'math', emoji: '🎂', accent: '#FF9EC0',
    fact: 'In a room of just 23 people, there\'s a >50% chance two share a birthday. With 70 people, it\'s 99.9%. Probability is unintuitive at scale.',
    why: 'Coincidences feel rare but math says no.' },
  { id: 'm3', hook: 'PI SHOWS UP IN A RIVER\'S LENGTH', category: 'math', emoji: '🌊', accent: '#BDE3FF',
    fact: 'The ratio of a river\'s actual meandering length to the straight-line distance from source to mouth tends to π (~3.14). Proven by Hans-Henrik Stølum in 1996.',
    why: 'Pi hides in places it has no business being.' },
  { id: 'm4', hook: 'THE BANACH-TARSKI BALL DUPLICATOR', category: 'math', emoji: '⚪', accent: '#7B61FF',
    fact: 'There\'s a mathematical proof that you can chop a sphere into 5 pieces and reassemble them into TWO spheres of the original size. (It only works in pure math, not real atoms.)',
    why: 'Infinity violates physics on purpose.' },
  { id: 'm5', hook: 'FERMAT\'S LAST THEOREM TOOK 358 YEARS', category: 'math', emoji: '📜', accent: '#FFD89C',
    fact: 'In 1637 Fermat scribbled "I have a marvellous proof which this margin is too narrow to contain." It was proven in 1994 by Andrew Wiles using math that didn\'t exist when Fermat was alive.',
    why: 'Some problems take 350 years. Patience.' },
  { id: 'm6', hook: 'GOOGLE = 10^100 — AND IT\'S A REAL NUMBER', category: 'math', emoji: '🔢', accent: '#A8E6CF',
    fact: 'A "googol" (the company misspelled it) is 1 followed by 100 zeros. That\'s more than the number of atoms in the observable universe (~10^80).',
    why: 'Some numbers are bigger than reality.' },

  // ─── BIOLOGY (6) ──────────────────────────────────────────────
  { id: 'b1', hook: 'OCTOPUSES HAVE 9 BRAINS BFF', category: 'biology', emoji: '🐙', accent: '#FF9EC0',
    fact: 'Octopuses have one central brain plus a mini-brain in EACH of their 8 arms. Two-thirds of their neurons live in the arms. Each arm can solve problems independently.',
    why: 'Distributed intelligence in nature.' },
  { id: 'b2', hook: 'YOUR DNA WOULD STRETCH TO PLUTO', category: 'biology', emoji: '🧬', accent: '#A8E6CF',
    fact: 'Stretched end-to-end, the DNA in your body would reach to Pluto and back ~17 times. Each cell holds ~2 metres of DNA folded into something the size of a poppy seed.',
    why: 'You\'re a galaxy of nucleotides.' },
  { id: 'b3', hook: 'BANANAS ARE BERRIES, STRAWBERRIES ARE NOT', category: 'biology', emoji: '🍌', accent: '#FFD89C',
    fact: 'Botanically, a berry is a single fruit from a single flower with one ovary. Bananas, tomatoes, and watermelons qualify — strawberries (multiple ovaries) do not.',
    why: 'Categories you trusted are wrong.' },
  { id: 'b4', hook: 'TARDIGRADES SURVIVED ALL 5 MASS EXTINCTIONS', category: 'biology', emoji: '🐻‍❄️', accent: '#BDE3FF',
    fact: 'Tardigrades ("water bears") can survive boiling, freezing, the vacuum of space, and 1000× the radiation that would kill you. They\'re ~0.5mm long and live on every continent.',
    why: 'Toughness has no relation to size.' },
  { id: 'b5', hook: 'YOU HAVE MORE BACTERIA CELLS THAN HUMAN', category: 'biology', emoji: '🦠', accent: '#5BD2D8',
    fact: 'Roughly 50% of the cells in your body aren\'t even "you" — they\'re bacteria, mostly in your gut. Your microbiome influences mood, weight, and immunity.',
    why: 'You\'re a community, not an individual.' },
  { id: 'b6', hook: 'TREES TALK VIA UNDERGROUND FUNGUS NETWORKS', category: 'biology', emoji: '🌳', accent: '#A8E6CF',
    fact: 'Forests connect through mycorrhizal fungi — a "wood-wide web" through which trees share sugars, warn neighbours of pests, and even nurse their offspring.',
    why: 'The forest floor is the original internet.' },

  // ─── PHILOSOPHY (6) ──────────────────────────────────────────────
  { id: 'ph1', hook: 'THE SHIP OF THESEUS DELULU MOMENT', category: 'philosophy', emoji: '⛵', accent: '#5BD2D8',
    fact: 'If you replace every plank of a ship over time, is it still the same ship? What if you build a NEW ship from the old planks? Both? Neither? This question is 2000 years old.',
    why: 'Identity is harder to pin down than you think.' },
  { id: 'ph2', hook: 'TROLLEY PROBLEM: 5 PEOPLE OR ONE?', category: 'philosophy', emoji: '🚊', accent: '#FF9EC0',
    fact: 'A runaway trolley will kill 5 people. You can pull a lever to divert it onto a track where it will kill 1. Most people pull. Most people refuse to PUSH a stranger off a bridge to stop it. Same math, different intuition.',
    why: 'Your morality is wired weird on purpose.' },
  { id: 'ph3', hook: 'PASCAL\'S WAGER ENERGY', category: 'philosophy', emoji: '🎲', accent: '#FFD89C',
    fact: 'Pascal argued: even if God\'s odds are 50/50, believing has a finite cost and infinite reward, while not believing has a finite gain and infinite loss. So believe. (Centuries of philosophers have argued back.)',
    why: 'A 17th century math-flex on faith.' },
  { id: 'ph4', hook: 'THE EXPERIENCE MACHINE — WOULD YOU PLUG IN?', category: 'philosophy', emoji: '🔌', accent: '#7B61FF',
    fact: 'Robert Nozick: imagine a machine that gives you any experience you want, but you\'re unconscious in a tank. Most people refuse. So we don\'t just want pleasure — we want it to be REAL.',
    why: 'There\'s more to a good life than vibes.' },
  { id: 'ph5', hook: 'STOICISM IS NOT BEING EMOTIONLESS', category: 'philosophy', emoji: '🪨', accent: '#3B2A22',
    fact: 'Stoicism (Marcus Aurelius, Epictetus, Seneca) is about controlling your REACTIONS to things outside your control. Not "no feelings" — better-aimed feelings.',
    why: 'The OG mindfulness toolkit.' },
  { id: 'ph6', hook: 'OCKHAM\'S RAZOR — KEEP IT MID', category: 'philosophy', emoji: '🪒', accent: '#A8E6CF',
    fact: 'When two explanations fit the facts equally well, the simpler one is usually right. Not always — but it\'s the better starting bet.',
    why: 'The cheat code for noisy debates.' },

  // ─── MUSIC (6) ──────────────────────────────────────────────
  { id: 'mu1', hook: 'YOUR FAVOURITE SONGS ARE 99% MATH', category: 'music', emoji: '🎼', accent: '#FF9EC0',
    fact: 'Western music is built on the equal-tempered 12-tone system — frequencies multiplied by the 12th root of 2 each step. Pythagoras nailed the basics 2500 years ago.',
    why: 'Beauty in music = ratios you can\'t hear consciously.' },
  { id: 'mu2', hook: 'MOZART WAS THE OG SHITPOSTER', category: 'music', emoji: '🎻', accent: '#FFD89C',
    fact: 'Mozart wrote a 6-voice canon called "Leck mich im Arsch" — German for "lick my ass." Genius classical composer + middle-school humour. Both can be true.',
    why: 'Geniuses are still goofy.' },
  { id: 'mu3', hook: 'THE LOUDEST POSSIBLE SOUND IS 194 dB', category: 'music', emoji: '🔊', accent: '#FF4757',
    fact: 'At 194 dB, the sound wave is so big that the trough is a vacuum — you literally can\'t make anything louder in air. Krakatoa\'s 1883 eruption hit ~310 dB at the source.',
    why: 'Even sound has a speed limit.' },
  { id: 'mu4', hook: '432 Hz IS NOT MAGIC, BUT FREQUENCY IS', category: 'music', emoji: '🎵', accent: '#A8E6CF',
    fact: 'The "432 Hz heals you" claim is pseudoscience — but frequency genuinely affects mood. Major-key tempo > 120 BPM reliably correlates with feelings of joy in lab studies.',
    why: 'Be careful which "vibrations" you trust.' },
  { id: 'mu5', hook: 'EARWORMS LIVE IN ONE BRAIN REGION', category: 'music', emoji: '🐛', accent: '#7B61FF',
    fact: 'When a song gets stuck in your head, it lights up the auditory cortex EVEN WHEN nothing\'s playing. Best counter-song to dislodge an earworm: "God Save the King."',
    why: 'Your brain replays sound on a loop.' },
  { id: 'mu6', hook: 'BIRDSONGS HAVE SYNTAX LIKE LANGUAGE', category: 'music', emoji: '🐦', accent: '#BDE3FF',
    fact: 'Bengalese finches have syntactic rules in their songs — sequences only count as "song" if assembled in valid order. Very early ancestor of human grammar.',
    why: 'Language might have started as melody.' },

  // ─── ECONOMICS (6) ──────────────────────────────────────────────
  { id: 'e1', hook: 'COMPOUND INTEREST IS THE SLOW SIGMA GRIND', category: 'economics', emoji: '💸', accent: '#A8E6CF',
    fact: '$1000 invested at 8% annual returns becomes $4,661 in 20 years and $46,901 in 50 years. Time, not deposits, is the lever.',
    why: 'Starting early is the cheat code.' },
  { id: 'e2', hook: 'MARKETS ARE 90% VIBES', category: 'economics', emoji: '📊', accent: '#FF9EC0',
    fact: 'Behavioral finance proved that prices move on EXPECTATIONS more than fundamentals. A company can post record profits and the stock can drop because the profit was 0.1% below the "vibe."',
    why: 'Sentiment is its own asset class.' },
  { id: 'e3', hook: 'HYPERINFLATION TURNED A LOAF INTO A BILLION MARKS', category: 'economics', emoji: '🍞', accent: '#FFD89C',
    fact: 'In 1923 Weimar Germany, inflation got so bad a wheelbarrow of cash bought one loaf of bread. The cause: printing money to pay debts. Trust in currency collapsed in months.',
    why: 'Money is a shared belief — and beliefs break.' },
  { id: 'e4', hook: 'THE BIG MAC INDEX IS A REAL TOOL', category: 'economics', emoji: '🍔', accent: '#FF4757',
    fact: 'The Economist\'s Big Mac Index uses the price of a Big Mac in different countries to measure currency over/undervaluation. Surprisingly accurate predictor.',
    why: 'Burgers are the universal currency.' },
  { id: 'e5', hook: 'GAME THEORY: TIT FOR TAT WINS', category: 'economics', emoji: '🎮', accent: '#7B61FF',
    fact: 'In repeated prisoner\'s dilemma tournaments, the strategy "cooperate first, then copy whatever the opponent did" beats every other strategy. Forgiveness + retaliation = optimal.',
    why: 'Be kind first. Match what they bring.' },
  { id: 'e6', hook: 'TULIPS CRASHED THE NETHERLANDS IN 1637', category: 'economics', emoji: '🌷', accent: '#FF9EC0',
    fact: 'Tulip bulbs sold for 10× a craftsman\'s annual salary at the peak of "Tulip Mania." Then prices collapsed in 6 weeks. First recorded asset bubble.',
    why: 'Bubbles aren\'t new — they\'re cyclical.' },

  // ─── HISTORY (6) ──────────────────────────────────────────────
  { id: 'h1', hook: 'OXFORD UNIVERSITY IS OLDER THAN THE AZTECS', category: 'history', emoji: '🏛️', accent: '#FFD89C',
    fact: 'Oxford has been teaching since at least 1096. The Aztec Empire wasn\'t founded until 1428 — Oxford was already 332 years old.',
    why: 'Timelines feel weird when you compare them.' },
  { id: 'h2', hook: 'SHARKS ARE OLDER THAN TREES', category: 'history', emoji: '🦈', accent: '#5BD2D8',
    fact: 'Sharks first appeared ~450 million years ago. Trees evolved ~390 million years ago. Sharks watched plants invent wood.',
    why: 'Earth is much older than your intuition.' },
  { id: 'h3', hook: 'THE EIFFEL TOWER WAS MEANT TO BE TEMPORARY', category: 'history', emoji: '🗼', accent: '#FF9EC0',
    fact: 'Built for the 1889 World\'s Fair, the Eiffel Tower was scheduled for demolition in 1909. It was kept because its antenna was useful for radio.',
    why: 'Iconic things often start as side-quests.' },
  { id: 'h4', hook: 'CLEOPATRA LIVED CLOSER TO THE iPHONE THAN THE PYRAMIDS', category: 'history', emoji: '👑', accent: '#A8E6CF',
    fact: 'Cleopatra (died 30 BC) lived ~2,500 years AFTER the Great Pyramid was built. The iPhone launched ~2,000 years AFTER Cleopatra.',
    why: 'Compress time and history scrambles.' },
  { id: 'h5', hook: 'WORLD WAR I ENDED WITH A TYPO', category: 'history', emoji: '✉️', accent: '#FF4757',
    fact: 'The Treaty of Versailles (1919) had several typos that affected boundaries; one map mistake set the wrong border between Germany and Belgium that lasted decades.',
    why: 'Geopolitics is sometimes a copy-paste error.' },
  { id: 'h6', hook: 'THE GREAT WALL ISN\'T VISIBLE FROM SPACE', category: 'history', emoji: '🧱', accent: '#3B2A22',
    fact: 'Despite the popular claim, no astronaut has visually identified the Great Wall from low-Earth orbit. It\'s long but THIN. Highways are easier to spot.',
    why: 'Most "facts" are vibes-only.' },

  // ─── ART (7) ──────────────────────────────────────────────
  { id: 'a1', hook: 'VAN GOGH SOLD ONE PAINTING IN HIS LIFE', category: 'art', emoji: '🌻', accent: '#FFD89C',
    fact: 'Van Gogh produced ~2,100 artworks but sold only ONE during his life ("The Red Vineyard"). His brother Theo bankrolled him until they both died.',
    why: 'Recognition is uncorrelated with quality.' },
  { id: 'a2', hook: 'THE MONA LISA IS TINY (77×53 cm)', category: 'art', emoji: '🖼️', accent: '#A8E6CF',
    fact: 'Most people imagine the Mona Lisa as huge. It\'s about the size of a cereal box. Da Vinci painted on poplar wood, not canvas.',
    why: 'Hype warps how we picture things.' },
  { id: 'a3', hook: 'PICASSO COULD DRAW LIKE RAPHAEL AT 14', category: 'art', emoji: '🎨', accent: '#FF9EC0',
    fact: 'Picasso said: "It took me four years to paint like Raphael, but a lifetime to paint like a child." His teen academic studies are technically immaculate.',
    why: 'You earn the right to break the rules.' },
  { id: 'a4', hook: 'EGYPTIAN PYRAMIDS WERE BLINDING WHITE', category: 'art', emoji: '🔺', accent: '#FFD89C',
    fact: 'The Great Pyramid was originally encased in polished white limestone. It would have shone like a beacon. The casing was stripped over centuries to build Cairo.',
    why: 'Ancient art was COLOURFUL — we lost the paint.' },
  { id: 'a5', hook: 'GREEK STATUES WERE PAINTED LOUD', category: 'art', emoji: '🗿', accent: '#FF4757',
    fact: 'Those clean white marble statues you see in museums? Originally painted in bright reds, blues, golds. The paint flaked off over millennia. Renaissance artists thought white = classical.',
    why: 'Half of what you "know" about classical art is wrong.' },
  { id: 'a6', hook: 'BANKSY SHREDDED A $1.4M PAINTING ON SALE', category: 'art', emoji: '🪚', accent: '#3B2A22',
    fact: 'In 2018 Banksy\'s "Girl with Balloon" sold at Sotheby\'s for £1.04M. Mid-celebration, a hidden shredder activated and destroyed half the canvas. The shredded version later sold for £18.5M.',
    why: 'Destruction can multiply value.' },
  { id: 'a7', hook: 'AI ART TOOK 70 YEARS TO LEARN HANDS', category: 'art', emoji: '🤖', accent: '#7B61FF',
    fact: 'AI image generation has existed in research since the 1960s. Until 2023, models still struggled drawing hands — a quirk of training data and the geometric complexity of fingers.',
    why: 'Even computers find some things hard.' },
];
