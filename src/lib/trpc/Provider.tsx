"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "./client";

// Get the base URL for tRPC
// In production, use the current origin (window.location.origin)
// This ensures it works even if NEXT_PUBLIC_APP_URL is not set
function getTRPCUrl(): string {
  // Client-side: use current origin
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/trpc`;
  }
  // Server-side: use environment variable or fallback
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trpc`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getTRPCUrl(),
          transformer: superjson,
          headers() {
            return {
              "x-trpc-source": "client",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

