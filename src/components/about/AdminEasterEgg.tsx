'use client';

/**
 * AdminEasterEgg — hidden access portal to /admin/live from the About page.
 *
 * Two tap patterns unlock the admin link briefly:
 *
 *   1. Tap the special "🥞" emoji 7 times within 5 seconds (visible to
 *      anyone but cryptic in purpose). On the 7th tap, the EM logo
 *      momentarily winks gold and the floating admin chip slides in
 *      bottom-right for 12 seconds.
 *
 *   2. Long-press the slogan italic phrase ("what did you guys eat for
 *      breakfast today?") for 2 full seconds — same reveal animation.
 *
 *   3. Konami-ish keyboard shortcut: type `emadmin` anywhere on the
 *      page → reveal. (Desktop convenience; doesn't fire on mobile
 *      since there's no keyboard.)
 *
 * Why a reveal-on-trigger instead of a static link:
 *   - The about page is publicly indexed — keeping a visible /admin link
 *     would invite drive-by attempts.
 *   - The token gate on /admin/live still gates real access (this just
 *     hides the URL from casual eyes).
 *   - Easter eggs feel on-brand for the playful tone of the site.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const TAP_TARGET = 7;
const TAP_WINDOW_MS = 5000;
const PRESS_DURATION_MS = 2000;
const SECRET_KEYS = 'emadmin';
const REVEAL_MS = 12000;

export function AdminEasterEgg() {
  const [revealed, setRevealed] = useState(false);
  const tapsRef = useRef<number[]>([]);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyBufferRef = useRef('');

  // Auto-hide the chip after REVEAL_MS so it doesn't linger
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setRevealed(false), REVEAL_MS);
    return () => clearTimeout(t);
  }, [revealed]);

  // Keyboard sequence handler (typing "emadmin")
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-SECRET_KEYS.length);
      if (keyBufferRef.current === SECRET_KEYS) {
        setRevealed(true);
        keyBufferRef.current = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onPancakeTap = () => {
    const now = Date.now();
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    tapsRef.current.push(now);
    if (tapsRef.current.length >= TAP_TARGET) {
      setRevealed(true);
      tapsRef.current = [];
    }
  };

  const onSloganPressDown = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => setRevealed(true), PRESS_DURATION_MS);
  };
  const onSloganPressUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  return (
    <>
      {/* Pancake emoji tap target — looks decorative but counts taps */}
      <span
        role="button"
        tabIndex={-1}
        aria-hidden
        onClick={onPancakeTap}
        title=""
        className="aee-pancake inline-block ml-1 cursor-default select-none"
        style={{ fontSize: '1.1em' }}
      >
        🥞
      </span>

      {/* Long-press handler attached to the italic slogan span */}
      <span
        aria-hidden
        className="aee-press-zone fixed inset-0 pointer-events-none"
      />

      {/* Reveal chip — slides up from bottom-right when triggered */}
      {revealed && (
        <Link
          href="/admin/live"
          className="aee-chip fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-cocoa text-eggshell px-4 py-3 text-sm font-extrabold shadow-lifted ring-2 ring-pancake/70 hover:bg-syrup hover:text-cocoa transition-all"
        >
          <span aria-hidden>🎬</span> Open admin command center →
        </Link>
      )}

      <style jsx>{`
        .aee-chip {
          animation: aee-slide-in 0.4s cubic-bezier(0.32, 0.72, 0, 1);
        }
        @keyframes aee-slide-in {
          from { transform: translateY(20px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
      `}</style>

      {/* Hook the long-press onto the slogan span via global pointerdown
          listeners so we don't have to refactor the slogan markup. */}
      <SloganLongPressBinder onDown={onSloganPressDown} onUp={onSloganPressUp} />
    </>
  );
}

function SloganLongPressBinder({ onDown, onUp }: { onDown: () => void; onUp: () => void }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const slogan = document.querySelector('.display-italic.text-syrup');
    if (!slogan) return;
    slogan.addEventListener('pointerdown', onDown);
    slogan.addEventListener('pointerup',   onUp);
    slogan.addEventListener('pointerleave', onUp);
    return () => {
      slogan.removeEventListener('pointerdown', onDown);
      slogan.removeEventListener('pointerup',   onUp);
      slogan.removeEventListener('pointerleave', onUp);
    };
  }, [onDown, onUp]);
  return null;
}
