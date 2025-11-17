"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileUpload,
  IconCheck,
  IconBriefcase,
  IconFileCheck,
  IconUsers,
  IconSearch,
  IconSettings,
  IconMapPin,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { ThemeToggleSidebar } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@workspace/ui/components/sidebar";
import type { User } from "@/lib/types";
import Link from "next/link";

interface RoleSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function RoleSidebar({ user, ...props }: RoleSidebarProps) {
  const getNavItems = () => {
    switch (user.role) {
      case "YOUTH":
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: "Profile",
            url: "/dashboard/profile",
            icon: IconSettings,
          },
          {
            title: "Upload Documents",
            url: "/dashboard/documents",
            icon: IconFileUpload,
          },
          {
            title: "Verification Status",
            url: "/dashboard/verification",
            icon: IconCheck,
          },
          {
            title: "Opportunities",
            url: "/dashboard/opportunities",
            icon: IconBriefcase,
          },
          {
            title: "My Applications",
            url: "/dashboard/applications",
            icon: IconFileCheck,
          },
        ];
      case "DONOR":
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: "Post Opportunity",
            url: "/dashboard/opportunities/new",
            icon: IconBriefcase,
          },
          {
            title: "My Opportunities",
            url: "/dashboard/opportunities",
            icon: IconFileCheck,
          },
          {
            title: "Search Youth",
            url: "/dashboard/search",
            icon: IconSearch,
          },
        ];
      case "ADMIN":
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: "Pending Verifications",
            url: "/dashboard/verifications",
            icon: IconClipboardCheck,
          },
          {
            title: "All Users",
            url: "/dashboard/users",
            icon: IconUsers,
          },
        ];
      case "FIELD_AGENT":
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: "My Assignments",
            url: "/dashboard/assignments",
            icon: IconMapPin,
          },
          {
            title: "Field Visits",
            url: "/dashboard/visits",
            icon: IconCheck,
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <IconDashboard className="size-4" />
                </div>
                <span className="text-base font-semibold">RiseUp Africa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <SidebarGroup>
          <SidebarGroupContent>
            <ThemeToggleSidebar />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

