import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const roadmapItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().url("Featured image must be a valid URL"),
  gallery: z.array(z.string().url()).default([]),
  youtubeVideoId: z.string().optional().nullable(),
  displayDate: z.date().optional().nullable(),
  published: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional().default([]),
});

export const roadmapRouter = router({
  // Get all published roadmap items (public)
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
        ctx.prisma.roadmapItem.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" }, // Sort by createdAt ascending (oldest first), displayDate can be set in admin
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.roadmapItem.count({ where }),
      ]);

      return {
        items,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get single roadmap item by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.roadmapItem.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap item not found",
        });
      }

      // Only allow viewing unpublished items if user is authenticated
      if (!item.published && !ctx.session?.user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap item not found",
        });
      }

      // Increment views
      await ctx.prisma.roadmapItem.update({
        where: { id: item.id },
        data: { views: { increment: 1 } },
      });

      return item;
    }),

  // Get single roadmap item by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.roadmapItem.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap item not found",
        });
      }

      return item;
    }),

  // Get all roadmap items (admin only)
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        published: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.published !== undefined ? { published: input.published } : {};

      const [items, total] = await Promise.all([
        ctx.prisma.roadmapItem.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "asc" }, // Sort by createdAt ascending (oldest first), displayDate can be set in admin
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.roadmapItem.count({ where }),
      ]);

      return {
        items,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Create roadmap item (admin only)
  create: protectedProcedure
    .input(roadmapItemSchema)
    .mutation(async ({ ctx, input }) => {
      // Ensure slug is unique - append number if needed
      let slug = input.slug;
      let counter = 1;
      while (true) {
        const existing = await ctx.prisma.roadmapItem.findUnique({
          where: { slug },
        });

        if (!existing) {
          break;
        }

        slug = `${input.slug}-${counter}`;
        counter++;
      }

      const item = await ctx.prisma.roadmapItem.create({
        data: {
          ...input,
          slug,
          authorId: ctx.session.user.id,
          displayDate: input.displayDate || null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return item;
    }),

  // Update roadmap item (admin only)
  update: protectedProcedure
    .input(
      roadmapItemSchema.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check if item exists
      const existing = await ctx.prisma.roadmapItem.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap item not found",
        });
      }

      // Check if slug is being changed and if new slug exists
      if (data.slug !== existing.slug) {
        // Ensure new slug is unique - append number if needed
        let slug = data.slug;
        let counter = 1;
        while (true) {
          const slugExists = await ctx.prisma.roadmapItem.findUnique({
            where: { slug },
          });

          if (!slugExists || slugExists.id === id) {
            break;
          }

          slug = `${data.slug}-${counter}`;
          counter++;
        }
        data.slug = slug;
      }

      const item = await ctx.prisma.roadmapItem.update({
        where: { id },
        data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return item;
    }),

  // Delete roadmap item (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.roadmapItem.findUnique({
        where: { id: input.id },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roadmap item not found",
        });
      }

      await ctx.prisma.roadmapItem.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get adjacent items (for prev/next navigation)
  getAdjacent: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const current = await ctx.prisma.roadmapItem.findUnique({
        where: { slug: input.slug },
        select: { createdAt: true },
      });

      if (!current) {
        return { prev: null, next: null };
      }

      const [prev, next] = await Promise.all([
        ctx.prisma.roadmapItem.findFirst({
          where: {
            published: true,
            createdAt: { lt: current.createdAt },
          },
          orderBy: { createdAt: "asc" }, // Sort by createdAt ascending (oldest first), displayDate can be set in admin
          select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
          },
        }),
        ctx.prisma.roadmapItem.findFirst({
          where: {
            published: true,
            createdAt: { gt: current.createdAt },
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
          },
        }),
      ]);

      return { prev, next };
    }),
});
