import type { Metadata } from 'next';
import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { ShopGrid } from '@/components/shop/ShopGrid';

export const metadata: Metadata = {
  title: 'Merch · The breakfast brand',
  description: '60+ pieces across 10 collections — real photo-quality mockups, from the iconic mint slogan hoodie to limited avatar drops.',
};

export default function ShopPage() {
  return (
    <div className="container-soft py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="display text-display-lg text-cocoa">Merch</h1>
        <p className="text-cocoa/70 mt-2 max-w-2xl">
          Soft fits, breakfast graphics, big plate energy. Every drop is designed to wear before school, after stream, and basically forever.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="display text-display-md text-cocoa mb-4">Collections</h2>
        <div className="overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
          <ul className="flex gap-3 min-w-max">
            {COLLECTIONS.map((c) => (
              <li key={c.id}>
                <a
                  href={`/collections/${c.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-cream ring-1 ring-creamShade px-4 py-2 text-sm font-semibold text-cocoa shadow-soft hover:shadow-lifted hover:-translate-y-0.5 transition-all"
                  style={{ borderColor: c.accent }}
                >
                  <span className="text-base">{c.icon}</span> {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ShopGrid products={P