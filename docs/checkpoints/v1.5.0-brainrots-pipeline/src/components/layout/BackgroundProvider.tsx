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

export function BackgroundProvider() {
  const pathname = usePathname();
  // Home owns its own background — keep the breakfast-world banner photo
  // exactly as it is. For every other route, layer the new bg + floats behind.
  if (pathname === '/') return null;
  return <OtherPagesBackground />;
}
