import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscriptions } from "@/hooks";
import { DEFAULT_CURRENCY } from "@/config";

export function CreateSubscriptionModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createSubscription, isCreating } = useSubscriptions();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    currency: DEFAULT_CURRENCY,
    frequency: "MONTHLY" as "WEEKLY" | "MONTHLY" | "YEARLY",
    nextBillingDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubscription({
        name: formData.name,
        amount: Number(formData.amount),
        currency: formData.currency,
        frequency: formData.frequency,
        nextBillingDate: formData.nextBillingDate,
      } as any);
      setIsOpen(false);
      setFormData({ name: "", amount: "", currency: DEFAULT_CURRENCY, frequency: "MONTHLY", nextBillingDate: new Date().toISOString().split("T")[0] });
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
          <SheetDescription>Suivez vos dépenses récurrentes.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nom</label>
            <Input
              placeholder="Ex: Netflix"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Montant</label>
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
              <label className="text-sm font-medium mb-1.5 block">Devise</label>
              <Input
                maxLength={3}
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
              />
            </div>
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

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter l'abonnement"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
