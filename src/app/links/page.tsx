import type { Metadata } from 'next';
import { SOCIAL_LINKS, PRIMARY_NAV } from '@/data/nav';

export const metadata: Metadata = {
  title: 'All links',
  description: 'Every place to find EMGamer731 + every section of the site.',
};

export default function LinksPage() {
  return (
    <div className="container-soft py-12 sm:py-16 max-w-2xl">
      <header className="text-center mb-8">
        <div className="text-6xl mb-3">🧇</div>
        <h1 className="display text-display-lg text-cocoa">All the links</h1>
        <p className="text-cocoa/70 mt-1">Everything in one place. Bookmark this page.</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-syrup font-bold mb-2">Find EMM</h2>
        <ul className="space-y-2">
          {SOCIAL_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-4 text-cocoa font-semibold shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all">
                {l.label} <span className="float-right" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-syrup font-bold mb-2">Site</h2>
        <ul className="space-y-2">
          {PRIMARY_NAV.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="block rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-4 text-cocoa font-semibold shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all">
                {l.label} <span className="float-right" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
