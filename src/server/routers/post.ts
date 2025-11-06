import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

// Example post router - you can customize this for your needs
export const postRouter = router({
  // Example: Get all posts (you'll need to add Post model to schema)
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // This is a placeholder - add Post model to your Prisma schema
      return {
        items: [],
        nextCursor: null,
      };
    }),

  // Example: Create a post
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(100),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Placeholder - add Post model to implement
      return {
        success: true,
        message: "Add Post model to Prisma schema to implement this",
      };
    }),
});

