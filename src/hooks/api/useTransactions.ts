import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionQueries, QUERY_KEYS } from "@/queries";

export function useTransactions() {
  const queryClient = useQueryClient();

  // Fetch transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: transactionQueries.getAll,
  });

  // Delete transaction
  const deleteMutation = useMutation({
    mutationFn: transactionQueries.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      // The backend reverses the account balance on delete — without this,
      // the accounts list (and anywhere it's read from, e.g. account
      // dropdowns) keeps showing the pre-delete balance until something else
      // happens to refetch it.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });

  // Create transaction — optimistic, so it shows up instantly (including
  // while offline: onMutate always runs first, the actual request is what
  // gets paused/queued by the app-wide offline mutation handling).
  const createMutation = useMutation({
    mutationFn: transactionQueries.create,
    onMutate: async (newTx: any) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.transactions.all });
      const previous = queryClient.getQueryData<any[]>(QUERY_KEYS.transactions.all);

      const categories = queryClient.getQueryData<any[]>(QUERY_KEYS.categories);
      const accounts = queryClient.getQueryData<any[]>(QUERY_KEYS.accounts);
      const category = categories?.find((c) => c._id === newTx.categoryId);
      const account = accounts?.find((a) => (a.id || a._id) === newTx.accountId);

      const optimisticTx = {
        ...newTx,
        _id: `optimistic-${Date.now()}`,
        categoryId: category
          ? { _id: category._id, name: category.name, icon: category.icon, color: category.color }
          : undefined,
        accountId: account ? { _id: account.id || account._id, name: account.name, type: account.type } : newTx.accountId,
        createdAt: new Date().toISOString(),
        _optimistic: true,
      };

      queryClient.setQueryData<any[]>(QUERY_KEYS.transactions.all, (old) => [optimisticTx, ...(old || [])]);

      return { previous };
    },
    onError: (_err, _newTx, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.transactions.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });

  // Update transaction — optimistic on the list, balances are recomputed
  // server-side so accounts/dashboard are refetched once it settles.
  const updateMutation = useMutation({
    mutationFn: transactionQueries.update,
    onMutate: async ({ id, data }: { id: string | number; data: Record<string, any> }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.transactions.all });
      const previous = queryClient.getQueryData<any[]>(QUERY_KEYS.transactions.all);

      const categories = queryClient.getQueryData<any[]>(QUERY_KEYS.categories);
      const accounts = queryClient.getQueryData<any[]>(QUERY_KEYS.accounts);

      queryClient.setQueryData<any[]>(QUERY_KEYS.transactions.all, (old) =>
        (old || []).map((tx) => {
          if (tx._id !== id) return tx;
          const next: any = { ...tx, ...data };
          if (data.categoryId !== undefined) {
            const category = categories?.find((c) => c._id === data.categoryId);
            next.categoryId = category
              ? { _id: category._id, name: category.name, icon: category.icon, color: category.color }
              : undefined;
          }
          if (data.accountId !== undefined) {
            const account = accounts?.find((a) => (a.id || a._id) === data.accountId);
            next.accountId = account
              ? { _id: account.id || account._id, name: account.name, type: account.type }
              : data.accountId;
          }
          return next;
        })
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.transactions.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });

  return {
    transactions,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isLoading,
    error,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTransaction: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
