import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const techstackSchema = z.object({
  name: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL"),
  url: z.union([z.string().url("URL must be a valid URL"), z.literal("")]).optional(),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const techstackRouter = router({
  // Get all published techstack items (public)
  getPublished: publicProcedure.query(async ({ ctx }) => {
    try {
      const techstack = await ctx.prisma.investor.findMany({
        where: { published: true },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return techstack;
    } catch (error) {
      console.error("Error fetching published techstack:", error);
      return [];
    }
  }),

  // Get all techstack items (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const techstack = await ctx.prisma.investor.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return techstack;
  }),

  // Get single techstack item by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const techstack = await ctx.prisma.investor.findUnique({
        where: { id: input.id },
      });

      if (!techstack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Techstack item not found",
        });
      }

      return techstack;
    }),

  // Create new techstack item (admin only)
  create: protectedProcedure
    .input(techstackSchema)
    .mutation(async ({ ctx, input }) => {
      const techstack = await ctx.prisma.investor.create({
        data: {
          ...input,
          url: input.url || undefined,
        },
      });

      return techstack;
    }),

  // Update techstack item (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: techstackSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const techstack = await ctx.prisma.investor.findUnique({
        where: { id },
      });

      if (!techstack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Techstack item not found",
        });
      }

      const updated = await ctx.prisma.investor.update({
        where: { id },
        data: {
          ...data,
          url: data.url === "" ? undefined : data.url,
        },
      });

      return updated;
    }),

  // Delete techstack item (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.investor.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

