"use client";

import { motion } from "framer-motion";
import { slideUpItem } from "@/styles/animations";
import { ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Car, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/lib/currency";

export function RecentTransactions({ transactions = [] }: { transactions?: any[] }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee": return Coffee;
      case "ShoppingBag": return ShoppingBag;
      case "Car": return Car;
      case "ArrowDownRight": return ArrowDownRight;
      case "ArrowUpRight": return ArrowUpRight;
      default: return CircleDollarSign;
    }
  };

  const displayTransactions = transactions.length > 0 ? transactions.map((tx) => ({
    id: tx._id,
    title: tx.description || "Transaction",
    category: tx.categoryId?.name || "Général",
    amount: tx.type === "EXPENSE" ? -tx.amount : tx.amount,
    date: format(new Date(tx.date), "d MMM", { locale: fr }),
    icon: getIcon(tx.categoryId?.icon),
    color: tx.categoryId?.color ? `text-[${tx.categoryId.color}] bg-[${tx.categoryId.color}]/10` : "bg-primary/10 text-primary",
  })) : [];

  return (
    <motion.div variants={slideUpItem} className="mt-8 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Activité récente</h2>
        <Link href="/transactions" className="text-sm text-primary font-medium hover:underline">
          Voir tout
        </Link>
      </div>
      
      {displayTransactions.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-6 border rounded-xl border-dashed">
          Aucune transaction récente
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${tx.color}`}>
                  <tx.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.title}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <div className={`font-semibold ${tx.amount > 0 ? "text-emerald-500" : ""}`}>
                {tx.amount > 0 ? "+" : ""}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
