import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 *
 * Best practices applied:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - gcTime: 10 minutes - Unused data is garbage collected after 10 minutes
 * - retry: 1 - Only retry failed requests once
 * - refetchOnWindowFocus: false - Don't refetch when window regains focus
 * - refetchOnMount: false - Don't refetch when component mounts if data exists
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
