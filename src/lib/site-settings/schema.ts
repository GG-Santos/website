import { z } from "zod";

function isAcceptableUrl(value: string) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const backgroundImageSchema = z
  .string()
  .transform((value) => {
    if (value === "undefined" || value === "null") {
      return "";
    }
    return value.trim();
  })
  .refine(isAcceptableUrl, {
    message: "Provide an absolute URL or a path starting with /",
  });

export const pageKeySchema = z.enum([
  "home",
  "about",
  "blog",
  "collection",
  "contact",
  "roadmap",
]);

export const menuItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const pageContentSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(""),
});

export const homeSectionsSchema = z.object({
  about: z.boolean(),
  features: z.boolean(),
  collection: z.boolean(),
  investors: z.boolean(),
  blog: z.boolean(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  socialLinks: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

export const aboutHomeSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().default(""),
});

export const aboutPageSchema = z.object({
  image: z.string().default(""),
  team: z.array(teamMemberSchema).max(9),
});

export const siteSettingsCoreSchema = z.object({
  header: z.object({
    siteName: z.string().min(1),
    menuItems: z.array(menuItemSchema).min(1),
  }),
  heroBackgroundImage: z.string().default(""),
  pages: z.record(pageKeySchema, pageContentSchema),
  footer: z.object({
    text: z.string().min(1),
    links: z.array(footerLinkSchema).min(1),
  }),
  homeSections: homeSectionsSchema,
  aboutHomeSection: aboutHomeSectionSchema,
  aboutPage: aboutPageSchema,
});

export type PageKey = z.infer<typeof pageKeySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type FooterLink = z.infer<typeof footerLinkSchema>;
export type PageContent = z.infer<typeof pageContentSchema>;
export type HomeSections = z.infer<typeof homeSectionsSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type AboutHomeSection = z.infer<typeof aboutHomeSectionSchema>;
export type AboutPage = z.infer<typeof aboutPageSchema>;
export type SiteSettingsCore = z.infer<typeof siteSettingsCoreSchema>;


