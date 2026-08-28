import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import { toast } from "sonner";
import { isAxiosError } from "axios";

// Any query/mutation older than this, restored from a previous session, is
// considered too stale to serve offline and is dropped instead.
export const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
// Bump this if the shape of cached data changes in a future release, so old
// (incompatible) persisted caches get discarded instead of causing errors.
export const PERSIST_BUSTER = "v1";

export const idbPersister = createAsyncStoragePersister({
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

export const queryClient = new QueryClient({
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
      // once the browser comes back online (see resumePausedMutations in
      // the query provider for the "was offline across a full reload" case).
      // The AI chat mutation opts out of this (networkMode: "always") since
      // a queued message replayed hours later makes no sense.
      networkMode: "online",
    },
  },
});

/**
 * Wipes every trace of the signed-out user's data from this device: the
 * in-memory query cache and the IndexedDB blob it's persisted to for
 * offline use. Called on both manual logout and forced logout (expired
 * session) so a shared/public device never keeps another person's
 * transactions, balances, etc. around after they sign out.
 */
export async function clearLocalUserData() {
  queryClient.clear();
  // clear() removes queries/mutations one by one, and the persist
  // subscription auto-saves on every one of those events — so a stale,
  // partially-cleared snapshot can still be mid-write (queued behind the
  // persister's 1s throttle) right after this call returns. Let that settle
  // to its final (fully empty) auto-save before deleting, otherwise that
  // straggling write can land after removeClient() and resurrect the cache.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await idbPersister.removeClient();
}
