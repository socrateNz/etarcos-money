"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAi = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full mb-4", isAi ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex max-w-[85%] gap-3", isAi ? "flex-row" : "flex-row-reverse")}>
        <div 
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            isAi ? "bg-primary/20 text-primary" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          )}
        >
          {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
            isAi 
              ? "bg-card border border-border text-foreground rounded-tl-sm" 
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
}
