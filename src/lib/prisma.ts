import { PrismaClient } from "@/generated/client/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL environment variable is not set. Please set it in your Vercel project settings."
  );
  throw new Error(
    "DATABASE_URL environment variable is required. Please configure it in Vercel project settings."
  );
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Add connection pool configuration for better reliability
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Test database connection on initialization (only in production to avoid blocking dev)
if (process.env.NODE_ENV === "production") {
  prisma.$connect().catch((error) => {
    console.error("❌ Failed to connect to database:", {
      message: error instanceof Error ? error.message : String(error),
      DATABASE_URL_set: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL.substring(0, 20)}...`
        : "not set",
    });
  });
}

// Note: If you see errors about roadmapItem being undefined,
// restart your dev server to clear the Prisma client cache

export default prisma;

