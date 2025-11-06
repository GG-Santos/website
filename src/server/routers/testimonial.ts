import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const MAX_TESTIMONIALS = 8;

const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const testimonialRouter = router({
  // Get all published testimonials (public) - limited to 8
  getPublished: publicProcedure.query(async ({ ctx }) => {
    try {
      const testimonials = await ctx.prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
        take: MAX_TESTIMONIALS,
      });

      return testimonials;
    } catch (error) {
      console.error("Error fetching published testimonials:", error);
      return [];
    }
  }),

  // Get all testimonials (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const testimonials = await ctx.prisma.testimonial.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return testimonials;
  }),

  // Get count of testimonials (admin only)
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.testimonial.count();
    return { count, max: MAX_TESTIMONIALS };
  }),

  // Get single testimonial by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const testimonial = await ctx.prisma.testimonial.findUnique({
        where: { id: input.id },
      });

      if (!testimonial) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimonial not found",
        });
      }

      return testimonial;
    }),

  // Create new testimonial (admin only) - with max 8 limit check
  create: protectedProcedure
    .input(testimonialSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if we've reached the maximum limit
      const count = await ctx.prisma.testimonial.count();
      if (count >= MAX_TESTIMONIALS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Maximum limit of ${MAX_TESTIMONIALS} testimonials reached. Please delete one before creating a new one.`,
        });
      }

      const testimonial = await ctx.prisma.testimonial.create({
        data: input,
      });

      return testimonial;
    }),

  // Update testimonial (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: testimonialSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const testimonial = await ctx.prisma.testimonial.findUnique({
        where: { id },
      });

      if (!testimonial) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimonial not found",
        });
      }

      const updated = await ctx.prisma.testimonial.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // Delete testimonial (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.testimonial.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

