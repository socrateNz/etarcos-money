"use client";

import { useState } from "react";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import { toast } from "sonner";
import { isAxiosError } from "axios";

// Any query/mutation older than this, restored from a previous session, is
// considered too stale to serve offline and is dropped instead.
const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
// Bump this if the shape of cached data changes in a future release, so old
// (incompatible) persisted caches get discarded instead of causing errors.
const PERSIST_BUSTER = "v1";

const idbPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get(key),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
  key: "tacynt-money-query-cache",
});

function errorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    return error.response?.data?.message || (error.request && !error.response ? undefined : error.message) || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // A network error while offline just means "waiting to sync" —
            // offlineFirst already serves cached data, so don't alarm the user.
            if (isAxiosError(error) && error.request && !error.response) return;
            toast.error(errorMessage(error, "Une erreur est survenue."));
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(errorMessage(error, "Une erreur est survenue lors de l'opération."));
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: PERSIST_MAX_AGE,
            retry: 2,
            refetchOnWindowFocus: false,
            // Serve cached data immediately (crucial while offline) and only
            // refetch in the background when a connection is actually available.
            networkMode: "offlineFirst",
          },
          mutations: {
            // Default for almost every mutation in the app: if there's no
            // connection, pause instead of failing — it fires automatically
            // once the browser comes back online (see resumePausedMutations
            // below for the "was offline across a full reload" case). The AI
            // chat mutation opts out of this (networkMode: "always") since a
            // queued message replayed hours later makes no sense.
            networkMode: "online",
          },
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: idbPersister,
        maxAge: PERSIST_MAX_AGE,
        buster: PERSIST_BUSTER,
        dehydrateOptions: {
          // Persist paused (offline-queued) mutations too, so an action taken
          // offline still syncs later even if the app was closed/reloaded
          // before the connection came back.
          shouldDehydrateMutation: () => true,
        },
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
