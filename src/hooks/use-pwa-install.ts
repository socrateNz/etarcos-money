import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/**
 * Wraps the browser's native PWA install flow. `beforeinstallprompt` only
 * fires on Chromium browsers (Chrome/Edge/Android) — iOS Safari has no
 * programmatic install API at all, so `isIos` is exposed separately so the
 * caller can show "Partager > Sur l'écran d'accueil" instructions instead.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    const ua = window.navigator.userAgent;
    setIsIos(/iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice.outcome === "accepted";
  }, [deferredPrompt]);

  return {
    // True once Chrome/Edge/Android has signaled the app is installable.
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    // True on iOS Safari when not already installed — no native prompt exists there.
    isIos: isIos && !isInstalled,
    promptInstall,
  };
}
