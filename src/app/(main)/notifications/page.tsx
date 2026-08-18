"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, Bell, AlertTriangle, Sparkles, Info } from "lucide-react";
import { useNotifications } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppNotification } from "@/queries";

const TYPE_ICON = {
  ALERT: AlertTriangle,
  AI_ADVICE: Sparkles,
  INFO: Info,
};

export default function NotificationsPage() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm">Vos alertes et conseils</p>
        </div>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-3">
        {isLoading && (
          <>
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </>
        )}

        {!isLoading && notifications?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
            <Bell className="w-8 h-8 opacity-40" />
            Aucune notification pour le moment.
          </div>
        )}

        {!isLoading && notifications?.map((notif: AppNotification) => {
          const Icon = TYPE_ICON[notif.type] || Info;
          return (
            <button
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`text-left flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
                notif.isRead ? "bg-card border-border" : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className={`p-2 rounded-xl ${notif.isRead ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{notif.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{notif.body}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(notif.createdAt), "d MMM yyyy, HH:mm", { locale: fr })}
                </p>
              </div>
              {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
