"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, Trash2, CircleDollarSign, Coffee, ShoppingBag, Car, Home, HeartPulse, Wallet, Gamepad2, Plane, GraduationCap, Gift, type LucideIcon } from "lucide-react";
import { useCategories } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateCategoryModal } from "@/features/categories";
import { toast } from "sonner";

const ICON_MAP: Record<string, LucideIcon> = {
  Coffee, ShoppingBag, Car, Home, HeartPulse, Wallet, Gamepad2, Plane, GraduationCap, Gift, CircleDollarSign,
};

export default function CategoriesPage() {
  const { categories, isLoading, deleteCategory, isDeleting } = useCategories();

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Catégorie supprimée");
    } catch {
      toast.error("Impossible de supprimer cette catégorie (peut-être utilisée par un budget).");
    }
  };

  const expenseCategories = categories?.filter((c) => c.type === "EXPENSE") || [];
  const incomeCategories = categories?.filter((c) => c.type === "INCOME") || [];

  const renderList = (list: typeof expenseCategories, title: string) => (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">{title}</h3>
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {list.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">Aucune catégorie</div>
        )}
        {list.map((cat, idx) => {
          const Icon = ICON_MAP[cat.icon || ""] || CircleDollarSign;
          return (
            <div
              key={cat._id}
              className={`flex items-center justify-between p-4 ${idx !== list.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                disabled={isDeleting}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
            <p className="text-muted-foreground text-sm">Organisez vos dépenses et revenus</p>
          </div>
        </div>
        <CreateCategoryModal>
          <Button variant="outline" size="sm" className="rounded-full">Nouvelle</Button>
        </CreateCategoryModal>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </>
        ) : (
          <>
            {renderList(expenseCategories, "Dépenses")}
            {renderList(incomeCategories, "Revenus")}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
