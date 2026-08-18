import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto relative h-full">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -z-10" />
        
        {children}
      </main>
    </div>
  );
}
