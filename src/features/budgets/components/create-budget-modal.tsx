import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBudgets, useCategories } from "@/hooks";

export function CreateBudgetModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createBudget, isCreating } = useBudgets();
  const { categories } = useCategories();
  const expenseCategories = categories?.filter((cat) => cat.type === "EXPENSE");

  const [formData, setFormData] = useState({
    categoryId: "",
    amountLimit: "",
    period: "MONTHLY",
  });

  useEffect(() => {
    if (expenseCategories && expenseCategories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: expenseCategories[0]._id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }

    try {
      await createBudget({
        categoryId: formData.categoryId,
        amountLimit: Number(formData.amountLimit),
        period: formData.period,
      });
      setIsOpen(false);
      setFormData({
        categoryId: expenseCategories?.[0]?._id || "",
        amountLimit: "",
        period: "MONTHLY",
      });
    } catch (err) {
      console.error("Failed to create budget", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouveau budget</SheetTitle>
          <SheetDescription>
            Définissez une limite de dépenses pour une catégorie.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Catégorie</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>Sélectionner une catégorie</option>
              {expenseCategories?.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Montant Limite (FCFA)</label>
            <Input
              name="amountLimit"
              type="number"
              step="1"
              placeholder="0"
              required
              value={formData.amountLimit}
              onChange={handleChange}
              className="text-lg py-6"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Période</label>
            <div className="flex bg-muted p-1 rounded-xl">
              <Button
                type="button"
                variant={formData.period === "WEEKLY" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, period: "WEEKLY" }))}
              >
                Hebdomadaire
              </Button>
              <Button
                type="button"
                variant={formData.period === "MONTHLY" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, period: "MONTHLY" }))}
              >
                Mensuelle
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter le budget"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
