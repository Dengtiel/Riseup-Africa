"use client";

import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import type { User } from "@/lib/types"

export function SiteHeader({ user }: { user: User }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <h1 className="text-base font-medium">
          {user.role === "YOUTH" && "My Dashboard"}
          {user.role === "DONOR" && "Donor Dashboard"}
          {user.role === "ADMIN" && "Admin Dashboard"}
          {user.role === "FIELD_AGENT" && "Field Agent Dashboard"}
        </h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
