import { NextResponse } from 'next/server';
import { getLiveSummary } from '@/lib/live-status';

export const revalidate = 60;
export const runtime = 'nodejs';

export async function GET() {
  const summary = await getLiveSummary();
  return NextResponse.json(summary, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
