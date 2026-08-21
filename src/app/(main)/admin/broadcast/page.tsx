"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Mail, Send, FlaskConical, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { useAdminStats, useBroadcasts } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminBroadcastPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { stats } = useAdminStats();
  const { broadcasts, pagination, isLoading, sendTest, isSendingTest, send, isSending } = useBroadcasts(page);

  const canSend = subject.trim().length > 0 && body.trim().length > 0;

  const handleSendTest = async () => {
    try {
      const res = await sendTest({ subject, body });
      toast.success(`Email de test envoyé à ${res.sentTo}`);
    } catch {
      toast.error("Impossible d'envoyer l'email de test.");
    }
  };

  const handleConfirmSend = async () => {
    try {
      const res = await send({ subject, body });
      toast.success(`Diffusion envoyée à ${res.successCount}/${res.recipientCount} utilisateur(s).`);
      setConfirmOpen(false);
      setSubject("");
      setBody("");
      setPage(1);
    } catch {
      toast.error("L'envoi de la diffusion a échoué.");
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-4 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Diffusion</h1>
            <p className="text-muted-foreground text-sm">Envoyer un email à tous les utilisateurs</p>
          </div>
        </div>
      </motion.header>

      <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Objet</label>
            <Input
              placeholder="Ex: Nouveautés Tacynt Money ce mois-ci"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              placeholder="Rédigez votre message ici..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={10000}
              rows={8}
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl flex-1"
              disabled={!canSend || isSendingTest}
              onClick={handleSendTest}
            >
              {isSendingTest ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FlaskConical className="w-4 h-4 mr-2" />}
              M'envoyer un test
            </Button>
            <Button
              type="button"
              className="rounded-xl flex-1"
              disabled={!canSend}
              onClick={() => setConfirmOpen(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer à tous {stats ? `(${stats.totalUsers})` : ""}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Testez toujours l'email avant de l'envoyer à tout le monde — cette action est irréversible.
          </p>
        </div>
      </motion.div>

      <motion.div variants={slideUpItem} className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <h2 className="font-semibold mb-4">Historique</h2>
        {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
        {!isLoading && broadcasts?.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune diffusion envoyée pour le moment.</p>
        )}
        <div className="flex flex-col gap-3">
          {broadcasts?.map((b) => (
            <div key={b._id} className="border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{b.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(b.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {b.successCount}
                  </span>
                  {b.failureCount > 0 && (
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" /> {b.failureCount}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 whitespace-pre-line">{b.body}</p>
            </div>
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button type="button" variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Précédent
            </Button>
            <span className="text-xs text-muted-foreground">Page {pagination.page} / {pagination.totalPages}</span>
            <Button type="button" variant="outline" size="sm" className="rounded-xl" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
              Suivant
            </Button>
          </div>
        )}
      </motion.div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'envoi</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'envoyer "{subject}" à <strong>{stats?.totalUsers ?? "tous les"}</strong> utilisateur(s). Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isSending}>
              Annuler
            </Button>
            <Button onClick={handleConfirmSend} disabled={isSending}>
              {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Confirmer l'envoi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
