"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft, Users, UserPlus, Landmark, ArrowRightLeft, Repeat, Bot, ShieldCheck,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { useAdminStats } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

function KpiCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, isLoading: statsLoading } = useAdminStats();

  const chartData = stats?.signupsByDay.map((d) => ({ day: format(new Date(d._id), "d MMM", { locale: fr }), count: d.count })) || [];
  const totalVolume = stats?.volumeByType.reduce((acc, v) => acc + v.total, 0) || 0;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-4 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard super admin</h1>
            <p className="text-muted-foreground text-sm">Vue d'ensemble de la plateforme</p>
          </div>
        </div>
      </motion.header>

      {statsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : (
        <motion.div variants={slideUpItem} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <KpiCard icon={Users} label="Utilisateurs" value={stats?.totalUsers ?? 0} />
          <KpiCard icon={UserPlus} label="Nouveaux (7j)" value={stats?.newUsers7d ?? 0} />
          <KpiCard icon={UserPlus} label="Nouveaux (30j)" value={stats?.newUsers30d ?? 0} />
          <KpiCard icon={Landmark} label="Comptes créés" value={stats?.totalAccounts ?? 0} />
          <KpiCard icon={ArrowRightLeft} label="Transactions" value={stats?.totalTransactions ?? 0} />
          <KpiCard icon={ArrowRightLeft} label="Volume total" value={formatCurrency(totalVolume)} />
          <KpiCard icon={Repeat} label="Abonnements suivis" value={stats?.totalSubscriptions ?? 0} />
          <KpiCard icon={Bot} label="Conversations IA" value={stats?.totalAiConversations ?? 0} />
        </motion.div>
      )}

      <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <h2 className="font-semibold mb-4">Inscriptions (30 derniers jours)</h2>
        <div className="h-[220px] w-full">
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground flex items-center justify-center h-full">Aucune inscription récente.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                          <p className="font-medium">{label}</p>
                          <p className="text-muted-foreground">{payload[0].value} inscription(s)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} fill="url(#colorSignups)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
