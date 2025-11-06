"use client";

import {
  FileText,
  Folder,
  Search,
} from "lucide-react";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@shadcn/sidebar";
import { cn } from "@/lib/utils";

export function NavDocsDynamic({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  const { enabled, setOpenSearch } = useSearchContext();

  const renderItems = (items: PageTree.Node[]): React.ReactNode[] => {
    return items.map((item) => {
      if (item.type === "page") {
        return (
          <SidebarMenuItem key={item.$id}>
            <SidebarMenuButton asChild>
              <Link
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg py-1.5 text-sidebar-foreground/80 hover:text-sidebar-accent-foreground",
                  pathname === item.url && "font-medium text-sidebar-primary"
                )}
                href={item.url}
              >
                <FileText className="size-4" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }

      if (item.type === "separator") {
        return (
          <SidebarMenuItem key={item.$id}>
            <div className="mt-6 mb-2 flex items-center gap-2 text-sidebar-muted-foreground first:mt-0">
              <Folder className="size-4" />
              <span className="font-medium text-sm">{item.name}</span>
            </div>
          </SidebarMenuItem>
        );
      }

      // Handle folder type
      return (
        <SidebarMenuItem key={item.$id}>
          <div className="space-y-1">
            {item.index ? (
              <SidebarMenuButton asChild>
                <Link
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg py-1.5 text-sidebar-foreground/80 hover:text-sidebar-accent-foreground",
                    pathname === item.index.url &&
                      "font-medium text-sidebar-primary"
                  )}
                  href={item.index.url}
                >
                  <Folder className="size-4" />
                  <span>{item.index.name}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1.5 text-sidebar-muted-foreground">
                <Folder className="size-4" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            )}
            {item.children && item.children.length > 0 && (
              <div className="ml-4 space-y-1">{renderItems(item.children)}</div>
            )}
          </div>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documentation</SidebarGroupLabel>
      <SidebarMenu>
        {enabled && (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="size-4" />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {renderItems(tree.children)}
      </SidebarMenu>
    </SidebarGroup>
  );
}

