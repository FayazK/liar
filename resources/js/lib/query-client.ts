import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure the TanStack Query client.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // How long data stays "fresh" before refetching
            staleTime: 5 * 60 * 1000, // 5 minutes
            // How long unused data stays in cache
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
            // Retry failed requests
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for real-time data
            refetchOnWindowFocus: false,
            // Keep previous data while fetching new data
            placeholderData: (previousData: unknown) => previousData,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});

export default queryClient;
