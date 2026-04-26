'use client';

/**
 * FloatingItemsField — a lightweight version of the OtherPagesBackground's
 * floating items, sized to drop INTO an existing section (e.g. the hero on
 * home, or beside the live offline card). It's deliberately smaller and
 * more transparent than the full-page bg field so it complements rather
 * than distracts. Used to satisfy the request "many many more of which are
 * moving" without disrupting the home hero photo or any specific section.
 *
 * Mount this inside a `position: relative` parent (the parent that sets the
 * scope of the field). The component fills its parent absolutely and never
 * intercepts pointer events.
 */

import { useMemo } from 'react';

type Item = {
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftDeg: number;
  opacity: number;
  rotate: number;
};

const DEFAULT_ITEMS: Item[] = [
  { emoji: '🥞', x:  6, y: 12, size: 1.6, duration: 22, delay: 0, driftDeg:  20, opacity: 0.55, rotate:  16 },
  { emoji: '🥓', x: 88, y: 18, size: 1.5, duration: 26, delay: 2, driftDeg: 200, opacity: 0.55, rotate: -18 },
  { emoji: '🍳', x: 14, y: 78, size: 1.8, duration: 24, delay: 1, driftDeg: 110, opacity: 0.55, rotate:  12 },
  { emoji: '🧇', x: 80, y: 84, size: 1.7, duration: 28, delay: 3, driftDeg: 280, opacity: 0.55, rotate: -22 },
  { emoji: '🍓', x: 42, y: 92, size: 1.3, duration: 20, delay: 4, driftDeg: 150, opacity: 0.6,  rotate:  20 },
  { emoji: '🥯', x: 92, y: 50, size: 1.5, duration: 26, delay: 6, driftDeg:  60, opacity: 0.5,  rotate: -14 },
  { emoji: '☕', x:  4, y: 38, size: 1.6, duration: 24, delay: 5, driftDeg: 250, opacity: 0.5,  rotate:  18 },
  { emoji: '🍯', x: 60, y:  6, size: 1.4, duration: 22, delay: 7, driftDeg: 180, opacity: 0.55, rotate: -10 },
];

type Props = {
  items?: Item[];
  /** Constrain the items to the bottom half (good for hero where photo is on top). */
  bottomHalfOnly?: boolean;
  className?: string;
};

export function FloatingItemsField({ items = DEFAULT_ITEMS, bottomHalfOnly, className }: Props) {
  const list = useMemo(() => {
    return bottomHalfOnly
      ? items.map((it) => ({ ...it, y: 50 + (it.y * 0.5) }))
      : items;
  }, [items, bottomHalfOnly]);

  const keyframes = useMemo(() => {
    return list.map((it, i) => {
      const rad = (it.driftDeg * Math.PI) / 180;
      const dist = 4;
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist;
      return `
        @keyframes fif-${i} {
          0%   { transform: translate3d(0,0,0) rotate(0deg); }
          50%  { transform: translate3d(${dx.toFixed(2)}rem, ${dy.toFixed(2)}rem, 0) rotate(${it.rotate}deg); }
          100% { transform: translate3d(0,0,0) rotate(0deg); }
        }`;
    }).join('\n');
  }, [list]);

  return (
    <div aria-hidden className={'pointer-events-none absolute inset-0 overflow-hidden ' + (className ?? '')}>
      {list.map((it, i) => (
        <span
          key={i}
          className="fif-float absolute select-none"
          style={{
            left: `${it.x}%`,
            top: `${it.y}%`,
            fontSize: `${it.size}rem`,
            opacity: it.opacity,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))',
            animation: `fif-${i} ${it.duration}s ease-in-out ${it.delay}s infinite`,
            willChange: 'transform',
          }}
        >
          {it.emoji}
        </span>
      ))}
      <style>{`
        ${keyframes}
        @media (prefers-reduced-motion: reduce) {
          .fif-float { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
