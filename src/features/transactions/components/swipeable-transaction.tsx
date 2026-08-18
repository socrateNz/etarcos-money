"use client";

import { useRef, useState } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Trash2, Edit2, type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface SwipeableTransactionProps {
  id: string | number;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: LucideIcon;
  colorClass: string;
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
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-border touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{title}</p>
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
