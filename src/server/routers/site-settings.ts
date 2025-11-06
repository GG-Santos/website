import { z } from "zod";
import type { PageKey } from "@/lib/site-settings";
import {
  footerLinkSchema,
  homeSectionsSchema,
  menuItemSchema,
  pageContentSchema,
  pageKeySchema,
  aboutHomeSectionSchema,
  aboutPageSchema,
  teamMemberSchema,
} from "@/lib/site-settings";
import { backgroundImageSchema } from "@/lib/site-settings/schema";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/site-settings-server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

const headerSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  menuItems: z.array(menuItemSchema).min(1, "At least one menu item is required"),
});

const pageEntrySchema = z.object({
  key: pageKeySchema,
  title: pageContentSchema.shape.title,
  subtitle: pageContentSchema.shape.subtitle,
});

const footerSchema = z.object({
  text: z.string().min(1, "Footer text is required"),
  links: z.array(footerLinkSchema).min(1, "At least one footer link is required"),
});

export const siteSettingsRouter = router({
  get: publicProcedure.query(async () => {
    return getSiteSettings();
  }),

  updateHeader: protectedProcedure.input(headerSchema).mutation(async ({ input }) => {
    const settings = await updateSiteSettings({
      header: {
        siteName: input.siteName,
        menuItems: input.menuItems,
      },
    });

    return settings.header;
  }),

  updateHeroBackground: protectedProcedure
    .input(z.object({ backgroundImage: backgroundImageSchema }))
    .mutation(async ({ input }) => {
      const settings = await updateSiteSettings({
        heroBackgroundImage: input.backgroundImage,
      });

      return { backgroundImage: settings.heroBackgroundImage };
    }),

  updatePages: protectedProcedure
    .input(z.array(pageEntrySchema))
    .mutation(async ({ input }) => {
      const pages = input.reduce<Record<PageKey, { title: string; subtitle: string }>>(
        (acc, page) => {
          acc[page.key] = {
            title: page.title,
            subtitle: page.subtitle ?? "",
          };
          return acc;
        },
        {} as Record<PageKey, { title: string; subtitle: string }>,
      );

      const settings = await updateSiteSettings({
        pages,
      });

      return settings.pages;
    }),

  updateFooter: protectedProcedure.input(footerSchema).mutation(async ({ input }) => {
    const settings = await updateSiteSettings({
      footer: {
        text: input.text,
        links: input.links,
      },
    });

    return settings.footer;
  }),

  updateHomeSections: protectedProcedure
    .input(homeSectionsSchema)
    .mutation(async ({ input }) => {
      const settings = await updateSiteSettings({
        homeSections: input,
      });

      return settings.homeSections;
    }),

  updateAboutHomeSection: protectedProcedure
    .input(aboutHomeSectionSchema)
    .mutation(async ({ input }) => {
      const settings = await updateSiteSettings({
        aboutHomeSection: input,
      });

      return settings.aboutHomeSection;
    }),

  updateAboutPage: protectedProcedure
    .input(aboutPageSchema)
    .mutation(async ({ input }) => {
      const settings = await updateSiteSettings({
        aboutPage: input,
      });

      return settings.aboutPage;
    }),
});


