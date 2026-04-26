import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COLLECTIONS, getCollection } from '@/data/collections';
import { PRODUCTS, type CollectionId } from '@/data/products';
import { ShopGrid } from '@/components/shop/ShopGrid';

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCollection(params.slug as CollectionId);
  if (!c) return { title: 'Collection' };
  return { title: `${c.name} · ${c.tagline}`, description: c.description };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollection(params.slug as CollectionId);
  if (!collection) notFound();

  const products = PRODUCTS.filter((p) => p.collection === collection.id);

  return (
    <div className="container-soft py-12 sm:py-16">
      <header
        className="rounded-3xl ring-1 ring-creamShade p-6 sm:p-10 mb-10 shadow-soft"
        style={{ background: `linear-gradient(160deg, ${collection.accent}77, var(--card))` }}
      >
        <div className="text-7xl mb-3" aria-hidden>{collection.icon}</div>
        <h1 className="display text-display-lg text-cocoa">{collection.name}</h1>
        <p className="display-italic text-cocoa/80 mt-1">{collection.tagline}</p>
        <p className="text-cocoa/80 mt-3 max-w-2xl">{collection.description}</p>
      </header>

      <ShopGrid products={products} />
    </div>
  );
}
