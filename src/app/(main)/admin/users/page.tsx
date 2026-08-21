"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Users as UsersIcon } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { useAdminUsers } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const { users, pagination, isLoading: usersLoading } = useAdminUsers(page, search);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-4 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground text-sm">{pagination?.total ?? 0} compte(s) au total</p>
          </div>
        </div>
      </motion.header>

      <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput);
          }}
          className="relative mb-4"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </form>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="px-2 py-2 font-medium">Utilisateur</th>
                <th className="px-2 py-2 font-medium">Rôle</th>
                <th className="px-2 py-2 font-medium">Devise</th>
                <th className="px-2 py-2 font-medium">Score</th>
                <th className="px-2 py-2 font-medium">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading && (
                <tr><td colSpan={5} className="px-2 py-6 text-center text-muted-foreground">Chargement...</td></tr>
              )}
              {!usersLoading && users?.length === 0 && (
                <tr><td colSpan={5} className="px-2 py-6 text-center text-muted-foreground">Aucun utilisateur trouvé.</td></tr>
              )}
              {!usersLoading && users?.map((u) => (
                <tr key={u._id} className="border-b border-border/60 last:border-0">
                  <td className="px-2 py-3">
                    <p className="font-medium">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-2 py-3">
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">{u.currency}</td>
                  <td className="px-2 py-3 text-muted-foreground">{u.financialScore}</td>
                  <td className="px-2 py-3 text-muted-foreground whitespace-nowrap">
                    {format(new Date(u.createdAt), "d MMM yyyy", { locale: fr })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
            </Button>
            <span className="text-xs text-muted-foreground">Page {pagination.page} / {pagination.totalPages}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
