"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowRightLeft, Bot, PieChart, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const NAV_ITEMS = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "IA", href: "/ai", icon: Bot },
  { name: "Budgets", href: "/budgets", icon: PieChart },
  { name: "Objectifs", href: "/goals", icon: Target },
  { name: "Profil", href: "/profile", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex fixed left-0 top-0 bottom-0 w-[80px] flex-col items-center gap-2 py-6 border-r border-border bg-background/80 backdrop-blur-md z-50">
      <Link href="/" title="Tacynt Money" className="mb-4">
        <Logo size={40} className="rounded-xl shadow-sm shadow-primary/20" />
      </Link>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.name}
            className={cn(
              "relative flex flex-col items-center justify-center w-14 py-3 rounded-2xl transition-colors",
              isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
