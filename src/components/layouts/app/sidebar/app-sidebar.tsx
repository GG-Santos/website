"use client";

import {
  Home,
  Settings,
  BookOpen,
  FileText,
  Map,
  Image as ImageIcon,
  Target,
  MessageSquare,
  Info,
  Building2,
} from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";
import type * as React from "react";
import { NavDocsDynamic } from "@/components/layouts/app/sidebar/nav-docs-dynamic";
import { NavMain } from "@/components/layouts/app/sidebar/nav-main";
import { NavUser } from "@/components/layouts/app/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@shadcn/sidebar";

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/default.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Blog",
      url: "/admin/blog",
      icon: FileText,
    },
    {
      title: "Roadmap",
      url: "/admin/roadmap",
      icon: Map,
    },
    {
      title: "Game Assets",
      url: "/admin/game-asset",
      icon: ImageIcon,
    },
    {
      title: "Game Objectives",
      url: "/admin/game-objective",
      icon: Target,
    },
    {
      title: "Testimonials",
      url: "/admin/testimonial",
      icon: MessageSquare,
    },
    {
      title: "Techstack",
      url: "/admin/techstack",
      icon: Building2,
    },
    {
      title: "Site Settings",
      url: "/admin/site-settings",
      icon: Settings,
    },
    {
      title: "About",
      url: "/admin/about",
      icon: Info,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({
  pageTree,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  pageTree: PageTree.Root;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
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
                <Home className="!size-5" />
                <span className="font-semibold text-base">Website</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocsDynamic tree={pageTree} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user
              ? {
                  name: user.name,
                  email: user.email,
                  avatar: user.avatar || "/avatars/default.jpg",
                }
              : data.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}

