"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { slideUpItem } from "@/styles/animations";
import { Plus, Landmark, Wallet, Smartphone, CreditCard, PiggyBank, type LucideIcon } from "lucide-react";
import { useAccounts } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

const TYPE_ICON: Record<string, LucideIcon> = {
  CASH: Wallet,
  BANK: Landmark,
  MOBILE_MONEY: Smartphone,
  CREDIT_CARD: CreditCard,
  SAVINGS: PiggyBank,
};

export function CreditCards() {
  const { accounts, isLoading } = useAccounts();
  const primaryAccount = accounts?.[0];
  const Icon = primaryAccount ? TYPE_ICON[primaryAccount.type] || Wallet : Wallet;

  if (isLoading) {
    return (
      <motion.div variants={slideUpItem} className="mt-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
      </motion.div>
    );
  }

  return (
    <motion.div variants={slideUpItem} className="mt-6">
      <Link
        href="/accounts"
        className="relative flex h-48 w-full flex-col justify-between rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-xl shadow-zinc-900/20"
      >
        {/* Glassmorphism effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/30 rounded-full blur-2xl -ml-10 -mb-10" />

        {primaryAccount ? (
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-xl font-bold tracking-widest opacity-80">ETARCOS</span>
              <Icon className="w-6 h-6 opacity-70" />
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase opacity-70 mb-1">{primaryAccount.name}</p>
              <p className="font-mono text-2xl tracking-wide opacity-90">
                {formatCurrency(primaryAccount.balance, primaryAccount.currency)}
              </p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <p className="text-[10px] uppercase opacity-70">{primaryAccount.type.replace("_", " ")}</p>
              {accounts && accounts.length > 1 && (
                <p className="text-[10px] uppercase opacity-70">+{accounts.length - 1} autre(s) compte(s)</p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="p-3 bg-white/10 rounded-full">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-semibold">Ajouter un compte</p>
            <p className="text-xs opacity-70">Suivez vos soldes en un coup d'œil</p>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
