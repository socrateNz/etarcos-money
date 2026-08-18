"use client";

import { motion } from "framer-motion";
import { slideUpItem } from "@/styles/animations";
import { Bot, Sparkles } from "lucide-react";

export function AiAdvice({ advice }: { advice?: string }) {
  if (!advice) return null;

  return (
    <motion.div variants={slideUpItem} className="mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-4">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Bot className="w-16 h-16" />
        </div>
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2 bg-primary/20 rounded-full text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Conseil du jour</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {advice}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
