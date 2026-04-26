import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-soft py-24 text-center">
      <div className="text-7xl mb-4" aria-hidden>🥞</div>
      <h1 className="display text-display-lg text-cocoa">This page slept in. Delulu.</h1>
      <p className="text-cocoa/70 mt-2">No cap, let&apos;s get you back to the table — the plate is giving.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link href="/" className="btn-primary">Home (slay)</Link>
        <Link href="/live" className="btn-ghos