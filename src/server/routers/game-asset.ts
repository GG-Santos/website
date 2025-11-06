import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const gameAssetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().url("Image must be a valid URL"),
  description: z.string().optional().nullable().refine(
    (val) => {
      if (!val) return true;
      const words = val.trim().split(/\s+/).filter(Boolean);
      return words.length <= 100;
    },
    { message: "Description must be 100 words or less" }
  ),
  blogLink: z.string().optional().nullable().refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Blog link must be a valid URL" }
  ),
  difficulty: z.number().int().min(1).max(5),
  pinned: z.boolean().default(false),
  category: z.string().min(1, "Category is required"),
  type: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

export const gameAssetRouter = router({
  // Get featured assets for homepage (pinned or 6 newest)
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    try {
      // First try to get pinned items
      const pinnedItems = await ctx.prisma.gameAsset.findMany({
        where: { pinned: true, published: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      });

      // If we have pinned items, return them
      if (pinnedItems.length > 0) {
        return { items: pinnedItems };
      }

      // Otherwise, return 6 newest published items
      const newestItems = await ctx.prisma.gameAsset.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      });

      return { items: newestItems };
    } catch (error) {
      console.error("Error fetching featured game assets:", error);
      return { items: [] };
    }
  }),

  // Get all published assets (public)
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = { published: true };

      const [items, total] = await Promise.all([
        ctx.prisma.gameAsset.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.gameAsset.count({ where }),
      ]);

      return {
        items,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get all assets (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.gameAsset.findMany({
      orderBy: { createdAt: "desc" },
    });

    return items;
  }),

  // Get single asset by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.gameAsset.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game asset not found",
        });
      }

      return item;
    }),

  // Create new asset (admin only)
  create: protectedProcedure
    .input(gameAssetSchema)
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.gameAsset.create({
        data: {
          ...input,
          description: input.description && input.description.trim() !== "" ? input.description.trim() : null,
          blogLink: input.blogLink && input.blogLink.trim() !== "" ? input.blogLink.trim() : null,
          type: input.type && input.type.trim() !== "" ? input.type.trim() : null,
        },
      });

      return item;
    }),

  // Update asset (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: gameAssetSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const item = await ctx.prisma.gameAsset.findUnique({
        where: { id },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game asset not found",
        });
      }

      const updated = await ctx.prisma.gameAsset.update({
        where: { id },
        data: {
          ...data,
          description: data.description !== undefined 
            ? (data.description && data.description.trim() !== "" ? data.description.trim() : null)
            : undefined,
          blogLink: data.blogLink !== undefined 
            ? (data.blogLink && data.blogLink.trim() !== "" ? data.blogLink.trim() : null)
            : undefined,
          type: data.type !== undefined 
            ? (data.type && data.type.trim() !== "" ? data.type.trim() : null)
            : undefined,
        },
      });

      return updated;
    }),

  // Delete asset (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.gameAsset.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Toggle pin status (admin only)
  togglePin: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.gameAsset.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game asset not found",
        });
      }

      const updated = await ctx.prisma.gameAsset.update({
        where: { id: input.id },
        data: { pinned: !item.pinned },
      });

      return updated;
    }),
});

