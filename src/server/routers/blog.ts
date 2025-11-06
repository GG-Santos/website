import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional().default([]),
});

export const blogRouter = router({
  // Get all published blog posts (public)
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const where = {
          published: true,
          ...(input.category && { categories: { has: input.category } }),
        };

        const [posts, total] = await Promise.all([
          ctx.prisma.blogPost.findMany({
            where,
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  bio: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: input.limit,
            skip: input.offset,
          }),
          ctx.prisma.blogPost.count({ where }),
        ]);

        return {
          posts,
          total,
          hasMore: input.offset + input.limit < total,
        };
      } catch (error) {
        console.error("Error fetching published blog posts:", error);
        // Return empty results instead of throwing to prevent 500 errors
        // This allows the site to load even if database connection fails
        return {
          posts: [],
          total: 0,
          hasMore: false,
        };
      }
    }),

  // Get single blog post by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      // Only allow viewing unpublished posts if user is authenticated
      if (!post.published && !ctx.session?.user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      // Increment views
      await ctx.prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });

      return post;
    }),

  // Get single blog post by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      return post;
    }),

  // Get all blog posts (admin only)
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

      const [posts, total] = await Promise.all([
        ctx.prisma.blogPost.findMany({
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
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.blogPost.count({ where }),
      ]);

      return {
        posts,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Create blog post (admin only)
  create: protectedProcedure
    .input(blogPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Ensure slug is unique - append number if needed
      let slug = input.slug;
      let counter = 1;
      while (true) {
        const existing = await ctx.prisma.blogPost.findUnique({
          where: { slug },
        });

        if (!existing) {
          break;
        }

        slug = `${input.slug}-${counter}`;
        counter++;
      }

      const post = await ctx.prisma.blogPost.create({
        data: {
          ...input,
          slug,
          authorId: ctx.session.user.id,
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

      return post;
    }),

  // Update blog post (admin only)
  update: protectedProcedure
    .input(
      blogPostSchema.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Check if post exists
      const existing = await ctx.prisma.blogPost.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      // Check if slug is being changed and if new slug exists
      if (data.slug !== existing.slug) {
        // Ensure new slug is unique - append number if needed
        let slug = data.slug;
        let counter = 1;
        while (true) {
          const slugExists = await ctx.prisma.blogPost.findUnique({
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

      const post = await ctx.prisma.blogPost.update({
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

      return post;
    }),

  // Delete blog post (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      await ctx.prisma.blogPost.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get adjacent posts (for prev/next navigation)
  getAdjacent: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const current = await ctx.prisma.blogPost.findUnique({
        where: { slug: input.slug },
        select: { createdAt: true },
      });

      if (!current) {
        return { prev: null, next: null };
      }

      const [prev, next] = await Promise.all([
        ctx.prisma.blogPost.findFirst({
          where: {
            published: true,
            createdAt: { lt: current.createdAt },
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
        }),
        ctx.prisma.blogPost.findFirst({
          where: {
            published: true,
            createdAt: { gt: current.createdAt },
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
        }),
      ]);

      return { prev, next };
    }),

  // Get top articles for sidebar
  getTopArticles: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(3) }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { views: "desc" },
        take: input.limit,
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,
          views: true,
        },
      });

      return posts;
    }),

  // Get categories with counts
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.blogPost.findMany({
      where: { published: true },
      select: { categories: true },
    });

    const categoryCounts = new Map<string, number>();
    posts.forEach((post) => {
      post.categories.forEach((category) => {
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }),
});
