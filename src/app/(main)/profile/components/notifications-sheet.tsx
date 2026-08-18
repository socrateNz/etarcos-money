import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { authQueries } from "@/queries";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { VAPID_PUBLIC_KEY } from "@/config";

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Convert urlB64 to Uint8Array for Web Push
function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Initialize state based on current permission if supported
  useEffect(() => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await authQueries.updateNotificationPreferences(data);
      return res.data?.data || res.data;
    },
    onSuccess: () => {
      toast.success("Préférences de notifications mises à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des préférences");
      setPushEnabled(false); // Reset on error
    },
    onSettled: () => {
      setIsSubscribing(false);
    }
  });

  const handlePushToggle = async (checked: boolean) => {
    setPushEnabled(checked);
    if (!checked) {
      // Just disable it in DB
      mutation.mutate({ pushEnabled: false });
      return;
    }

    // Enable push
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      toast.error("Les notifications Push ne sont pas supportées par ce navigateur.");
      setPushEnabled(false);
      return;
    }

    setIsSubscribing(true);
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Vous devez autoriser les notifications dans votre navigateur.");
      setPushEnabled(false);
      setIsSubscribing(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const publicKey = VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Clé VAPID publique manquante");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicKey),
      });

      mutation.mutate({ 
        pushEnabled: true,
        pushSubscription: JSON.parse(JSON.stringify(subscription))
      });
    } catch (error) {
      console.error("Push subscription failed", error);
      toast.error("Erreur lors de l'abonnement aux notifications Push.");
      setPushEnabled(false);
      setIsSubscribing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[2rem] h-[50vh] flex flex-col p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <Bell className="w-6 h-6 text-primary" />
            Notifications
          </SheetTitle>
          <SheetDescription>
            Gérez comment Tacynt Money interagit avec vous.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base">Notifications In-App</h4>
              <p className="text-sm text-muted-foreground">Recevoir des alertes dans l'application.</p>
            </div>
            <Switch 
              checked={inAppEnabled} 
              onCheckedChange={(val) => {
                setInAppEnabled(val);
                mutation.mutate({ inAppEnabled: val });
              }} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-base">Notifications Push</h4>
              <p className="text-sm text-muted-foreground">Recevoir des notifications système (même fermée).</p>
            </div>
            <Switch 
              checked={pushEnabled} 
              onCheckedChange={handlePushToggle}
              disabled={isSubscribing}
            />
          </div>
        </div>

        <Button className="w-full h-14 rounded-2xl mt-4" variant="outline" onClick={() => onOpenChange(false)}>
          Fermer
        </Button>
      </SheetContent>
    </Sheet>
  );
}
