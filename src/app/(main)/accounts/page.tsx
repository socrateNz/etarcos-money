"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, Trash2, Wallet, Landmark, Smartphone, CreditCard, PiggyBank, type LucideIcon } from "lucide-react";
import { useAccounts } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CreateAccountModal } from "@/features/accounts";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

const TYPE_ICON: Record<string, LucideIcon> = {
  CASH: Wallet,
  BANK: Landmark,
  MOBILE_MONEY: Smartphone,
  CREDIT_CARD: CreditCard,
  SAVINGS: PiggyBank,
};

export default function AccountsPage() {
  const { accounts, isLoading, deleteAccount, isDeleting } = useAccounts();

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id);
      toast.success("Compte supprimé");
    } catch {
      toast.error("Impossible de supprimer ce compte.");
    }
  };

  const totalBalance = accounts?.reduce((acc, a) => acc + a.balance, 0) || 0;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Comptes</h1>
            <p className="text-muted-foreground text-sm">
              {isLoading ? "…" : `${formatCurrency(totalBalance)} au total`}
            </p>
          </div>
        </div>
        <CreateAccountModal>
          <Button variant="outline" size="sm" className="rounded-full">Nouveau</Button>
        </CreateAccountModal>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-3">
        {isLoading && (
          <>
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
          </>
        )}

        {!isLoading && accounts?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucun compte pour le moment. Ajoutez-en un pour commencer à suivre vos finances.
          </div>
        )}

        {!isLoading && accounts?.map((account) => {
          const Icon = TYPE_ICON[account.type] || Wallet;
          const id = account.id || account._id!;
          return (
            <div key={id} className="bg-card border border-border p-4 rounded-3xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{account.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{account.type.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  {formatCurrency(account.balance, account.currency)}
                </span>
                <button
                  onClick={() => handleDelete(id)}
                  disabled={isDeleting}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
