import { Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { LatestContent } from '@/components/sections/LatestContent';
import { CollectionsRail } from '@/components/sections/CollectionsRail';
import { FeaturedMerch } from '@/components/sections/FeaturedMerch';
import { BreakfastOfTheDay } from '@/components/sections/BreakfastOfTheDay';
import { BreakfastQuestion } from '@/components/sections/BreakfastQuestion';
import { PlatformCards } from '@/components/sections/PlatformCards';
import { AvatarFitsRail } from '@/components/sections/AvatarFitsRail';
import { AutoLiveRedirect } from '@/components/live/AutoLiveRedirect';

export default function HomePage() {
  return (
    <>
      {/* When EMM is live, send fresh visitors straight to the inline player.
          Wrapped in Suspense because it reads useSearchParams() (Next requires
          a Suspense boundary for that hook in App Router). */}
      <Suspense fallback={null}>
        <AutoLiveRedirect />
      </Suspense>
      <Hero />
      <BreakfastOfTheDay />
      <AvatarFitsRail />
      <LatestContent />
      <CollectionsRail />
      <FeaturedMerch />
      <BreakfastQuestion />
      <PlatformCards />
    </>
  );
}
