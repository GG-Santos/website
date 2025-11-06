"use client";
import { cva } from "class-variance-authority";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { TreeContextProvider, useTreeContext } from "fumadocs-ui/contexts/tree";
import { type ComponentProps, type ReactNode, useMemo } from "react";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { cn } from "@/lib/utils";

export type DocsLayoutProps = {
  tree: PageTree.Root;
  children: ReactNode;
  hideSidebar?: boolean;
};

export function DocsLayout({
  tree,
  children,
  hideSidebar = false,
}: DocsLayoutProps) {
  return (
    <TreeContextProvider tree={tree}>
      <SiteHeader title="Documentation" />

      <main
        className="flex flex-1 flex-row [--fd-nav-height:56px]"
        id="nd-docs-layout"
      >
        {!hideSidebar && <Sidebar />}
        {children}
      </main>
    </TreeContextProvider>
  );
}

function _SearchToggle(props: ComponentProps<"button">) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) {
    return;
  }

  return (
    <button
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpenSearch(true)}
    >
      Search
    </button>
  );
}

function _NavbarSidebarTrigger(props: ComponentProps<"button">) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      {...props}
      className={cn("text-sm", props.className)}
      onClick={() => setOpen(!open)}
    >
      Sidebar
    </button>
  );
}

function Sidebar() {
  const { root } = useTreeContext();
  const { open } = useSidebar();

  const children = useMemo(() => {
    function renderItems(items: PageTree.Node[]) {
      return items.map((item) => (
        <SidebarItem item={item} key={item.$id}>
          {item.type === "folder" ? renderItems(item.children) : null}
        </SidebarItem>
      ));
    }

    return renderItems(root.children);
  }, [root]);

  return (
    <aside
      className={cn(
        "fixed top-14 z-20 flex shrink-0 flex-col overflow-auto p-4 text-sm md:sticky md:h-[calc(100dvh-56px)] md:w-[300px]",
        "max-md:inset-x-0 max-md:bottom-0 max-md:bg-fd-background",
        !open && "max-md:invisible"
      )}
    >
      {children}
    </aside>
  );
}

const linkVariants = cva(
  "flex w-full items-center gap-2 rounded-lg py-1.5 text-fd-foreground/80 [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "font-medium text-fd-primary",
        false: "hover:text-fd-accent-foreground",
      },
    },
  }
);

function SidebarItem({
  item,
  children,
}: {
  item: PageTree.Node;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (item.type === "page") {
    return (
      <Link
        className={linkVariants({
          active: pathname === item.url,
        })}
        href={item.url}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }

  if (item.type === "separator") {
    return (
      <p className="mt-6 mb-2 text-fd-muted-foreground first:mt-0">
        {item.icon}
        {item.name}
      </p>
    );
  }

  return (
    <div>
      {item.index ? (
        <Link
          className={linkVariants({
            active: pathname === item.index.url,
          })}
          href={item.index.url}
        >
          {item.index.icon}
          {item.index.name}
        </Link>
      ) : (
        <p className={cn(linkVariants(), "text-start")}>
          {item.icon}
          {item.name}
        </p>
      )}
      <div className="flex flex-col border-l pl-4">{children}</div>
    </div>
  );
}

