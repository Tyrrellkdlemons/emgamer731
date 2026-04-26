import { Hero } from '@/components/sections/Hero';
import { LatestContent } from '@/components/sections/LatestContent';
import { CollectionsRail } from '@/components/sections/CollectionsRail';
import { FeaturedMerch } from '@/components/sections/FeaturedMerch';
import { BreakfastOfTheDay } from '@/components/sections/BreakfastOfTheDay';
import { BreakfastQuestion } from '@/components/sections/BreakfastQuestion';
import { PlatformCards } from '@/components/sections/PlatformCards';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BreakfastOfTheDay />
      <LatestContent />
      <CollectionsRail />
      <FeaturedMerch />
      <BreakfastQuestion />
      <PlatformCards />
    </>
  );
}
