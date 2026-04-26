'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const OPTIONS = [
  { id: 'waffles',  label: 'Waffles',  emoji: '🧇' },
  { id: 'eggs',     label: 'Eggs',     emoji: '🍳' },
  { id: 'pancakes', label: 'Pancakes', emoji: '🥞' },
  { id: 'cereal',   label: 'Cereal',   emoji: '🥣' },
  { id: 'toast',    label: 'Toast',    emoji: '🍞' },
  { id: 'fruit',    label: 'Fruit',    emoji: '🍓' },
];

export function BreakfastQuestion() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <section className="container-soft py-12 sm:py-16" aria-labelledby="bq-title">
      <div className="rounded-3xl bg-mood-mint ring-1 ring-creamShade shadow-soft p-6 sm:p-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 id="bq-title" className="display text-display-md text-cocoa">
            What did <span className="display-italic text-syrup">you</span> eat for breakfast?
          </h2>
          <p className="text-cocoa/80 mt-2">Pick your morning vibe — totally anon, just main-character fun. Fr fr.</p>
        </div>

        <ul className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto">
          {OPTIONS.map((o, i) => {
            const active = picked === o.id;
            return (
              <li key={o.id}>
                <motion.button
                  type="button"
                  onClick={() => setPicked(o.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className={`w-full rounded-2xl ring-1 transition-all px-3 py-3 text-cocoa font-semibold ${
                    active ? 'bg-pancake ring-syrup shadow-lifted' : 'bg-cream ring-creamShade shadow-soft hover:shadow-lifted'
                  }`}
                  aria-pressed={active}
                >
                  <span className="block text-3xl">{o.emoji}</span>
                  <span className="block text-xs mt-1">{o.label}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        {picked && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-cocoa mt-6 text-sm"
          >
            <span className="display-italic text-syrup">Ate that — {OPTIONS.find(o => o.id === picked)?.label} aura unlocked.</span> The squad pulled up. Bussin, no cap.
          </motion.p>
        )}
      </div>
    </section>
  );
}
