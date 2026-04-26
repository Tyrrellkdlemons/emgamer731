'use client';

import { createContext, useContext } from 'react';
import useSWR from 'swr';
import type { LiveSummary } from '@/lib/live-status';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Ctx = {
  summary: LiveSummary | undefined;
  isLoading: boolean;
};

const LiveContext = createContext<Ctx>({ summary: undefined, isLoading: true });

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useSWR<LiveSummary>('/api/live', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    dedupingInterval: 30_000,
  });

  return <LiveContext.Provider value={{ summary: data, isLoading }}>{children}</LiveContext.Provider>;
}

export const useLiveStatus = () => useContext(LiveContext);
