import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError: ({ path, error }) => {
      // Always log errors, but with different detail levels
      if (process.env.NODE_ENV === "development") {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          error
        );
      } else {
        // In production, log errors to help diagnose issues
        console.error(
          `❌ tRPC error on ${path ?? "<no-path>"}: ${error.message}`
        );
        // Log full error details if it's a database connection issue
        if (
          error.message.includes("DATABASE_URL") ||
          error.message.includes("connection") ||
          error.message.includes("Prisma") ||
          error.cause
        ) {
          console.error("Database connection error details:", {
            message: error.message,
            code: error.code,
            cause: error.cause,
          });
        }
      }
    },
  });

export { handler as GET, handler as POST };

