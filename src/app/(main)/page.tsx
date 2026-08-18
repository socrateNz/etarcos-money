"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { AnimatedChart, QuickActions, CreditCards, RecentTransactions, AiAdvice } from "@/features/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboard } from "@/hooks";
import { useUserStore } from "@/stores";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

export default function HomePage() {
  const { data, isLoading, error } = useDashboard();
  const { user } = useUserStore();

  const balance = data?.totalBalance !== undefined ? data.totalBalance : 0;
  const firstName = user?.firstName || "Socrate";

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-4 flex flex-col sm:p-6"
    >
      <motion.header variants={slideUpItem} className="flex justify-between items-center py-2">
        <div>
          <p className="text-sm text-muted-foreground font-medium">Bonjour</p>
          <h1 className="text-2xl font-bold tracking-tight">{firstName}</h1>
        </div>
        <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-sm">
          <AvatarImage src="https://github.com/shadcn.png" alt={`@${firstName}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{firstName.charAt(0)}</AvatarFallback>
        </Avatar>
      </motion.header>
      
      <motion.section variants={slideUpItem} className="mt-6">
        <p className="text-sm text-muted-foreground font-medium mb-1">Argent disponible</p>
        {isLoading ? (
          <Skeleton className="h-10 w-48 rounded-xl" />
        ) : (
          <h2 className="text-[2.5rem] leading-none font-bold tracking-tight">
            {formatCurrency(balance)}
          </h2>
        )}
      </motion.section>
      
      <QuickActions />
      <CreditCards />
      <AnimatedChart data={data?.chartData} />
      <AiAdvice advice={data?.aiAdvice} />
      <RecentTransactions transactions={data?.recentTransactions || []} />
      
    </motion.div>
  );
}
