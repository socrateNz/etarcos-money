"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Target, CheckCircle2, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateGoalModal } from "@/features/goals";
import { formatCurrency } from "@/lib/currency";

export default function GoalsPage() {
  const { goals, isLoading } = useGoals();

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#3b82f6", "#f43f5e", "#f59e0b"],
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Objectifs</h1>
          <p className="text-muted-foreground text-sm mt-1">Vos projets d'épargne</p>
        </div>
        <CreateGoalModal>
          <Button variant="outline" size="sm" className="rounded-full">
            Nouveau
          </Button>
        </CreateGoalModal>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-6">
        {isLoading && (
          <>
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-3xl" />
          </>
        )}

        {!isLoading && goals?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucun objectif trouvé.
          </div>
        )}

        {!isLoading && goals?.map((apiGoal: any) => {
          const goal = {
            id: apiGoal._id,
            title: apiGoal.name,
            target: apiGoal.targetAmount,
            current: apiGoal.currentAmount || 0,
            icon: Target, // Or dynamic if added later
            colorClass: "bg-blue-500/10 text-blue-500", // Or dynamic
            completed: apiGoal.status === "COMPLETED" || (apiGoal.currentAmount >= apiGoal.targetAmount),
          };

          const percentage = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;

          return (
            <div key={goal.id} className="bg-card border border-border p-5 rounded-3xl shadow-sm relative overflow-hidden">
              {goal.completed && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${goal.completed ? "bg-emerald-500/10 text-emerald-500" : goal.colorClass}`}>
                  {goal.completed ? <CheckCircle2 className="w-5 h-5" /> : <goal.icon className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div className="flex justify-between items-end mt-1">
                    <span className="font-bold text-lg">{formatCurrency(goal.current)}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Objectif: {formatCurrency(goal.target)}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full ${goal.completed ? "bg-emerald-500" : "bg-primary"} rounded-full`}
                />
              </div>

              {goal.completed ? (
                <Button 
                  onClick={handleCelebrate}
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Objectif Atteint ! 🎉
                </Button>
              ) : (
                <Button variant="secondary" className="w-full rounded-xl font-semibold">
                  Ajouter des fonds
                </Button>
              )}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

