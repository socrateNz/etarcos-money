"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Loader2 } from "lucide-react";
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from "date-fns";
import { authQueries } from "@/queries";
import { toast } from "sonner";

interface ExportDataSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PeriodOption = "day" | "week" | "month" | "all" | "custom";

const PERIOD_LABELS: Record<PeriodOption, string> = {
  day: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois",
  all: "Tout",
  custom: "Période personnalisée",
};

function getPeriodRange(period: PeriodOption, customStart: string, customEnd: string): { startDate?: string; endDate?: string } {
  const now = new Date();
  switch (period) {
    case "day":
      return { startDate: startOfDay(now).toISOString(), endDate: endOfDay(now).toISOString() };
    case "week":
      return { startDate: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), endDate: endOfDay(now).toISOString() };
    case "month":
      return { startDate: startOfMonth(now).toISOString(), endDate: endOfDay(now).toISOString() };
    case "custom":
      return {
        startDate: customStart ? startOfDay(new Date(customStart)).toISOString() : undefined,
        endDate: customEnd ? endOfDay(new Date(customEnd)).toISOString() : undefined,
      };
    case "all":
    default:
      return {};
  }
}

export function ExportDataSheet({ open, onOpenChange }: ExportDataSheetProps) {
  const [period, setPeriod] = useState<PeriodOption>("month");
  const [customStart, setCustomStart] = useState(new Date().toISOString().split("T")[0]);
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split("T")[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const { startDate, endDate } = getPeriodRange(period, customStart, customEnd);
      const blob = (await authQueries.exportData({ format: "pdf", startDate, endDate })) as unknown as Blob;
      downloadBlob(blob, `tacynt-money-releve-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Relevé PDF téléchargé.");
      onOpenChange(false);
    } catch {
      toast.error("L'export a échoué, réessayez.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJson = async () => {
    setIsDownloading(true);
    try {
      const data = await authQueries.exportData({ format: "json" });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      downloadBlob(blob, `tacynt-money-export-${new Date().toISOString().split("T")[0]}.json`);
      toast.success("Vos données ont été téléchargées.");
      onOpenChange(false);
    } catch {
      toast.error("L'export a échoué, réessayez.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[2rem] flex flex-col p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <Download className="w-6 h-6 text-primary" />
            Exporter mes données
          </SheetTitle>
          <SheetDescription>
            Téléchargez un relevé PDF de vos transactions pour la période de votre choix.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Période</label>
            <div className="grid grid-cols-2 gap-2">
              {(["day", "week", "month", "all"] as const).map((opt) => (
                <Button
                  key={opt}
                  type="button"
                  variant={period === opt ? "default" : "outline"}
                  className="rounded-xl"
                  onClick={() => setPeriod(opt)}
                >
                  {PERIOD_LABELS[opt]}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant={period === "custom" ? "default" : "outline"}
              className="rounded-xl w-full mt-2"
              onClick={() => setPeriod("custom")}
            >
              {PERIOD_LABELS.custom}
            </Button>
          </div>

          {period === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Du</label>
                <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-muted-foreground">Au</label>
                <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
              </div>
            </div>
          )}

          <Button
            className="w-full h-14 rounded-2xl font-semibold text-base"
            disabled={isDownloading}
            onClick={handleDownloadPdf}
          >
            {isDownloading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileText className="w-5 h-5 mr-2" />}
            Télécharger le relevé PDF
          </Button>

          <button
            type="button"
            onClick={handleDownloadJson}
            disabled={isDownloading}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Exporter toutes mes données (JSON complet)
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
