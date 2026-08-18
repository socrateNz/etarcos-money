"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const message = isAxiosError(error) 
              ? error.response?.data?.message || error.message 
              : error.message;
            toast.error(message || "Une erreur est survenue.");
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            const message = isAxiosError(error) 
              ? error.response?.data?.message || error.message 
              : error.message;
            toast.error(message || "Une erreur est survenue lors de l'opération.");
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
