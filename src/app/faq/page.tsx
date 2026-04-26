import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Plain answers about streams, merch, and how the breakfast squad works.',
};

const FAQS = [
  { q: 'When does EMM go live?', a: 'See the schedule page — typically Saturday mornings + Wednesday evenings. The live banner up top updates automatically when a stream actually starts.' },
  { q: 'Do I need an account?', a: 'Nope. The site has no logins. Squad badges save in your own browser using local storage (nothing sent to a server).' },
  { q: 'Are the wallpapers really free?', a: 'Yes. Free phone wallpapers + a free digital sticker pack. Grab them in the shop.' },
  { q: 'When are merch drops?', a: 'Limited drops happen monthly. Big drops show up on the home page hero. Stock signs go up first on TikTok.' },
  { q: 'Is the site safe for kids?', a: 'Yes — privacy-first, no behavioral tracking, no third-party advertising, no DMs.' },
  { q: 'How do I send a breakfast pic?', a: 'Easiest: tag #BreakfastSquad on TikTok. Curated picks land in the gallery monthly.' },
  { q: 'Can I share these graphics?', a: 'Personal use yes — please credit @eatsswithemm. Commercial use no.' },
  { q: 'Where can I report something?', a: 'Email is set up under About → Contact (coming soon). For urgent matters, message on TikTok.' },
];

export default function FAQPage() {
  return (
    <div className="container-soft py-12 sm:py-16 max-w-3xl">
      <h1 className="display text-display-lg text-cocoa">FAQ</h1>
      <p className="text-cocoa/70 mt-2">Plain answers. No fine print.</p>

      <ul className="mt-8 divide-y divide-creamShade">
        {FAQS.map((f) => (
          <li key={f.q} className="py-5">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <span className="display text-xl text-cocoa">{f.q}</span>
                <span aria-hidden className="text-syrup transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="text-cocoa/80 mt-3">{f.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
