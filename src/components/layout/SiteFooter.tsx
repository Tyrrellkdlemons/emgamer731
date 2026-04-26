import Link from 'next/link';
import { FOOTER_NAV, SOCIAL_LINKS } from '@/data/nav';
import { SITE } from '@/lib/utils';
import { Logo } from '@/components/layout/Logo';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-creamShade bg-cream">
      <div className="container-soft py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" />
          <p className="display-italic text-cocoa/80 mt-3 max-w-md">
            "{SITE.slogan}"
          </p>
          <p className="text-sm text-muted mt-3">
            The cozy-glossy creator HQ — Roblox + breakfast + livestreaming.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-cocoa mb-3">Site</div>
          <ul className="space-y-2 text-sm">
            {FOOTER_NAV.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-cocoa/80 hover:text-cocoa">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-cocoa mb-3">Find EMM</div>
          <ul className="space-y-2 text-sm">
            {SOCIAL_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-cocoa/80 hover:text-cocoa">{l.label} →</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-creamShade">
        <div className="container-soft py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted">
          <p>© {new Date().getFullYear()} {SITE.name} · by EMGamer731 · eat well, game better</p>
          <p>Built with care for the breakfast squad. Privacy-first. Kid-friendly.</p>
        </div>
      </div>
    </footer>
  );
}
