"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { slideUpItem } from "@/styles/animations";
import { CreditCard, Plus, ArrowUpRight, ArrowDownRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateTransactionModal, CreateTransferModal } from "@/features/transactions";

export function QuickActions() {
  const router = useRouter();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);

  const actions = [
    {
      icon: ArrowUpRight,
      label: "Envoyer",
      color: "bg-blue-500/10 text-blue-500",
      onClick: () => setIsTransferOpen(true),
    },
    {
      icon: ArrowDownRight,
      label: "Recevoir",
      color: "bg-emerald-500/10 text-emerald-500",
      onClick: () => setIsIncomeOpen(true),
    },
    {
      icon: Plus,
      label: "Ajouter",
      color: "bg-purple-500/10 text-purple-500",
      onClick: () => router.push("/transactions"),
    },
    {
      icon: Bot,
      label: "Ask AI",
      color: "bg-orange-500/10 text-orange-500",
      onClick: () => router.push("/ai"),
    },
  ];

  return (
    <>
      <motion.div variants={slideUpItem} className="grid grid-cols-4 gap-3 mt-6">
        {actions.map((action, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={action.onClick}
              className={`h-14 w-14 rounded-2xl border-none ${action.color} transition-transform active:scale-95`}
            >
              <action.icon className="h-6 w-6" />
            </Button>
            <span className="text-[11px] font-medium text-muted-foreground">{action.label}</span>
          </div>
        ))}
      </motion.div>

      <CreateTransferModal open={isTransferOpen} onOpenChange={setIsTransferOpen} />
      <CreateTransactionModal open={isIncomeOpen} onOpenChange={setIsIncomeOpen} defaultType="income" />
    </>
  );
}
