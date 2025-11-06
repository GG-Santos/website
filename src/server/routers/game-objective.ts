import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const gameObjectiveSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const gameObjectiveRouter = router({
  // Get all published objectives (public)
  getPublished: publicProcedure.query(async ({ ctx }) => {
    try {
      const objectives = await ctx.prisma.gameObjective.findMany({
        where: { published: true },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return objectives;
    } catch (error) {
      console.error("Error fetching published game objectives:", error);
      return [];
    }
  }),

  // Get all objectives (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const objectives = await ctx.prisma.gameObjective.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return objectives;
  }),

  // Get single objective by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const objective = await ctx.prisma.gameObjective.findUnique({
        where: { id: input.id },
      });

      if (!objective) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game objective not found",
        });
      }

      return objective;
    }),

  // Create new objective (admin only)
  create: protectedProcedure
    .input(gameObjectiveSchema)
    .mutation(async ({ ctx, input }) => {
      const objective = await ctx.prisma.gameObjective.create({
        data: input,
      });

      return objective;
    }),

  // Update objective (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: gameObjectiveSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const objective = await ctx.prisma.gameObjective.findUnique({
        where: { id },
      });

      if (!objective) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game objective not found",
        });
      }

      const updated = await ctx.prisma.gameObjective.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // Delete objective (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.gameObjective.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

