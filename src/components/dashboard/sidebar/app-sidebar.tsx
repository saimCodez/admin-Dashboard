"use client";

import * as React from "react";
import {
  IconDashboard,
  
  IconBook,
  IconReportAnalytics,
  IconSettings,
  IconHelp,
  
  IconSchool,
  
  IconCalendar,
} from "@tabler/icons-react";

import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "John Student",
    email: "john.student@example.com",
    avatar: "/avatars/student.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
   {
      title: "Students",
      url: "/dashboard/students",
      icon: IconBook,
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: IconBook,
    },
    {
      title: "Grades",
      url: "/dashboard/grades",
      icon: IconReportAnalytics,
    },
    {
      title: "Schedule",
      url: "/dashboard/schedule",
      icon: IconCalendar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconSchool className="!size-5" />
                <span className="text-base font-semibold">Student Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  );
}