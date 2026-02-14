/**
 * TanStack Query client. Used by app layer to provide QueryClientProvider.
 * Kept in shared so presentation only imports from app for the provider.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});
