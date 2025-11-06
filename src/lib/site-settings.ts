// Client-safe exports - types and schemas only
// Server-only functions are in ./site-settings-server.ts

import { z } from "zod";
import {
  pageKeySchema,
  siteSettingsCoreSchema,
} from "./site-settings/schema";

const siteSettingsSchema = siteSettingsCoreSchema.extend({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  _id: z.string(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export type {
  PageKey,
  MenuItem,
  FooterLink,
  PageContent,
  HomeSections,
  TeamMember,
  AboutHomeSection,
  AboutPage,
  SiteSettingsCore,
} from "./site-settings/schema";

export {
  pageKeySchema,
  menuItemSchema,
  footerLinkSchema,
  pageContentSchema,
  homeSectionsSchema,
  teamMemberSchema,
  aboutHomeSectionSchema,
  aboutPageSchema,
  siteSettingsCoreSchema,
} from "./site-settings/schema";
