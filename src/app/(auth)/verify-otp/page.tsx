"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, MailCheck, Pencil } from "lucide-react";
import { useAuth } from "@/hooks";
import { toast } from "sonner";
import { Logo } from "@/components/logo";

const RESEND_COOLDOWN_S = 30;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    verifyOtp, isVerifyingOtp,
    resendOtp, isResendingOtp,
    changePendingEmail, isChangingPendingEmail,
  } = useAuth();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailEditError, setEmailEditError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email manquant. Recommencez l'inscription.");
      return;
    }

    try {
      await verifyOtp({ email, otp });
      toast.success("Email vérifié, bienvenue !");
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Code invalide ou expiré.");
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    try {
      await resendOtp(email);
      toast.success("Un nouveau code a été envoyé.");
      setCooldown(RESEND_COOLDOWN_S);
    } catch {
      toast.error("Impossible d'envoyer un nouveau code.");
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailEditError("");

    try {
      const res = await changePendingEmail({ currentEmail: email, password, newEmail });
      setEmail(res.email);
      router.replace(`/verify-otp?email=${encodeURIComponent(res.email)}`);
      setIsEditingEmail(false);
      setPassword("");
      setNewEmail("");
      setOtp("");
      setError("");
      setCooldown(RESEND_COOLDOWN_S);
      toast.success(`Nouveau code envoyé à ${res.email}`);
    } catch (err: any) {
      setEmailEditError(err?.response?.data?.message || "Impossible de changer l'adresse email.");
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 flex flex-col px-6 pt-20 pb-safe">
      <motion.div variants={slideUpItem} className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground -ml-1 p-1">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <Logo size={44} className="rounded-2xl shadow-md shadow-primary/25" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <MailCheck className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Vérifiez votre email
          </h1>
        </div>
        <p className="text-muted-foreground">
          Entrez le code à 6 chiffres envoyé à {email ? <strong className="text-foreground">{email}</strong> : "votre adresse email"}.
        </p>
        {!isEditingEmail && (
          <button
            type="button"
            onClick={() => setIsEditingEmail(true)}
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline mt-2"
          >
            <Pencil className="w-3.5 h-3.5" /> Ajouter une adresse valide ?
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isEditingEmail ? (
          <motion.form
            key="edit-email"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleChangeEmail}
            className="flex flex-col gap-4 mb-6 overflow-hidden"
          >
            <p className="text-sm text-muted-foreground">
              Corrigez votre adresse email, on vous enverra un nouveau code.
            </p>
            {emailEditError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                {emailEditError}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Nouvelle adresse email</label>
              <Input
                type="email"
                placeholder="vous@exemple.com"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="h-12 rounded-xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background transition-colors px-4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Mot de passe de l'ancien mail</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background transition-colors px-4"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl flex-1"
                onClick={() => { setIsEditingEmail(false); setEmailEditError(""); }}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isChangingPendingEmail} className="rounded-xl flex-1">
                {isChangingPendingEmail ? "Envoi..." : "Envoyer le nouveau code"}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.form key="otp-form" variants={slideUpItem} onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Code de vérification</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-16 rounded-2xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background transition-colors px-4 text-center text-2xl font-bold tracking-[0.5em]"
              />
            </div>

            <Button
              type="submit"
              disabled={isVerifyingOtp || otp.length !== 6}
              className="h-14 rounded-2xl w-full text-base font-semibold mt-2 shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-violet-500 hover:opacity-90 transition-opacity border-0"
            >
              {isVerifyingOtp ? "Vérification..." : "Vérifier"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {!isEditingEmail && (
        <motion.div variants={slideUpItem} className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Vous n'avez rien reçu ?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResendingOtp}
            className="text-sm font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Renvoyer le code (${cooldown}s)` : isResendingOtp ? "Envoi..." : "Renvoyer le code"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
