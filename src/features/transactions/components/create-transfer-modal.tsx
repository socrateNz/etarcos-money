import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions, useAccounts } from "@/hooks";
import { toast } from "sonner";
import { DEFAULT_CURRENCY } from "@/config";
import { formatCurrency } from "@/lib/currency";

interface CreateTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransferModal({ open, onOpenChange }: CreateTransferModalProps) {
  const { createTransaction, isCreating } = useTransactions();
  const { accounts } = useAccounts();

  const [formData, setFormData] = useState({
    amount: "",
    accountId: "",
    toAccountId: "",
    description: "Virement interne",
  });

  useEffect(() => {
    if (open && accounts && accounts.length > 0) {
      setFormData((prev) => ({
        ...prev,
        accountId: prev.accountId || accounts[0].id || accounts[0]._id || "",
        toAccountId: prev.toAccountId || accounts[1]?.id || accounts[1]?._id || "",
      }));
    }
  }, [open, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accountId === formData.toAccountId) {
      toast.error("Choisissez deux comptes différents.");
      return;
    }

    const sourceAccount = accounts?.find((a) => (a.id || a._id) === formData.accountId);

    try {
      await createTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        type: "TRANSFER",
        date: new Date().toISOString(),
        accountId: formData.accountId,
        toAccountId: formData.toAccountId,
        currency: sourceAccount?.currency || DEFAULT_CURRENCY,
      } as any);
      toast.success("Virement effectué");
      onOpenChange(false);
      setFormData({ amount: "", accountId: "", toAccountId: "", description: "Virement interne" });
    } catch (err) {
      console.error("Failed to create transfer", err);
      toast.error("Le virement a échoué.");
    }
  };

  if (!accounts || accounts.length < 2) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[40vh] flex flex-col p-6 sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Virement interne</SheetTitle>
            <SheetDescription>
              Il vous faut au moins deux comptes pour effectuer un virement entre vos comptes.
            </SheetDescription>
          </SheetHeader>
          <Button className="mt-6" onClick={() => onOpenChange(false)}>Fermer</Button>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Virement interne</SheetTitle>
          <SheetDescription>Déplacez de l'argent entre deux de vos comptes.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Montant ({accounts.find((a) => (a.id || a._id) === formData.accountId)?.currency || DEFAULT_CURRENCY})
            </label>
            <Input
              type="number"
              step="1"
              placeholder="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="text-lg py-6"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Depuis</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountId: e.target.value }))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id || acc._id} value={acc.id || acc._id}>{acc.name} - {formatCurrency(acc.balance, acc.currency)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Vers</label>
            <select
              value={formData.toAccountId}
              onChange={(e) => setFormData((prev) => ({ ...prev, toAccountId: e.target.value }))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id || acc._id} value={acc.id || acc._id}>{acc.name} - {formatCurrency(acc.balance, acc.currency)}</option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Envoi..." : "Confirmer le virement"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
