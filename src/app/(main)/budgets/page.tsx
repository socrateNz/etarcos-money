"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { AlertTriangle, Coffee, ShoppingBag, Car, CircleDollarSign, Plus } from "lucide-react";
import { useBudgets } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateBudgetModal } from "@/features/budgets";
import { formatCurrency } from "@/lib/currency";

export default function BudgetsPage() {
  const { budgets, isLoading } = useBudgets();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee": return Coffee;
      case "ShoppingBag": return ShoppingBag;
      case "Car": return Car;
      default: return CircleDollarSign;
    }
  };

  const getPrediction = (percentage: number) => {
    if (percentage >= 100) return "Budget dépassé.";
    if (percentage >= 85) return "Vous risquez de dépasser bientôt.";
    if (percentage <= 50) return "Sur la bonne voie.";
    return "";
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-4 flex flex-col sm:p-6"
    >
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez vos limites mensuelles</p>
        </div>
        <CreateBudgetModal>
          <Button variant="outline" size="sm" className="rounded-full">
            Nouveau
          </Button>
        </CreateBudgetModal>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-6">
        {isLoading && (
          <>
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
          </>
        )}

        {!isLoading && budgets?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucun budget trouvé.
          </div>
        )}

        {!isLoading && budgets?.map((apiBudget: any) => {
          // Map API budget to the expected format
          const budget = {
            id: apiBudget._id,
            category: apiBudget.categoryId?.name || "Général",
            icon: getIcon(apiBudget.categoryId?.icon),
            colorClass: apiBudget.categoryId?.color ? `text-[${apiBudget.categoryId.color}] bg-[${apiBudget.categoryId.color}]/10` : "bg-primary/10 text-primary",
            spent: apiBudget.spent || 0,
            total: apiBudget.amountLimit || 0,
          };

          const percentage = budget.total > 0 ? Math.min((budget.spent / budget.total) * 100, 100) : 0;
          const isWarning = percentage >= 85;
          const progressColor = isWarning ? "bg-red-500" : percentage > 60 ? "bg-amber-500" : "bg-emerald-500";
          const prediction = getPrediction(percentage);

          return (
            <div key={budget.id} className="bg-card border border-border p-5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${budget.colorClass}`}>
                  <budget.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{budget.category}</h3>
                  <div className="flex justify-between items-end mt-1">
                    <span className="font-bold text-lg">{formatCurrency(budget.spent)}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">sur {formatCurrency(budget.total)}</span>
                  </div>
                </div>
              </div>

              <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full ${progressColor} rounded-full`}
                />
              </div>

              {prediction && (
                <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${isWarning ? "text-red-500" : "text-emerald-500"}`}>
                  {isWarning && <AlertTriangle className="w-4 h-4" />}
                  {prediction}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
