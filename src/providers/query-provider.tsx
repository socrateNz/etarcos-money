"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, idbPersister, PERSIST_MAX_AGE, PERSIST_BUSTER } from "@/lib/query-client";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
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
