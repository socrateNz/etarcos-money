"use client";

import { Download, Share } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks";

export function InstallAppButton() {
  const { canInstall, isIos, promptInstall } = usePwaInstall();

  if (!canInstall && !isIos) return null;

  const handleClick = async () => {
    if (isIos) {
      toast.info("Ajoutez Tacynt Money à votre écran d'accueil", {
        description: "Appuyez sur le bouton Partager, puis \"Sur l'écran d'accueil\".",
        icon: <Share className="w-4 h-4" />,
        duration: 6000,
      });
      return;
    }

    const accepted = await promptInstall();
    if (accepted) {
      toast.success("Tacynt Money a été installé !");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className="rounded-2xl border-dashed hover:border-primary/40 hover:bg-primary/5"
    >
      <Download className="w-4 h-4 mr-2" />
      Installer l'application
    </Button>
  );
}
