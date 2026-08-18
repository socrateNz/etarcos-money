"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MailCheck } from "lucide-react";
import { authQueries } from "@/queries";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authQueries.forgotPassword(email);
      setIsSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 flex flex-col px-6 pt-20 pb-safe">
      <motion.div variants={slideUpItem} className="mb-10">
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mot de passe oublié</h1>
        <p className="text-muted-foreground">
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>
      </motion.div>

      {isSent ? (
        <motion.div variants={slideUpItem} className="flex flex-col items-center text-center gap-4 py-10">
          <div className="p-4 bg-primary/10 text-primary rounded-full">
            <MailCheck className="w-8 h-8" />
          </div>
          <p className="font-medium">Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.</p>
        </motion.div>
      ) : (
        <motion.form variants={slideUpItem} onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-sm font-medium ml-1">Email</label>
            <Input
              type="email"
              placeholder="socrate@etarcos.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-colors px-4"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl w-full text-base font-semibold mt-2 shadow-lg shadow-primary/20">
            {isSubmitting ? "Envoi..." : "Envoyer le lien"}
          </Button>
        </motion.form>
      )}
    </motion.div>
  );
}
