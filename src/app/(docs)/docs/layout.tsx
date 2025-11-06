import { AppSidebar } from "@/components/layouts/app/sidebar/app-sidebar";
import { DocsLayout } from "@/components/layouts/docs/docs";
import { SidebarInset, SidebarProvider } from "@shadcn/sidebar";
import { baseOptions } from "@/lib/docs/layout.shared";
import { source } from "@/lib/docs/source";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        pageTree={source.pageTree}
        variant="inset"
      />
      <SidebarInset>
        <DocsLayout tree={source.pageTree} {...baseOptions()} hideSidebar>
          {children}
        </DocsLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}

