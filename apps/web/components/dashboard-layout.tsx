"use client";

import { useAuth } from "@/hooks/use-auth";
import { RoleSidebar } from "@/components/role-sidebar";
import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { SiteHeader } from "@/components/site-header";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <SidebarProvider>
      <RoleSidebar user={user} />
      <SidebarInset>
        <SiteHeader user={user} />
        <Separator />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

