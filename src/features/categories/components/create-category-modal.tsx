import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks";
import {
  Coffee, ShoppingBag, Car, Home, HeartPulse, Wallet, CircleDollarSign,
  Gamepad2, Plane, GraduationCap, Gift, type LucideIcon,
} from "lucide-react";

const ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Coffee", icon: Coffee },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Car", icon: Car },
  { name: "Home", icon: Home },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Wallet", icon: Wallet },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Plane", icon: Plane },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Gift", icon: Gift },
  { name: "CircleDollarSign", icon: CircleDollarSign },
];

const COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#10b981", "#eab308", "#64748b"];

export function CreateCategoryModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createCategory, isCreating } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE" as "EXPENSE" | "INCOME",
    icon: "CircleDollarSign",
    color: COLORS[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(formData);
      setIsOpen(false);
      setFormData({ name: "", type: "EXPENSE", icon: "CircleDollarSign", color: COLORS[0] });
    } catch (err) {
      console.error("Failed to create category", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:h-auto sm:max-w-md sm:right-0 sm:top-0 sm:side-right sm:rounded-none">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">Nouvelle catégorie</SheetTitle>
          <SheetDescription>Créez une catégorie pour vos transactions et budgets.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Type</label>
            <div className="flex bg-muted p-1 rounded-xl">
              <Button
                type="button"
                variant={formData.type === "EXPENSE" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, type: "EXPENSE" }))}
              >
                Dépense
              </Button>
              <Button
                type="button"
                variant={formData.type === "INCOME" ? "default" : "ghost"}
                className="flex-1 rounded-lg"
                onClick={() => setFormData(prev => ({ ...prev, type: "INCOME" }))}
              >
                Revenu
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Nom</label>
            <Input
              placeholder="Ex: Abonnements"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Icône</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: name }))}
                  className={`p-3 rounded-xl border ${formData.icon === name ? "border-primary bg-primary/10" : "border-border bg-muted/50"}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Couleur</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full ${formData.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isCreating} className="w-full mt-4 py-6 text-lg rounded-xl shadow-lg shadow-primary/25">
            {isCreating ? "Création..." : "Créer la catégorie"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
