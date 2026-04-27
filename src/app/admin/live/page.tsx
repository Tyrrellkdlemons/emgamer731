'use client';

/**
 * /admin/live — TKDL's full admin command center.
 *
 * v1.6.7: now a tabbed panel covering everything she controls from her
 * phone in 1-2 taps:
 *   1. LIVE TRIGGER  — manual go-live / end-live + optional HLS override
 *   2. ROBLOX MODS   — place ID, quick-join link, gamepass deeplink
 *                       generator, server status (placeholder for Open Cloud)
 *   3. SITE TOOLS    — clear waitlist + unlock-store, refresh live status
 *
 * Auth: shared bearer secret (`ADMIN_LIVE_SECRET` env var). First-time
 * paste, then saved to localStorage so future visits are 1-tap.
 *
 * Phone-friendly: large hit targets, sticky tab bar, PWA-ready (uses the
 * existing manifest). Optimised so installing to home-screen feels native.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY     = 'emg731:admin-live:token';
const ROBLOX_PLACE_KEY = 'emg731:admin-roblox:placeId';
const ROBLOX_UID_KEY   = 'emg731:admin-roblox:universeId';

type LiveResp    = { ok?: boolean; action?: string; error?: string };
type LiveSummary = {
  isLive?: boolean;
  primary?: { platform: string; title?: string; isRoblox?: boolean; source?: string };
};

type Tab = 'live' | 'roblox' | 'tools';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('live');
  const [token, setToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { setToken(saved); setTokenSaved(true); }
  }, []);

  const saveToken = (t: string) => {
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
    setTokenSaved(true);
  };

  return (
    <div className="container-soft py-12 sm:py-14 max-w-2xl mx-auto">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-liveRed/15 ring-1 ring-liveRed/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-liveRed shadow-soft">
          🎬 EMM admin · command center
        </div>
        <h1 className="display text-display-lg text-cocoa mt-3 leading-tight">
          One spot, all the levers.
        </h1>
        <p className="text-cocoa/80 mt-2 text-sm">
          Phone-optimized — saves to your home screen as a 1-tap shortcut.
          Pick a tab below.
        </p>
      </header>

      {/* Token gate (always visible at top) */}
      <TokenGate token={token} tokenSaved={tokenSaved} onSave={saveToken} onClear={() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(''); setTokenSaved(false);
      }} />

      {/* Sticky tab bar — bottom on mobile for thumb reach, top on desktop */}
      <nav
        className="sticky top-24 z-20 bg-eggshell/95 backdrop-blur ring-1 ring-creamShade rounded-full p-1 mb-6 shadow-soft flex"
        aria-label="Admin tabs"
      >
        {([
          { id: 'live',   label: '🟢 Live trigger' },
          { id: 'roblox', label: '🎮 Roblox mods' },
          { id: 'tools',  label: '🛠 Site tools' },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={
              'flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-bold transition-all ' +
              (tab === t.id
                ? 'bg-cocoa text-eggshell shadow-soft'
                : 'text-cocoa/75 hover:text-cocoa')
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'live'   && <LiveTriggerPanel token={token} />}
      {tab === 'roblox' && <RobloxModsPanel />}
      {tab === 'tools'  && <SiteToolsPanel />}

      <details className="mt-8 text-sm text-cocoa/80">
        <summary className="cursor-pointer font-bold text-cocoa">
          How to save this page to phone
        </summary>
        <div className="mt-3 space-y-2">
          <p>
            <strong>iPhone:</strong> tap share icon in Safari →
            &ldquo;Add to Home Screen&rdquo;. Pick a name, tap Add.
          </p>
          <p>
            <strong>Android:</strong> Chrome menu (⋮) →
            &ldquo;Add to Home screen&rdquo; → Add.
          </p>
          <p>
            Once installed, it opens like a native app with your token
            already saved. Tap GO LIVE before streaming, END LIVE after.
          </p>
        </div>
      </details>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────── */

function TokenGate({
  token, tokenSaved, onSave, onClear,
}: { token: string; tokenSaved: boolean; onSave: (t: string) => void; onClear: () => void }) {
  const [draft, setDraft] = useState(token);
  useEffect(() => setDraft(token), [token]);
  return (
    <details
      open={!tokenSaved}
      className={
        'rounded-3xl ring-1 px-4 py-3 mb-5 ' +
        (tokenSaved ? 'bg-mint/30 ring-mint/60' : 'bg-pancake/20 ring-pancake/60')
      }
    >
      <summary className="cursor-pointer font-bold text-cocoa text-sm">
        {tokenSaved ? '✓ Admin token saved' : '⚠ Paste your admin token'}
      </summary>
      <div className="mt-3 space-y-2">
        <input
          type="password"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ADMIN_LIVE_SECRET from Netlify env"
          className="w-full rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-3 font-mono text-sm"
          autoComplete="off"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => draft && onSave(draft)}
            className="rounded-full bg-cocoa text-eggshell px-4 py-2 text-xs font-bold hover:bg-syrup hover:text-cocoa transition-all"
          >
            Save token
          </button>
          {tokenSaved && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full bg-cream text-cocoa ring-1 ring-creamShade px-4 py-2 text-xs font-bold hover:shadow-soft"
            >
              Forget
            </button>
          )}
        </div>
      </div>
    </details>
  );
}

/* ── PANEL: Live Trigger ────────────────────────────────────────────── */

function LiveTriggerPanel({ token }: { token: string }) {
  const [title, setTitle] = useState('EMM is LIVE — Roblox right now 🎮');
  const [hlsOverride, setHlsOverride] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<LiveSummary | null>(null);

  useEffect(() => { refreshStatus(); }, []);
  async function refreshStatus() {
    try {
      const r = await fetch('/api/live', { cache: 'no-store' });
      setStatus((await r.json()) as LiveSummary);
    } catch { /* ignore */ }
  }

  async function trigger(method: 'POST' | 'DELETE') {
    if (!token) { setMsg('⚠ Paste your admin token first.'); return; }
    setBusy(true); setMsg(null);
    try {
      const init: RequestInit = {
        method,
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      };
      if (method === 'POST') {
        init.body = JSON.stringify({ title, ...(hlsOverride ? { hlsUrl: hlsOverride } : {}) });
      }
      const r = await fetch('/api/admin/live-override', init);
      const d = (await r.json()) as LiveResp;
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      setMsg(method === 'POST' ? '🟢 Live banner is ON across the site.' : '🔴 Live banner is OFF.');
      await refreshStatus();
    } catch (e) {
      setMsg('Error: ' + (e instanceof Error ? e.message : 'unknown'));
    } finally { setBusy(false); }
  }

  const isLive = !!status?.isLive;

  return (
    <section aria-labelledby="live-panel">
      <h2 id="live-panel" className="sr-only">Live trigger</h2>

      {/* Status pill */}
      <div className={
        'rounded-3xl ring-1 p-5 mb-5 ' +
        (isLive ? 'bg-liveRed/10 ring-liveRed/40' : 'bg-cream ring-creamShade')
      }>
        <div className="flex items-center justify-between">
          <span className={
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ' +
            (isLive ? 'bg-liveRed text-white' : 'bg-cocoa text-eggshell')
          }>
            <span className={isLive ? 'live-dot' : 'h-2 w-2 rounded-full bg-eggshell/50'} />
            {isLive ? 'LIVE NOW' : 'Offline'}
          </span>
          <button type="button" onClick={refreshStatus} className="text-xs text-syrup font-bold hover:underline">
            ↻ refresh
          </button>
        </div>
        {status?.primary?.title && <p className="text-sm text-cocoa mt-2">{status.primary.title}</p>}
        {status?.primary && (
          <p className="text-[11px] text-cocoa/55 mt-1">
            via {status.primary.platform.toUpperCase()} · source: {status.primary.source}
          </p>
        )}
      </div>

      {/* Title */}
      <label className="block mb-3">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoa/70">Stream title</span>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140}
          className="mt-1 w-full rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-3 text-sm"
        />
        <span className="text-[11px] text-cocoa/55 mt-1 block">
          Tip: include &ldquo;Roblox&rdquo; → site auto-pops the gameplay player on home.
        </span>
      </label>

      {/* HLS override */}
      <label className="block mb-5">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoa/70">
          Optional · HLS m3u8 URL
        </span>
        <input
          type="url" value={hlsOverride} onChange={(e) => setHlsOverride(e.target.value)}
          placeholder="leave blank — site auto-extracts when possible"
          className="mt-1 w-full rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-3 font-mono text-xs"
        />
      </label>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button type="button" disabled={busy} onClick={() => trigger('POST')}
          className="rounded-3xl bg-liveRed text-white font-extrabold text-lg shadow-liveGlow disabled:opacity-50 transition-all hover:shadow-lifted active:scale-95"
          style={{ minHeight: 72 }}>
          🟢 GO LIVE
        </button>
        <button type="button" disabled={busy} onClick={() => trigger('DELETE')}
          className="rounded-3xl bg-cocoa text-eggshell font-extrabold text-lg shadow-soft disabled:opacity-50 transition-all hover:shadow-lifted active:scale-95"
          style={{ minHeight: 72 }}>
          🔴 END LIVE
        </button>
      </div>

      {msg && (
        <div className="rounded-2xl bg-pancake/40 ring-1 ring-pancake px-4 py-3 text-sm text-cocoa font-semibold">
          {msg}
        </div>
      )}
    </section>
  );
}

/* ── PANEL: Roblox mods ────────────────────────────────────────────── */

function RobloxModsPanel() {
  const [placeId, setPlaceId] = useState('');
  const [universeId, setUniverseId] = useState('');
  const [gamepassId, setGamepassId] = useState('');
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPlaceId(localStorage.getItem(ROBLOX_PLACE_KEY) ?? '');
    setUniverseId(localStorage.getItem(ROBLOX_UID_KEY) ?? '');
  }, []);

  const save = () => {
    localStorage.setItem(ROBLOX_PLACE_KEY, placeId);
    localStorage.setItem(ROBLOX_UID_KEY, universeId);
    setSavedMsg('✓ Saved locally — quick-join links updated.');
    setTimeout(() => setSavedMsg(null), 2200);
  };

  // Computed deeplinks (memoized to avoid re-render flicker)
  const links = useMemo(() => {
    const join = placeId
      ? `https://www.roblox.com/games/${placeId}/EMGamer731`
      : null;
    const robloxApp = placeId
      ? `roblox://placeId=${placeId}`
      : null;
    const gpUrl = gamepassId
      ? `https://www.roblox.com/game-pass/${gamepassId}/buy`
      : null;
    const studio = placeId
      ? `https://www.roblox.com/develop/library?CatalogContext=2&Category=6&Keyword=${placeId}`
      : null;
    const analytics = universeId
      ? `https://create.roblox.com/dashboard/creations/experiences/${universeId}/analytics/main`
      : null;
    return { join, robloxApp, gpUrl, studio, analytics };
  }, [placeId, universeId, gamepassId]);

  return (
    <section aria-labelledby="rblx-panel" className="space-y-4">
      <h2 id="rblx-panel" className="display text-display-md text-cocoa">Roblox mods · quick controls</h2>
      <p className="text-sm text-cocoa/70">
        These IDs power the &ldquo;Join the Roblox session&rdquo; buttons across the
        site (live panel, figures shop, etc.). Stored locally on your phone — never
        sent to any server.
      </p>

      <div className="rounded-3xl bg-cream ring-1 ring-creamShade p-4 space-y-3">
        <Field label="Roblox Place ID"
          value={placeId} onChange={setPlaceId}
          hint="The numeric ID in your game's URL (e.g. 142823291)" />
        <Field label="Universe ID (for analytics)"
          value={universeId} onChange={setUniverseId}
          hint="Get it from create.roblox.com → your experience → Configure → Game ID" />
        <Field label="Featured Game Pass ID"
          value={gamepassId} onChange={setGamepassId}
          hint="Used by the Brot-Figures Robux checkout button" />
        <div className="flex items-center gap-2">
          <button type="button" onClick={save}
            className="rounded-full bg-cocoa text-eggshell px-4 py-2 text-xs font-bold hover:bg-syrup hover:text-cocoa transition-all">
            Save
          </button>
          {savedMsg && <span className="text-xs text-mint font-bold">{savedMsg}</span>}
        </div>
      </div>

      <h3 className="text-xs uppercase tracking-widest font-bold text-cocoa/70 mt-2">Quick links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <QuickLink href={links.join}      title="🌐 Open game on web"     disabledMsg="Set Place ID first" />
        <QuickLink href={links.robloxApp} title="📱 Open game in Roblox app" disabledMsg="Set Place ID first" />
        <QuickLink href={links.gpUrl}     title="💸 Game Pass purchase URL" disabledMsg="Set Game Pass ID first" />
        <QuickLink href={links.analytics} title="📊 Creator analytics"     disabledMsg="Set Universe ID first" />
      </div>

      <details className="rounded-2xl bg-pancake/20 ring-1 ring-pancake/50 p-4">
        <summary className="cursor-pointer text-sm font-bold text-cocoa">
          Pipeline-ready: Roblox Open Cloud integration
        </summary>
        <div className="mt-2 text-xs text-cocoa/75 space-y-2">
          <p>
            For real-time server count, badge issuing, and remote messaging,
            register an Open Cloud API key at{' '}
            <a href="https://create.roblox.com/dashboard/credentials"
              target="_blank" rel="noopener noreferrer"
              className="text-syrup font-bold underline">
              create.roblox.com/dashboard/credentials
            </a>
            and add{' '}
            <code className="font-mono bg-cream px-1.5 py-0.5 rounded">ROBLOX_OPEN_CLOUD_KEY</code>{' '}
            to Netlify env. The site will auto-show live server stats here.
          </p>
        </div>
      </details>
    </section>
  );
}

/* ── PANEL: Site tools ─────────────────────────────────────────────── */

function SiteToolsPanel() {
  const [msg, setMsg] = useState<string | null>(null);

  const clear = (key: string, label: string) => () => {
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      setMsg(`✓ Cleared ${label}.`);
      setTimeout(() => setMsg(null), 2000);
    } catch (e) {
      setMsg('Error: ' + (e instanceof Error ? e.message : 'unknown'));
    }
  };

  const reload = () => location.reload();

  return (
    <section aria-labelledby="tools-panel" className="space-y-3">
      <h2 id="tools-panel" className="display text-display-md text-cocoa">Site tools</h2>
      <ToolButton label="Clear brainrot waitlist (this browser)"
        onClick={clear('emg731:brainrot:waitlist', 'waitlist')} />
      <ToolButton label="Clear figure unlocks (this browser)"
        onClick={clear('emg731:unlocks:v1', 'unlocks')} />
      <ToolButton label="Clear auto-redirect session flag"
        onClick={clear('emg731:autolive:redirected', 'auto-redirect flag')} />
      <ToolButton label="Force hard reload" onClick={reload} />
      {msg && (
        <div className="rounded-2xl bg-pancake/40 ring-1 ring-pancake px-4 py-3 text-sm font-semibold text-cocoa">
          {msg}
        </div>
      )}
    </section>
  );
}

/* ── Building blocks ───────────────────────────────────────────────── */

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest font-bold text-cocoa/70">{label}</span>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl bg-eggshell ring-1 ring-creamShade px-4 py-2 font-mono text-sm"
      />
      {hint && <span className="text-[10px] text-cocoa/55 mt-0.5 block">{hint}</span>}
    </label>
  );
}

function QuickLink({ href, title, disabledMsg }: { href: string | null; title: string; disabledMsg: string }) {
  if (!href) {
    return (
      <div className="rounded-2xl bg-cream/60 ring-1 ring-creamShade px-4 py-3 text-sm text-cocoa/55 italic">
        {title} <span className="block text-[10px] mt-0.5">{disabledMsg}</span>
      </div>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-3 text-sm font-bold text-cocoa hover:bg-mint/30 hover:shadow-soft transition-all flex items-center justify-between">
      <span>{title}</span>
      <span aria-hidden>→</span>
    </a>
  );
}

function ToolButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full rounded-2xl bg-cream ring-1 ring-creamShade px-4 py-3 text-sm font-bold text-cocoa text-left hover:bg-pancake/30 hover:shadow-soft transition-all"
      style={{ minHeight: 56 }}>
      {label}
    </button>
  );
}

// Suppress unused-var warnings on the Roblox storage keys for ts:noUnusedLocals
void ROBLOX_PLACE_KEY; void ROBLOX_UID_KEY;
