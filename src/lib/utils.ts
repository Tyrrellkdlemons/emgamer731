import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const SITE = {
  name: 'EMGamer731',
  alt: 'eatsswithemm',
  slogan: 'What did you guys eat for breakfast today?',
  tagline: 'Eat well. Game better.',
  // Use || (not ??) so empty-string env vars fall through to the default.
  // Netlify sometimes sets keys to "" when imported from .env.example.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://emgamer731.com',
  youtube: 'https://www.youtube.com/channel/UCnSbDaREAHiITX2UPjE44fA',
  tiktok: 'https://www.tiktok.com/@eatsswithemm',
};
