'use client';

/**
 * unlock-store.ts — client-side reward credit + unlock ledger.
 *
 * The "subscribe + watch shorts/replays = free unlock" funnel that promotes
 * EMM's YouTube growth needs to (a) track how many credits a visitor has
 * earned and (b) which figures they've already unlocked. We keep this in
 * localStorage (privacy-first — never leaves the browser) and expose a
 * tiny pub/sub so any component can react.
 *
 * Schema (versioned with `schema:1` so future migrations don't break old
 * keys):
 *   emg731:unlocks:v1 = {
 *     credits: number,            // earned but unspent
 *     unlocked: string[],         // figure ids
 *     watched: { shorts: string[], replays: string[] },
 *     subscribed: boolean,        // YT subscribe attestation
 *     followed: boolean,          // TikTok follow attestation
 *     updatedAt: ISO,
 *   }
 *
 * The subscribe/follow are HONOR-BOX flags — we can't verify they actually
 * subscribed from the browser, so we let them self-attest after clicking
 * the YouTube/TikTok button. The reward keeps the funnel alive.
 */

const KEY = 'emg731:unlocks:v1';

export type UnlockState = {
  credits: number;
  unlocked: string[];
  watched: { shorts: string[]; replays: string[] };
  subscribed: boolean;
  followed: boolean;
  updatedAt: string;
};

function empty(): UnlockState {
  return {
    credits: 0,
    unlocked: [],
    watched: { shorts: [], replays: [] },
    subscribed: false,
    followed: false,
    updatedAt: new Date().toISOString(),
  };
}

export function readUnlocks(): UnlockState {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<UnlockState>;
    return {
      credits:    parsed.credits ?? 0,
      unlocked:   parsed.unlocked ?? [],
      watched:    {
        shorts:  parsed.watched?.shorts  ?? [],
        replays: parsed.watched?.replays ?? [],
      },
      subscribed: !!parsed.subscribed,
      followed:   !!parsed.followed,
      updatedAt:  parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return empty();
  }
}

function write(state: UnlockState) {
  if (typeof window === 'undefined') return;
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('emg731:unlocks:changed', { detail: state }));
  } catch {}
}

/** Mark a YouTube short as watched. Returns the new state. */
export function recordShortWatched(id: string, shortsPerCredit: number): UnlockState {
  const s = readUnlocks();
  if (!s.watched.shorts.includes(id)) {
    s.watched.shorts.push(id);
    if (s.watched.shorts.length % shortsPerCredit === 0) s.credits += 1;
  }
  write(s);
  return s;
}

/** Mark a replay as watched. */
export function recordReplayWatched(id: string, replaysPerCredit: number): UnlockState {
  const s = readUnlocks();
  if (!s.watched.replays.includes(id)) {
    s.watched.replays.push(id);
    if (s.watched.replays.length % replaysPerCredit === 0) s.credits += 1;
  }
  write(s);
  return s;
}

/** Honor-box subscribe/follow attestation grants 1 credit, once. */
export function attestSubscribed(): UnlockState {
  const s = readUnlocks();
  if (!s.subscribed) {
    s.subscribed = true;
    s.credits += 1;
  }
  write(s);
  return s;
}
export function attestFollowed(): UnlockState {
  const s = readUnlocks();
  if (!s.followed) {
    s.followed = true;
    s.credits += 1;
  }
  write(s);
  return s;
}

/** Spend 1 credit to unlock a figure. Returns true if successful. */
export function spendUnlock(figureId: string): { ok: boolean; state: UnlockState } {
  const s = readUnlocks();
  if (s.unlocked.includes(figureId)) return { ok: true, state: s };
  if (s.credits < 1) return { ok: false, state: s };
  s.credits -= 1;
  s.unlocked.push(figureId);
  write(s);
  return { ok: true, state: s };
}

/** Subscribe to credit changes (returns unsubscribe fn). */
export function subscribeUnlocks(cb: (s: UnlockState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<UnlockState>).detail ?? readUnlocks());
  window.addEventListener('emg731:unlocks:changed', handler);
  return () => window.removeEventListener('emg731:unlocks:changed', handler);
}
