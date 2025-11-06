import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
      },
    });
    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50).optional(),
        image: z.string().url().optional().or(z.literal("")),
        bio: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: {
        name?: string;
        image?: string | null;
        bio?: string | null;
      } = {};
      
      if (input.name !== undefined) {
        updateData.name = input.name;
      }
      
      if (input.image !== undefined) {
        updateData.image = input.image || null;
      }
      
      if (input.bio !== undefined) {
        updateData.bio = input.bio || null;
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: updateData,
      });
      return updatedUser;
    }),

  // Delete account
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Delete user will cascade delete all related data (sessions, accounts, blog posts, etc.)
    await ctx.prisma.user.delete({
      where: { id: ctx.session.user.id },
    });
    return { success: true };
  }),

  // Get user by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      });
      return user;
    }),
});

