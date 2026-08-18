import { useMutation } from "@tanstack/react-query";
import { receiptQueries } from "@/queries";

export function useReceipts() {
  const uploadMutation = useMutation({
    mutationFn: receiptQueries.upload,
  });

  return {
    uploadReceipt: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    receipt: uploadMutation.data,
    error: uploadMutation.error,
    reset: uploadMutation.reset,
  };
}
