import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscriptions, useAccounts, useCategories } from "@/hooks";
import { formatCurrency } from "@/lib/currency";

export function CreateSubscriptionModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createSubscription, isCreating } = useSubscriptions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const expenseCategories = categories?.filter((cat) => cat.type === "EXPENSE");

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    frequency: "MONTHLY" as "WEEKLY" | "MONTHLY" | "YEARLY",
    nextBillingDate: new Date().toISOString().split("T")[0],
    accountId: "",
    categoryId: "",
  });

  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.accountId) {
      setFormData((prev) => ({ ...prev, accountId: accounts[0].id || accounts[0]._id || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  useEffect(() => {
    if (expenseCategories && expenseCategories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({ ...prev, categoryId: expenseCategories[0]._id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const selectedAccount = accounts?.find((a) => (a.id || a._id) === formData.accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId) return;

    try {
      await createSubscription({
        name: formData.name,
        amount: Number(formData.amount),
        currency: selectedAccount?.currency,
        frequency: formData.frequency,
        nextBillingDate: formData.nextBillingDate,
        accountId: formData.accountId,
        categoryId: formData.categoryId || undefined,
      });
      setIsOpen(false);
      setFormData((prev) => ({ ...prev, name: "", amount: "", nextBillingDate: new Date().toISOString().split("T")[0] }));
    } catch (err) {
      console.error("Failed to create subscription", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouvel abonnement</SheetTitle>
          <SheetDescription>
            Suivez une dépense récurrente et générez-la en un clic à chaque échéance.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nom</label>
            <Input
              placeholder="Ex: Canal+"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Montant {selectedAccount ? `(${selectedAccount.currency})` : ""}
            </label>
            <Input
              type="number"
              step="1"
              placeholder="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Compte débité</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="" disabled>Sélectionner un compte</option>
              {accounts?.map((acc) => (
                <option key={acc.id || acc._id} value={acc.id || acc._id}>
                  {acc.name} - {formatCurrency(acc.balance, acc.currency)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Catégorie</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Aucune</option>
              {expenseCategories?.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Fréquence</label>
            <div className="flex bg-muted p-1 rounded-xl">
              {(["WEEKLY", "MONTHLY", "YEARLY"] as const).map((freq) => (
                <Button
                  key={freq}
                  type="button"
                  variant={formData.frequency === freq ? "default" : "ghost"}
                  className="flex-1 rounded-lg"
                  onClick={() => setFormData(prev => ({ ...prev, frequency: freq }))}
                >
                  {freq === "WEEKLY" ? "Hebdo" : freq === "MONTHLY" ? "Mensuel" : "Annuel"}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Prochaine échéance</label>
            <Input
              type="date"
              required
              value={formData.nextBillingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, nextBillingDate: e.target.value }))}
            />
          </div>

          <Button type="submit" disabled={isCreating || !formData.accountId} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter l'abonnement"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
