import { Suspense } from "react";
import { AppSidebar } from "@/components/layouts/app/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@shadcn/sidebar";
import { source } from "@/lib/docs/source";
import { AdminLayoutContent } from "./layout-content";

export default function AdminLayout({
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
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
          </div>
        }
      >
        <AdminLayoutContent pageTree={source.pageTree}>
          {children}
        </AdminLayoutContent>
      </Suspense>
    </SidebarProvider>
  );
}