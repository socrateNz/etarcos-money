"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fingerprint, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Identifiants invalides");
    }
  };

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex-1 flex flex-col px-6 pt-20 pb-safe"
    >
      <motion.div variants={slideUpItem} className="mb-10">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 16H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 11V21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rebonjour !</h1>
        <p className="text-muted-foreground">Connectez-vous pour gérer vos finances.</p>
      </motion.div>

      <motion.form variants={slideUpItem} onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
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
          <div className="flex justify-end mt-2">
            <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoggingIn}
          className="h-14 rounded-2xl w-full text-base font-semibold mt-2 shadow-lg shadow-primary/20"
        >
          {isLoggingIn ? "Connexion..." : "Se connecter"}
        </Button>
      </motion.form>

      <motion.div variants={slideUpItem} className="mt-8 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-4">Ou connectez-vous avec</p>
        <Button variant="outline" className="h-16 w-16 rounded-full border-2">
          <Fingerprint className="w-8 h-8 text-foreground" />
        </Button>
      </motion.div>

      <motion.div variants={slideUpItem} className="mt-auto pt-8 pb-4 flex justify-center items-center gap-2">
        <span className="text-muted-foreground text-sm">Nouveau sur Etarcos ?</span>
        <Link href="/register" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
          Créer un compte <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
