import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layouts/app/sidebar/app-sidebar";
import { SidebarInset } from "@shadcn/sidebar";
import { auth } from "@/lib/auth";
import type * as PageTree from "fumadocs-core/page-tree";

export async function AdminLayoutContent({
  children,
  pageTree,
}: {
  children: React.ReactNode;
  pageTree: PageTree.Root;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <>
      <AppSidebar
        pageTree={pageTree}
        user={{
          name: session.user.name || "Unknown User",
          email: session.user.email || "unknown@example.com",
          avatar: session.user.image || undefined,
        }}
        variant="inset"
      />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
