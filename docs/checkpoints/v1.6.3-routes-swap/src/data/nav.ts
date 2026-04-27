export const PRIMARY_NAV = [
  { href: '/', label: 'Home' },
  { href: '/live', label: 'Live' },
  { href: '/watch', label: 'Watch' },
  { href: '/eats', label: 'Eats' },
  { href: '/gallery', label: 'Brainrots' },
  { href: '/breakfacts', label: 'Breakfacts' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/shop', label: 'Merch' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/about', label: 'About' },
] as const;

export const FOOTER_NAV = [
  { href: '/links', label: 'All links' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About EMM' },
  { href: '/community', label: 'Community' },
] as const;

export const SOCIAL_LINKS = [
  { href: 'https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA', label: 'YouTube', platform: 'youtube' as const },
  { href: 'https://www.ti