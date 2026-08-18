"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, HeartPulse, TrendingUp, ShieldAlert } from "lucide-react";
import { useInsights } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

const FACTOR_LABELS: Record<string, string> = {
  savingsRatio: "Épargne",
  debtRatio: "Endettement",
  budgetAdherence: "Respect des budgets",
  consistency: "Régularité",
};

export default function InsightsPage() {
  const { financialHealth, forecast, fraud, isLoading } = useInsights();

  const score = financialHealth?.currentScore?.score;
  const factors = financialHealth?.currentScore?.factors;
  const scoreColor = score === undefined ? "text-muted-foreground" : score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analyse financière</h1>
          <p className="text-muted-foreground text-sm">Santé, prévisions et alertes</p>
        </div>
      </motion.header>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Financial health score */}
          <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Score de santé financière</h2>
            </div>
            <div className="flex items-center justify-center py-4">
              <span className={`text-5xl font-bold ${scoreColor}`}>{score ?? "–"}</span>
              <span className="text-muted-foreground text-lg ml-1">/100</span>
            </div>
            {factors && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {Object.entries(factors).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">{FACTOR_LABELS[key] || key}</p>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(value * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Forecast */}
          <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Prévision du mois prochain</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Basée sur la moyenne des 3 derniers mois.</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Revenus</p>
                <p className="font-bold text-emerald-500">
                  {formatCurrency(forecast?.forecast.nextMonthPredictedIncome ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dépenses</p>
                <p className="font-bold text-red-500">
                  {formatCurrency(forecast?.forecast.nextMonthPredictedExpense ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Épargne</p>
                <p className="font-bold">
                  {formatCurrency(forecast?.forecast.predictedSavings ?? 0)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Fraud alerts */}
          <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Transactions inhabituelles</h2>
            </div>
            {(!fraud?.alerts || fraud.alerts.length === 0) ? (
              <p className="text-sm text-muted-foreground">Aucune anomalie détectée sur les 30 derniers jours.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {fraud.alerts.map((alert) => (
                  <div key={alert.transactionId} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <div>
                      <p className="font-medium text-sm">{alert.description || "Transaction"}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alert.date), "d MMM yyyy", { locale: fr })} • {alert.reason}
                      </p>
                    </div>
                    <span className="font-bold text-red-500">{formatCurrency(alert.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
