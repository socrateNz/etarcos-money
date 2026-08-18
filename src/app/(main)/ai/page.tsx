"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { ChatMessage, ChatInput } from "@/features/ai";
import { slideUpItem } from "@/styles/animations";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useAi } from "@/hooks";

type Message = { id: string; role: "user" | "assistant"; content: string };

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Bonjour Socrate ! Je suis Tacynt AI. Comment puis-je vous aider avec vos finances aujourd'hui ?",
  },
];

export default function AiPage() {
  const { history, isHistoryLoading, sendMessage, isSending } = useAi();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history && history.length > 0) {
      setMessages(history
        .filter(msg => msg.role !== "system")
        .map(msg => ({
          id: msg._id || Math.random().toString(),
          role: msg.role as "user" | "assistant",
          content: msg.content
        }))
      );
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      const response = await sendMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.message,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Désolé, une erreur est survenue lors de la communication avec l'IA.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-40px)] sm:pt-4">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md z-10 sm:rounded-t-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight">Tacynt AI</h1>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En ligne
            </p>
          </div>
        </div>
      </motion.header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="flex flex-col gap-2 pb-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full mb-4"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isSending} />
    </div>
  );
}
