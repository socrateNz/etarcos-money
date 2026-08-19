"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, Trash2, Repeat, Zap, Loader2 } from "lucide-react";
import { useSubscriptions } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateSubscriptionModal } from "@/features/subscriptions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

const FREQUENCY_LABEL: Record<string, string> = {
  WEEKLY: "/ semaine",
  MONTHLY: "/ mois",
  YEARLY: "/ an",
};

export default function SubscriptionsPage() {
  const { subscriptions, isLoading, deleteSubscription, isDeleting, applySubscription, isApplying, applyingId } = useSubscriptions();

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
      toast.success("Abonnement supprimé");
    } catch {
      toast.error("Impossible de supprimer cet abonnement.");
    }
  };

  const handleApply = async (id: string, name: string) => {
    try {
      const result = await applySubscription(id);
      const nextDate = format(new Date(result.subscription.nextBillingDate), "d MMM yyyy", { locale: fr });
      toast.success(`Transaction créée pour ${name}`, {
        description: `Prochaine échéance : ${nextDate}`,
      });
    } catch {
      toast.error("Impossible de créer la transaction.");
    }
  };

  const monthlyTotal = subscriptions?.reduce((acc, s) => {
    if (s.frequency === "MONTHLY") return acc + s.amount;
    if (s.frequency === "YEARLY") return acc + s.amount / 12;
    if (s.frequency === "WEEKLY") return acc + s.amount * 4.33;
    return acc;
  }, 0) || 0;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Abonnements</h1>
            <p className="text-muted-foreground text-sm">
              {isLoading ? "…" : `~${formatCurrency(monthlyTotal)} / mois`}
            </p>
          </div>
        </div>
        <CreateSubscriptionModal>
          <Button variant="outline" size="sm" className="rounded-full">Nouveau</Button>
        </CreateSubscriptionModal>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-3">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </>
        )}

        {!isLoading && subscriptions?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucun abonnement suivi pour le moment.
          </div>
        )}

        {!isLoading && subscriptions?.map((sub) => (
          <div key={sub._id} className="bg-card border border-border p-4 rounded-3xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {sub.accountId?.name}{sub.categoryId ? ` • ${sub.categoryId.name}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prochaine échéance : {format(new Date(sub.nextBillingDate), "d MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-right">
                  {formatCurrency(sub.amount, sub.currency)}
                  <span className="block text-xs font-normal text-muted-foreground">{FREQUENCY_LABEL[sub.frequency]}</span>
                </span>
                <button
                  onClick={() => handleDelete(sub._id)}
                  disabled={isDeleting}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full rounded-xl h-11 font-medium"
              disabled={isApplying && applyingId === sub._id}
              onClick={() => handleApply(sub._id, sub.name)}
            >
              {isApplying && applyingId === sub._id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Appliquer ({formatCurrency(sub.amount, sub.currency)})
            </Button>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
