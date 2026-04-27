'use client';

import { useReducedMotion } from 'framer-motion';

const motifs = [
  { e: '🧇', x: '8%',  y: '12%', size: 36, cls: 'float-1' },
  { e: '🥞', x: '88%', y: '10%', size: 42, cls: 'float-2' },
  { e: '🍳', x: '14%', y: '78%', size: 38, cls: 'float-3' },
  { e: '🥣', x: '92%', y: '70%', size: 34, cls: 'float-1' },
  { e: '🍓', x: '46%', y: '6%',  size: 28, cls: 'float-2' },
  { e: '🍞', x: '60%', y: '88%', size: 30, cls: 'float-3' },
  { e: '🥓', x: '76%', y: '38%', size: 26, cls: 'float-1' },
  { e: '⭐', x: '24%', y: '32%', size: 20, cls: 'float-2' },
  { e: '☁',  x: '54%', y: '48%', size: 30, cls: 'float-3' },
];

export function BreakfastFloaters() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      {motifs.map((m, i) => (
        <span
          key={i}
          className={reduce ? '' : m.cls}
          style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            fontSize: m.size,
            opacity: 0.85,
            filter: 'drop-shadow(0 4px 8px rgba(59,42,34,0.10))',
          }}
        >
          {m.e}
        </span>
      ))}
    </div>
  );
}
