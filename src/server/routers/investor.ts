import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const investorSchema = z.object({
  name: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL"),
  url: z.union([z.string().url("URL must be a valid URL"), z.literal("")]).optional(),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const investorRouter = router({
  // Get all published investors (public)
  getPublished: publicProcedure.query(async ({ ctx }) => {
    try {
      const investors = await ctx.prisma.investor.findMany({
        where: { published: true },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return investors;
    } catch (error) {
      console.error("Error fetching published investors:", error);
      return [];
    }
  }),

  // Get all investors (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const investors = await ctx.prisma.investor.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return investors;
  }),

  // Get single investor by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const investor = await ctx.prisma.investor.findUnique({
        where: { id: input.id },
      });

      if (!investor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Investor not found",
        });
      }

      return investor;
    }),

  // Create new investor (admin only)
  create: protectedProcedure
    .input(investorSchema)
    .mutation(async ({ ctx, input }) => {
      const investor = await ctx.prisma.investor.create({
        data: {
          ...input,
          url: input.url || undefined,
        },
      });

      return investor;
    }),

  // Update investor (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: investorSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const investor = await ctx.prisma.investor.findUnique({
        where: { id },
      });

      if (!investor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Investor not found",
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

  // Delete investor (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.investor.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

