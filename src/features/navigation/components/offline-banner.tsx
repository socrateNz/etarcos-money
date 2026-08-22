"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const pendingCount = useIsMutating();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      toast.success("Connexion rétablie — synchronisation en cours...");
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-medium px-4 py-2 border-b border-amber-500/20"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            Hors ligne — vos actions seront synchronisées à la reconnexion
            {pendingCount > 0 ? ` (${pendingCount} en attente)` : ""}.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
