import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tacynt Money AI",
  description: "Assistant financier intelligent et gestion de budget",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tacynt Money AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ThemeProvider, ReactQueryProvider } from "@/providers";
import { Toaster } from "sonner";
import { APPLE_SPLASH_SCREENS } from "@/config/splash-screens";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* iOS doesn't build a splash screen from the manifest like Android does, so it needs one
            literal <link> per device size/orientation. See src/config/splash-screens.ts. */}
        {APPLE_SPLASH_SCREENS.map((screen) => (
          <link key={screen.href + screen.media} rel="apple-touch-startup-image" href={screen.href} media={screen.media} />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
