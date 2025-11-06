import { PrismaClient } from "@/generated/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Note: If you see errors about roadmapItem being undefined,
// restart your dev server to clear the Prisma client cache

export default prisma;

