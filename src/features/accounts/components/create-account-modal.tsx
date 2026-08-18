import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccounts } from "@/hooks";
import { DEFAULT_CURRENCY } from "@/config";

const ACCOUNT_TYPES = [
  { value: "CASH", label: "Espèces" },
  { value: "BANK", label: "Compte bancaire" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CREDIT_CARD", label: "Carte de crédit" },
  { value: "SAVINGS", label: "Épargne" },
];

export function CreateAccountModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createAccount, isCreating } = useAccounts();

  const [formData, setFormData] = useState({
    name: "",
    type: "BANK",
    balance: "",
    currency: DEFAULT_CURRENCY,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount({
        name: formData.name,
        type: formData.type as any,
        balance: formData.balance ? Number(formData.balance) : 0,
        currency: formData.currency,
      });
      setIsOpen(false);
      setFormData({ name: "", type: "BANK", balance: "", currency: DEFAULT_CURRENCY });
    } catch (err) {
      console.error("Failed to create account", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouveau compte</SheetTitle>
          <SheetDescription>Ajoutez un compte pour suivre son solde.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nom du compte</label>
            <Input
              placeholder="Ex: Compte courant"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Solde initial</label>
              <Input
                type="number"
                step="1"
                placeholder="0"
                value={formData.balance}
                onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Devise</label>
              <Input
                maxLength={3}
                placeholder={DEFAULT_CURRENCY}
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Ajouter le compte"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
