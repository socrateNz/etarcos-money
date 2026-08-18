"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/styles/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Settings, Shield, Bell, Moon, Sun, Globe, Smartphone,
  Download, LogOut, ChevronRight, Landmark, Tag, Repeat, ScanLine, HeartPulse,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";
import { useState } from "react";
import { EditProfileSheet } from "./components/edit-profile-sheet";
import { SecuritySheet } from "./components/security-sheet";
import { NotificationsSheet } from "./components/notifications-sheet";
import { toast } from "sonner";
import { authQueries } from "@/queries";
import { APP_NAME, APP_VERSION } from "@/config";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const { user } = useUserStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLanguageClick = async () => {
    const next = user?.language === "en" ? "fr" : "en";
    try {
      await authQueries.updateProfile({ language: next });
      toast.success(`Préférence enregistrée (${next === "fr" ? "Français" : "English"}).`, {
        description: "La traduction complète de l'interface arrivera dans une prochaine version.",
      });
    } catch {
      toast.error("Impossible d'enregistrer votre préférence de langue.");
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await authQueries.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `etarcos-money-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Vos données ont été téléchargées.");
    } catch {
      toast.error("L'export a échoué, réessayez.");
    } finally {
      setIsExporting(false);
    }
  };

  const sections = [
    {
      title: "Outils financiers",
      items: [
        { icon: Landmark, label: "Comptes", onClick: () => router.push("/accounts") },
        { icon: Tag, label: "Catégories", onClick: () => router.push("/categories") },
        { icon: Repeat, label: "Abonnements", onClick: () => router.push("/subscriptions") },
        { icon: ScanLine, label: "Scanner un reçu", onClick: () => router.push("/receipts") },
        { icon: HeartPulse, label: "Analyse financière", onClick: () => router.push("/insights") },
      ]
    },
    {
      title: "Préférences",
      items: [
        { icon: theme === "dark" ? Moon : Sun, label: "Thème", value: theme === "dark" ? "Sombre" : "Clair", onClick: toggleTheme },
        { icon: Globe, label: "Langue", value: user?.language === "en" ? "English" : "Français", onClick: handleLanguageClick },
        { icon: Bell, label: "Notifications", onClick: () => router.push("/notifications") },
      ]
    },
    {
      title: "Compte & Sécurité",
      items: [
        { icon: Shield, label: "Sécurité & Confidentialité", onClick: () => setIsSecurityModalOpen(true) },
        { icon: Bell, label: "Préférences de notifications", onClick: () => setIsNotificationsModalOpen(true) },
        { icon: Smartphone, label: "Appareils connectés", value: "1", onClick: () => toast.info("Vous avez 1 appareil connecté (cet appareil).") },
        { icon: Download, label: isExporting ? "Export en cours..." : "Exporter mes données", onClick: handleExportData },
      ]
    }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-4 flex flex-col sm:p-6"
    >
      <motion.header variants={slideUpItem} className="py-4 mb-2 flex flex-col items-center justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src="https://github.com/shadcn.png" alt={`@${user?.firstName || "socrate"}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
              {(user?.firstName || "S").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-background shadow-sm">
            <Settings className="w-4 h-4" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-4">
          {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Socrate"}
        </h1>
        <p className="text-muted-foreground text-sm">{user?.email || "socrate@etarcos.com"}</p>

        <Button
          className="mt-4 rounded-full px-6 shadow-sm"
          variant="secondary"
          onClick={() => setIsEditModalOpen(true)}
        >
          Modifier le profil
        </Button>
      </motion.header>

      <motion.div variants={slideUpItem} className="flex flex-col gap-6 mt-4">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              {section.title}
            </h3>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  onClick={item.onClick}
                  className={`flex items-center justify-between p-4 bg-transparent hover:bg-muted/50 transition-colors cursor-pointer ${
                    itemIdx !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {"value" in item && item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-2">
          <Button
            variant="destructive"
            className="w-full rounded-2xl h-14 font-semibold text-base shadow-sm"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Se déconnecter
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 mb-6">
          {APP_NAME} v{APP_VERSION}
        </p>
      </motion.div>

      <EditProfileSheet
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      <SecuritySheet
        open={isSecurityModalOpen}
        onOpenChange={setIsSecurityModalOpen}
      />

      <NotificationsSheet
        open={isNotificationsModalOpen}
        onOpenChange={setIsNotificationsModalOpen}
      />
    </motion.div>
  );
}
