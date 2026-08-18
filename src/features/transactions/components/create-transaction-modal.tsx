import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions, useAccounts, useCategories } from "@/hooks";
import { DEFAULT_CURRENCY } from "@/config";
import { formatCurrency } from "@/lib/currency";

interface CreateTransactionModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultType?: "income" | "expense";
  initialValues?: { description?: string; amount?: number; date?: string };
}

export function CreateTransactionModal({ children, open, onOpenChange, defaultType = "expense", initialValues }: CreateTransactionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const { createTransaction, isCreating } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    description: initialValues?.description || "",
    amount: initialValues?.amount !== undefined ? String(initialValues.amount) : "",
    type: defaultType as "income" | "expense",
    date: initialValues?.date || new Date().toISOString().split("T")[0],
    accountId: "",
    categoryId: "",
  });

  // Reset type/values when the modal is (re)opened with new defaults (e.g. prefilled from a receipt)
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        type: defaultType,
        description: initialValues?.description ?? prev.description,
        amount: initialValues?.amount !== undefined ? String(initialValues.amount) : prev.amount,
        date: initialValues?.date ?? prev.date,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultType]);

  // Set default account if accounts are loaded and none is selected
  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.accountId) {
      setFormData(prev => ({ ...prev, accountId: accounts[0].id || accounts[0]._id || "" }));
    }
  }, [accounts, formData.accountId]);

  const categoriesForType = categories?.filter(
    (cat) => cat.type === (formData.type === "income" ? "INCOME" : "EXPENSE")
  );

  // Default to the first matching category whenever the type changes
  useEffect(() => {
    if (categoriesForType && categoriesForType.length > 0) {
      const stillValid = categoriesForType.some((c) => c._id === formData.categoryId);
      if (!stillValid) {
        setFormData(prev => ({ ...prev, categoryId: categoriesForType[0]._id }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId) {
      alert("Veuillez sélectionner un compte ou en créer un.");
      return;
    }

    const selectedAccount = accounts?.find((a) => (a.id || a._id) === formData.accountId);

    try {
      await createTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        type: formData.type === "income" ? "INCOME" : "EXPENSE",
        date: new Date(formData.date).toISOString(),
        accountId: formData.accountId,
        categoryId: formData.categoryId || undefined,
        currency: selectedAccount?.currency || DEFAULT_CURRENCY,
      } as any);
      setIsOpen(false);
      setFormData({
        description: "",
        amount: "",
        type: defaultType,
        date: new Date().toISOString().split("T")[0],
        accountId: accounts?.[0]?.id || accounts?.[0]?._id || "",
        categoryId: "",
      });
    } catch (err) {
      console.error("Failed to create transaction", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouvelle transaction</SheetTitle>
          <SheetDescription>
            Ajoutez une dépense ou un revenu à votre compte.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Type</label>
            <div className="flex bg-muted p-1 rounded-xl">
              <Button
                type="button"
                variant={formData.type === "expense" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, type: "expense" }))}
              >
                Dépense
              </Button>
              <Button
                type="button"
                variant={formData.type === "income" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, type: "income" }))}
              >
                Revenu
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Montant ({accounts?.find((a) => (a.id || a._id) === formData.accountId)?.currency || DEFAULT_CURRENCY})
            </label>
            <Input
              name="amount"
              type="number"
              step="1"
              placeholder="0"
              required
              value={formData.amount}
              onChange={handleChange}
              className="text-lg py-6"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Titre</label>
            <Input
              name="description"
              placeholder="Ex: Café Starbucks"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Date</label>
              <Input
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Catégorie</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Aucune</option>
                {categoriesForType?.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Compte</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              disabled={isLoadingAccounts}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>Sélectionner un compte</option>
              {accounts?.map(acc => (
                <option key={acc.id || acc._id} value={acc.id || acc._id}>{acc.name} - {formatCurrency(acc.balance, acc.currency)}</option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter la transaction"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
