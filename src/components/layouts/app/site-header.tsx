"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Separator } from "@shadcn/separator";
import { SidebarTrigger } from "@shadcn/sidebar";

type SiteHeaderProps = {
  title: string;
};

export function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <h1 className="font-medium text-base">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  );
}

