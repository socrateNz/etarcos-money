import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 overflow-hidden">
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto relative h-full">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent -z-10" />
        <div className="absolute -top-10 -right-16 w-56 h-56 bg-primary/25 rounded-full blur-3xl -z-10" />
        <div className="absolute top-36 -left-16 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -z-10" />
        <div
          className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {children}
      </main>
    </div>
  );
}
