"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowRightLeft, Bot, PieChart, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "IA", href: "/ai", icon: Bot },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Objectifs", href: "/goals", icon: Target },
  { name: "Profil", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 pb-safe pt-2 bg-background/80 backdrop-blur-md border-t border-border sm:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-full py-2",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="relative flex items-center justify-center p-1">
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className="w-6 h-6 relative z-10" />
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
