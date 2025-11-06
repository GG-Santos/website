"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/card";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { trpc } from "@/lib/trpc/client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  // Example tRPC query
  const { data: profile, isLoading: isLoadingProfile } = trpc.user.getProfile.useQuery(
    undefined,
    {
      enabled: !!session?.user,
    }
  );

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <Button
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                variant="outline"
              >
                Sign Out
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Session Info</CardTitle>
                  <CardDescription>Your current session details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span> {user.name || "Not set"}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="font-semibold">ID:</span> {user.id}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>tRPC Example</CardTitle>
                  <CardDescription>Data fetched via tRPC</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <p>Loading profile...</p>
                  ) : profile ? (
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Profile Name:</span> {profile.name}
                      </div>
                      <div>
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <p>No profile data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Welcome to Your Dashboard</CardTitle>
                <CardDescription>
                  This is a protected route using Better Auth + tRPC + Prisma + Fumadocs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    You're successfully authenticated! This dashboard demonstrates:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>✅ Better Auth for authentication</li>
                    <li>✅ tRPC for type-safe API calls</li>
                    <li>✅ Prisma ORM with MongoDB</li>
                    <li>✅ Zod for validation</li>
                    <li>✅ Protected routes with server-side auth</li>
                    <li>✅ Fumadocs sidebar with navigation</li>
                    <li>✅ shadcn/ui components</li>
                  </ul>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Try the sidebar:</strong> Navigate to the Documentation section
                      or explore the admin navigation on the left!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

