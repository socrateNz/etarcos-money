"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-4 bg-background border-t border-border sm:rounded-b-2xl sm:border-none pb-safe">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="absolute left-1 text-muted-foreground hover:text-foreground"
        >
          <Mic className="w-5 h-5" />
        </Button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Posez une question sur vos finances..."
          className="w-full h-12 pl-12 pr-12 bg-muted/50 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
        />
        <Button 
          type="submit"
          size="icon" 
          disabled={!value.trim() || isLoading}
          className="absolute right-1 h-10 w-10 rounded-full transition-transform active:scale-95"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
