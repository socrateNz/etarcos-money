"use client";

import { Key, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Coffee, ShoppingBag, Car, ArrowDownRight, ArrowUpRight, Plus, CircleDollarSign, LucideIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwipeableTransaction, CreateTransactionModal } from "@/features/transactions";
import { staggerContainer, slideUpItem } from "@/styles/animations";

import { useTransactions } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsPage() {
  const { transactions: apiTransactions, isLoading, deleteTransaction } = useTransactions();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

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

  const mappedApiTransactions = apiTransactions?.map((tx: any) => ({
    id: tx._id,
    title: tx.description || "Transaction",
    category: tx.categoryId?.name || "Général",
    amount: tx.type === "INCOME" ? tx.amount : -tx.amount,
    date: format(new Date(tx.date), "d MMM, HH:mm", { locale: fr }),
    icon: getIcon(tx.categoryId?.icon),
    colorClass: tx.categoryId?.color ? `text-[${tx.categoryId.color}] bg-[${tx.categoryId.color}]/10` : "bg-primary/10 text-primary",
    type: tx.type === "INCOME" ? "income" : "expense"
  }));

  const transactions = mappedApiTransactions && mappedApiTransactions.length > 0 ? mappedApiTransactions : [];

  const handleDelete = (id: string | number) => {
    deleteTransaction(id);
    // Note: The UI will auto-update thanks to React Query invalidation
  };

  const handleEdit = (id: string | number) => {
    console.log("Edit transaction", id);
    // Open edit modal or bottom sheet here
  };

  const filteredTransactions = transactions.filter((tx: { type: string; title: string; }) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-4 flex flex-col sm:p-6"
    >
      <motion.header variants={slideUpItem} className="py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <CreateTransactionModal>
          <Button size="icon" className="h-10 w-10 rounded-full shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
          </Button>
        </CreateTransactionModal>
      </motion.header>

      {/* Search and Filters */}
      <motion.div variants={slideUpItem} className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une transaction..."
            className="pl-9 bg-muted/50 border-none rounded-xl h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground h-9 w-9">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <Badge
            variant={filter === "all" ? "default" : "secondary"}
            className="px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium"
            onClick={() => setFilter("all")}
          >
            Toutes
          </Badge>
          <Badge
            variant={filter === "expense" ? "default" : "secondary"}
            className="px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium"
            onClick={() => setFilter("expense")}
          >
            Dépenses
          </Badge>
          <Badge
            variant={filter === "income" ? "default" : "secondary"}
            className="px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium"
            onClick={() => setFilter("income")}
          >
            Revenus
          </Badge>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div variants={slideUpItem} className="flex flex-col">
        <AnimatePresence>
          {filteredTransactions.map((tx: { id: string | number; title: string; category: string; amount: number; date: string; icon: LucideIcon; colorClass: string; }) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SwipeableTransaction
                id={tx.id}
                title={tx.title}
                category={tx.category}
                amount={tx.amount}
                date={tx.date}
                icon={tx.icon}
                colorClass={tx.colorClass!}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </motion.div>
          ))}
          {filteredTransactions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground"
            >
              <p>Aucune transaction trouvée.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
