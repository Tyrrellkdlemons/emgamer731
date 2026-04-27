import { NextResponse } from 'next/server';
import { todaysPick, BREAKFAST_POOL } from '@/data/breakfast-of-the-day';

export const revalidate = 600;

export async function GET() {
  return NextResponse.json({
    today: todaysPick(),
    pool: BREAKFAST_POOL,
    fetchedAt: new Date().toISOString(),
  });
}
