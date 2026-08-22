import { BottomNav, SidebarNav, OfflineBanner } from "@/features/navigation";
import { AuthGuard } from "@/providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-full pb-[80px] sm:pb-0 sm:pl-[80px]">
        <SidebarNav />
        <OfflineBanner />
        <main className="flex-1 w-full max-w-2xl mx-auto sm:max-w-7xl">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
