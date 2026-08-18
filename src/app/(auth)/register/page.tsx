"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register({ firstName, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col px-6 pt-12 pb-safe"
    >
      <motion.div variants={slideUpItem} className="mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mb-6 -ml-2 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Créer un compte</h1>
        <p className="text-muted-foreground">Commencez à gérer votre budget intelligemment avec Etarcos.</p>
      </motion.div>

      <motion.form variants={slideUpItem} onSubmit={handleRegister} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium ml-1">Prénom</label>
          <Input 
            type="text" 
            placeholder="Socrate" 
            required 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-14 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-colors px-4"
          />
        </div>

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
        
        <div className="space-y-1 relative">
          <label className="text-sm font-medium ml-1">Mot de passe</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-colors px-4 pr-12"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isRegistering}
          className="h-14 rounded-2xl w-full text-base font-semibold mt-4 shadow-lg shadow-primary/20"
        >
          {isRegistering ? "Création..." : "Créer mon compte"}
        </Button>
      </motion.form>

      <motion.div variants={slideUpItem} className="mt-auto pt-8 pb-4 flex justify-center items-center gap-2">
        <span className="text-muted-foreground text-sm">Vous avez déjà un compte ?</span>
        <Link href="/login" className="text-sm font-bold text-primary hover:underline">
          Connectez-vous
        </Link>
      </motion.div>
    </motion.div>
  );
}
