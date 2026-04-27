'use client';

/**
 * BackgroundProvider — decides which decorative background to render based on
 * the current pathname.
 *
 *   /          → no global bg (Hero owns its own breakfast-world banner photo)
 *   anything else → <OtherPagesBackground /> (the new "other pages bg" image
 *                  with floating breakfast items)
 *
 * Why a separate provider component: the layout.tsx is a server component, so
 * it can't read the pathname directly. This client component can.
 */

import { usePathname } from 'next/navigation';
import { OtherPagesBackground } from './OtherPagesBackground';
import { RainOverlay } from './RainOverlay';

export function BackgroundProvider() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      {/* OtherPagesBackground only on non-home routes (home owns its own
          breakfast-world banner photo). */}
      {!isHo