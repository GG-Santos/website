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
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Note: If you see errors about roadmapItem being undefined,
// restart your dev server to clear the Prisma client cache

export default prisma;

