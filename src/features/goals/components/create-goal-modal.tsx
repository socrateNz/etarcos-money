import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoals } from "@/hooks";

export function CreateGoalModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createGoal, isCreating } = useGoals();

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGoal({
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        targetDate: new Date(formData.deadline).toISOString(),
      });
      setIsOpen(false);
      setFormData({
        name: "",
        targetAmount: "",
        deadline: "",
      });
    } catch (err) {
      console.error("Failed to create goal", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouvel objectif</SheetTitle>
          <SheetDescription>
            Définissez un objectif d'épargne.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nom de l'objectif</label>
            <Input
              name="name"
              placeholder="Ex: Vacances, MacBook, etc."
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Montant cible (FCFA)</label>
            <Input
              name="targetAmount"
              type="number"
              step="1"
              placeholder="0"
              required
              value={formData.targetAmount}
              onChange={handleChange}
              className="text-lg py-6"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Date limite</label>
            <Input
              name="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter l'objectif"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
