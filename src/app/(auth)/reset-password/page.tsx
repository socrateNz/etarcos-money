"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { authQueries } from "@/queries";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien invalide ou expiré. Refaites une demande.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authQueries.resetPassword(token, password);
      toast.success("Mot de passe mis à jour, vous pouvez vous connecter.");
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ce lien est invalide ou a expiré.");
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nouveau mot de passe</h1>
        <p className="text-muted-foreground">Choisissez un nouveau mot de passe pour votre compte.</p>
      </motion.div>

      <motion.form variants={slideUpItem} onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium ml-1">Nouveau mot de passe</label>
          <Input
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-colors px-4"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium ml-1">Confirmer le mot de passe</label>
          <Input
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-14 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-colors px-4"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl w-full text-base font-semibold mt-2 shadow-lg shadow-primary/20">
          {isSubmitting ? "Mise à jour..." : "Réinitialiser le mot de passe"}
        </Button>
      </motion.form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
