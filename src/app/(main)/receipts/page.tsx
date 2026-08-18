"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { ArrowLeft, Camera, Loader2, Receipt as ReceiptIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReceipts } from "@/hooks";
import { CreateTransactionModal } from "@/features/transactions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReceiptsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadReceipt, isUploading, receipt, reset } = useReceipts();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      await uploadReceipt(base64);
    } catch (err) {
      console.error("Receipt upload failed", err);
      toast.error("Impossible d'analyser ce reçu, réessayez avec une photo plus nette.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const ocr = receipt?.ocrData;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 flex flex-col sm:p-6">
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scanner un reçu</h1>
          <p className="text-muted-foreground text-sm">L'IA extrait automatiquement le montant et le magasin</p>
        </div>
      </motion.header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {!receipt && (
        <motion.button
          variants={slideUpItem}
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-3xl py-16 mt-4 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="font-medium">Analyse du reçu en cours…</span>
            </>
          ) : (
            <>
              <Camera className="w-10 h-10" />
              <span className="font-medium">Prendre une photo ou importer un reçu</span>
            </>
          )}
        </motion.button>
      )}

      {receipt && (
        <motion.div variants={slideUpItem} className="flex flex-col gap-4 mt-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptIcon className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">{ocr?.store || "Reçu analysé"}</h2>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Montant total</span>
              <span className="text-2xl font-bold">{ocr?.amount !== undefined ? formatCurrency(ocr.amount) : "–"}</span>
            </div>
            {ocr?.products && ocr.products.length > 0 && (
              <div className="flex flex-col gap-2 mt-2 border-t border-border pt-3">
                {ocr.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(p.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full py-6 text-lg rounded-xl shadow-lg shadow-primary/25"
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Créer une transaction
          </Button>

          <Button variant="outline" className="w-full" onClick={() => reset()}>
            Scanner un autre reçu
          </Button>
        </motion.div>
      )}

      <CreateTransactionModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        defaultType="expense"
        initialValues={{
          description: ocr?.store,
          amount: ocr?.amount,
          date: ocr?.date ? new Date(ocr.date).toISOString().split("T")[0] : undefined,
        }}
      />
    </motion.div>
  );
}
