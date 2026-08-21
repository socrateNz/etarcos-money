"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";
import { AdminNav } from "@/features/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (isMounted && user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <AdminNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
