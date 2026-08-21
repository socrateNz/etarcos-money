"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Diffusion", href: "/admin/broadcast", icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: vertical sidebar, sits right next to the main app sidebar */}
      <nav className="hidden sm:flex sm:flex-col gap-1 w-[200px] shrink-0 py-6 pr-4 sm:sticky sm:top-0 sm:self-start">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile: horizontal tabs */}
      <nav className="flex sm:hidden gap-2 px-4 pt-4 pb-2 overflow-x-auto hide-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shrink-0",
                isActive ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
