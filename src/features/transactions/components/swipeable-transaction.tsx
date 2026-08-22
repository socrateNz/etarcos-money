"use client";

import { useRef, useState } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Trash2, Edit2, Clock, type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface SwipeableTransactionProps {
  id: string | number;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: LucideIcon;
  colorClass: string;
  isPending?: boolean;
  onDelete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
}

const SWIPE_THRESHOLD = 60; // minimum drag distance to trigger action

export function SwipeableTransaction({
  id,
  title,
  category,
  amount,
  date,
  icon: Icon,
  colorClass,
  isPending,
  onDelete,
  onEdit,
}: SwipeableTransactionProps) {
  const controls = useAnimation();
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Nothing to edit/delete yet — it hasn't synced to the server, so it has
    // no real id (and may still fail once actually sent).
    if (isPending) {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
      return;
    }

    setIsSwiping(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      // Swiped left (Delete)
      await controls.start({ x: -100, transition: { type: "spring", stiffness: 300, damping: 20 } });
      setTimeout(() => {
        onDelete?.(id);
        controls.start({ x: 0 }); // reset after delete
      }, 300);
    } else if (offset > SWIPE_THRESHOLD || velocity > 500) {
      // Swiped right (Edit)
      await controls.start({ x: 100, transition: { type: "spring", stiffness: 300, damping: 20 } });
      setTimeout(() => {
        onEdit?.(id);
        controls.start({ x: 0 }); // reset
      }, 300);
    } else {
      // Return to center
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-muted/50 mb-3" ref={containerRef}>
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center px-4">
        <div className="flex items-center text-blue-500">
          <Edit2 className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">Modifier</span>
        </div>
        <div className="flex items-center text-red-500">
          <span className="text-sm font-semibold mr-2">Supprimer</span>
          <Trash2 className="w-5 h-5" />
        </div>
      </div>

      {/* Draggable Foreground */}
      <motion.div
        drag={isPending ? false : "x"}
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={`relative z-10 flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-border touch-pan-y ${
          isPending ? "opacity-60" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm flex items-center gap-1.5">
              {title}
              {isPending && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                  <Clock className="w-2.5 h-2.5" /> En attente
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {category} • {date}
            </p>
          </div>
        </div>
        <div className={`font-semibold ${amount > 0 ? "text-emerald-500" : ""}`}>
          {amount > 0 ? "+" : ""}
          {formatCurrency(amount)}
        </div>
      </motion.div>
    </div>
  );
}
