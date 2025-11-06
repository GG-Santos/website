import prisma from "@/lib/prisma";
import { revalidatePath, unstable_noStore } from "next/cache";
import { z } from "zod";
import {
  pageKeySchema,
  siteSettingsCoreSchema,
  type PageKey,
  type SiteSettingsCore,
} from "./site-settings/schema";

const siteSettingsId = "site-settings";

const siteSettingsSchema = siteSettingsCoreSchema.extend({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  _id: z.string(),
});

export type SiteSettingsServer = z.infer<typeof siteSettingsSchema>;

const defaultSiteSettings: SiteSettingsCore = {
  header: {
    siteName: "Underdogs Studios",
    menuItems: [
      { label: "Home", href: "/home" },
      { label: "About", href: "/about" },
      { label: "Collection", href: "/collection" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  heroBackgroundImage: "/img/hero/bg.jpg",
  pages: {
    home: {
      title: "Juanito Bayani",
      subtitle: "A Single-Player Roguelite Action RPG Exploring the Gamification of Philippine Mythological Creatures for Quality Education",
    },
    about: {
      title: "About",
      subtitle: "Learn more about Underdogs Studios",
    },
    blog: {
      title: "Blog",
      subtitle: "Stories and updates from the team",
    },
    collection: {
      title: "Game Assets",
      subtitle: "Explore the art and assets behind the game",
    },
    contact: {
      title: "Contact",
      subtitle: "Get in touch with the team",
    },
    roadmap: {
      title: "Roadmap",
      subtitle: "See what's ahead for Juanito Bayani",
    },
  },
  footer: {
    text: "© 2025 Underdogs Studio",
    links: [
      { label: "Roadmap", href: "/roadmap" },
      { label: "Cookies", href: "/cookies" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  homeSections: {
    about: true,
    features: true,
    collection: true,
    investors: true,
    blog: true,
  },
  aboutHomeSection: {
    title: "The Rise of Juanito Bayani",
    description: "Juanito Bayani is more than just a game - it's a labor of love from Underdogs Studios. We're a small team of six passionate developers dedicated to creating an unforgettable gaming experience.\n\nEvery aspect of the game, from the story to the gameplay mechanics, has been carefully crafted with attention to detail and a deep respect for the gaming community.",
    image: "/img/about/1.jpg",
  },
  aboutPage: {
    image: "/img/about/1.jpg",
    team: [
      {
        name: "Tom Mccarthy",
        title: "2D Artist",
        imageUrl: "/img/author/1.jpg",
      },
      {
        name: "Owen Bradley",
        title: "2D Artist",
        imageUrl: "/img/author/2.jpg",
      },
      {
        name: "Daniel Bradley",
        title: "2D Artist",
        imageUrl: "/img/author/3.jpg",
      },
      {
        name: "Skylar Jarvis",
        title: "2D Artist",
        imageUrl: "/img/author/4.jpg",
      },
      {
        name: "Avery Briggs",
        title: "2D Artist",
        imageUrl: "/img/author/5.jpg",
      },
      {
        name: "Bernard Green",
        title: "2D Artist",
        imageUrl: "/img/author/6.jpg",
      },
    ],
  },
};

type SiteSettingsUpdate = Partial<
  Omit<SiteSettingsServer, "_id" | "createdAt" | "updatedAt">
>;

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>,
): T {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;

    const baseValue = result[key];

    if (Array.isArray(value)) {
      result[key] = value;
      continue;
    }

    if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof Date)
    ) {
      const mergedChild = deepMerge(
        (baseValue as Record<string, unknown>) || {},
        value as Record<string, unknown>,
      );
      result[key] = mergedChild;
      continue;
    }

    result[key] = value;
  }

  return result as T;
}

async function migrateSiteSettingsDocument(): Promise<void> {
  try {
    // Use raw MongoDB command to get and migrate the document
    const result = await prisma.$runCommandRaw({
      find: "siteSettings",
      filter: { _id: siteSettingsId },
      limit: 1,
    });

    const documents = (result as { cursor?: { firstBatch?: unknown[] } }).cursor?.firstBatch;
    if (!documents || documents.length === 0) {
      return; // No document to migrate
    }

    const oldDoc = documents[0] as {
      _id: string;
      createdAt?: string | Date;
      updatedAt?: string | Date;
      hero?: { title?: string; subtitle?: string; backgroundImage?: string };
      pages?: Record<string, { title?: string; subtitle?: string }>;
      header?: unknown;
      footer?: unknown;
      homeSections?: unknown;
      heroBackgroundImage?: string;
    };

    // Migrate to new schema
    const migratedDoc = {
      _id: oldDoc._id,
      heroBackgroundImage: oldDoc.heroBackgroundImage ?? oldDoc.hero?.backgroundImage ?? defaultSiteSettings.heroBackgroundImage,
      header: oldDoc.header ?? defaultSiteSettings.header,
      pages: {
        home: {
          title: oldDoc.hero?.title ?? oldDoc.pages?.home?.title ?? defaultSiteSettings.pages.home.title,
          subtitle: oldDoc.hero?.subtitle ?? oldDoc.pages?.home?.subtitle ?? defaultSiteSettings.pages.home.subtitle,
        },
        about: oldDoc.pages?.about ?? defaultSiteSettings.pages.about,
        blog: oldDoc.pages?.blog ?? defaultSiteSettings.pages.blog,
        collection: oldDoc.pages?.collection ?? defaultSiteSettings.pages.collection,
        contact: oldDoc.pages?.contact ?? defaultSiteSettings.pages.contact,
        roadmap: oldDoc.pages?.roadmap ?? defaultSiteSettings.pages.roadmap,
      },
      footer: oldDoc.footer ?? defaultSiteSettings.footer,
      homeSections: oldDoc.homeSections ?? defaultSiteSettings.homeSections,
      aboutHomeSection: (oldDoc as { aboutHomeSection?: unknown | null }).aboutHomeSection ?? defaultSiteSettings.aboutHomeSection,
      aboutPage: (oldDoc as { aboutPage?: unknown | null }).aboutPage ?? defaultSiteSettings.aboutPage,
      createdAt: oldDoc.createdAt ? new Date(oldDoc.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    // Delete old document and create new one with correct schema
    await prisma.$runCommandRaw({
      delete: "siteSettings",
      deletes: [
        {
          q: { _id: siteSettingsId },
          limit: 1,
        },
      ],
    });

    // Create new document with correct schema using Prisma
    await prisma.siteSettings.create({
      data: {
        id: migratedDoc._id,
        heroBackgroundImage: migratedDoc.heroBackgroundImage,
        header: migratedDoc.header as never,
        pages: migratedDoc.pages as never,
        footer: migratedDoc.footer as never,
        homeSections: migratedDoc.homeSections as never,
        aboutHomeSection: (migratedDoc.aboutHomeSection ?? defaultSiteSettings.aboutHomeSection) as never,
        aboutPage: (migratedDoc.aboutPage ?? defaultSiteSettings.aboutPage) as never,
        createdAt: migratedDoc.createdAt,
        updatedAt: migratedDoc.updatedAt,
      },
    });
  } catch (migrateError) {
    console.error("Migration failed, will try to continue:", migrateError);
  }
}

export async function getSiteSettings(): Promise<SiteSettingsServer> {
  // Mark as dynamic to allow new Date() usage
  unstable_noStore();
  
  try {
    const record = await prisma.siteSettings.findUnique({
      where: { id: siteSettingsId },
    });

    if (!record) {
      // Create default settings
      const created = await prisma.siteSettings.create({
        data: {
          id: siteSettingsId,
          heroBackgroundImage: defaultSiteSettings.heroBackgroundImage,
          header: defaultSiteSettings.header as never,
          pages: defaultSiteSettings.pages as never,
          footer: defaultSiteSettings.footer as never,
          homeSections: defaultSiteSettings.homeSections as never,
          aboutHomeSection: defaultSiteSettings.aboutHomeSection as never,
          aboutPage: defaultSiteSettings.aboutPage as never,
        },
      });

      return {
        _id: created.id,
        heroBackgroundImage: created.heroBackgroundImage,
        header: created.header as SiteSettingsServer["header"],
        pages: created.pages as SiteSettingsServer["pages"],
        footer: created.footer as SiteSettingsServer["footer"],
        homeSections: created.homeSections as SiteSettingsServer["homeSections"],
        aboutHomeSection: (created.aboutHomeSection as SiteSettingsServer["aboutHomeSection"]) || defaultSiteSettings.aboutHomeSection,
        aboutPage: (created.aboutPage as SiteSettingsServer["aboutPage"]) || defaultSiteSettings.aboutPage,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
    }

    // Merge with defaults to ensure all fields exist
    const settings: SiteSettingsServer = {
      _id: record.id,
      heroBackgroundImage: record.heroBackgroundImage || defaultSiteSettings.heroBackgroundImage,
      header: deepMerge(
        defaultSiteSettings.header,
        (record.header as SiteSettingsServer["header"]) || {},
      ),
      pages: deepMerge(
        defaultSiteSettings.pages,
        (record.pages as SiteSettingsServer["pages"]) || {},
      ),
      footer: deepMerge(
        defaultSiteSettings.footer,
        (record.footer as SiteSettingsServer["footer"]) || {},
      ),
      homeSections: {
        ...defaultSiteSettings.homeSections,
        ...((record.homeSections as SiteSettingsServer["homeSections"]) || {}),
      },
      aboutHomeSection: record.aboutHomeSection
        ? deepMerge(
            defaultSiteSettings.aboutHomeSection,
            (record.aboutHomeSection as SiteSettingsServer["aboutHomeSection"]),
          )
        : defaultSiteSettings.aboutHomeSection,
      aboutPage: record.aboutPage
        ? {
            image: (record.aboutPage as SiteSettingsServer["aboutPage"]).image || defaultSiteSettings.aboutPage.image,
            team: ((record.aboutPage as SiteSettingsServer["aboutPage"]).team || defaultSiteSettings.aboutPage.team).slice(0, 9),
          }
        : defaultSiteSettings.aboutPage,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    return settings;
  } catch (error) {
    // If error is due to date type mismatch or null values, try to migrate
    if (
      error instanceof Error &&
      (error.message.includes("Failed to convert") ||
        error.message.includes("aboutHomeSection") ||
        error.message.includes("aboutPage") ||
        error.message.includes("incompatible value"))
    ) {
      console.log("Detected schema mismatch, migrating document...", error.message);
      await migrateSiteSettingsDocument();
      // Retry after migration
      try {
        const record = await prisma.siteSettings.findUnique({
          where: { id: siteSettingsId },
        });
        if (record) {
          const settings: SiteSettingsServer = {
            _id: record.id,
            heroBackgroundImage: record.heroBackgroundImage || defaultSiteSettings.heroBackgroundImage,
            header: deepMerge(
              defaultSiteSettings.header,
              (record.header as SiteSettingsServer["header"]) || {},
            ),
            pages: deepMerge(
              defaultSiteSettings.pages,
              (record.pages as SiteSettingsServer["pages"]) || {},
            ),
            footer: deepMerge(
              defaultSiteSettings.footer,
              (record.footer as SiteSettingsServer["footer"]) || {},
            ),
            homeSections: {
              ...defaultSiteSettings.homeSections,
              ...((record.homeSections as SiteSettingsServer["homeSections"]) || {}),
            },
            aboutHomeSection: record.aboutHomeSection
              ? deepMerge(
                  defaultSiteSettings.aboutHomeSection,
                  (record.aboutHomeSection as SiteSettingsServer["aboutHomeSection"]),
                )
              : defaultSiteSettings.aboutHomeSection,
            aboutPage: record.aboutPage
              ? {
                  image: (record.aboutPage as SiteSettingsServer["aboutPage"]).image || defaultSiteSettings.aboutPage.image,
                  team: ((record.aboutPage as SiteSettingsServer["aboutPage"]).team || defaultSiteSettings.aboutPage.team).slice(0, 9),
                }
              : defaultSiteSettings.aboutPage,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          };
          return settings;
        }
      } catch (retryError) {
        console.error("Retry after migration failed:", retryError);
      }
    }

    // Return defaults if database fails
    return {
      _id: siteSettingsId,
      ...defaultSiteSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function updateSiteSettings(
  update: SiteSettingsUpdate,
): Promise<SiteSettingsServer> {
  if (!Object.keys(update).length) {
    return getSiteSettings();
  }

  try {
    let existing;
    try {
      existing = await prisma.siteSettings.findUnique({
        where: { id: siteSettingsId },
      });
    } catch (findError) {
      // If error is due to date type mismatch, migrate first
      if (findError instanceof Error && findError.message.includes("Failed to convert")) {
        console.log("Detected date type mismatch in update, migrating document...");
        await migrateSiteSettingsDocument();
        // Retry after migration
        existing = await prisma.siteSettings.findUnique({
          where: { id: siteSettingsId },
        });
      } else {
        throw findError;
      }
    }

    if (!existing) {
      // Create with updates
      const created = await prisma.siteSettings.create({
        data: {
          id: siteSettingsId,
          heroBackgroundImage: update.heroBackgroundImage ?? defaultSiteSettings.heroBackgroundImage,
          header: (update.header ?? defaultSiteSettings.header) as never,
          pages: (update.pages ?? defaultSiteSettings.pages) as never,
          footer: (update.footer ?? defaultSiteSettings.footer) as never,
          homeSections: (update.homeSections ?? defaultSiteSettings.homeSections) as never,
          aboutHomeSection: update.aboutHomeSection ? (update.aboutHomeSection as never) : undefined,
          aboutPage: update.aboutPage ? (update.aboutPage as never) : undefined,
        },
      });

      return getSiteSettings();
    }

    // Update existing record
    const updateData: {
      heroBackgroundImage?: string;
      header?: never;
      pages?: never;
      footer?: never;
      homeSections?: never;
      aboutHomeSection?: never;
      aboutPage?: never;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (update.heroBackgroundImage !== undefined) {
      updateData.heroBackgroundImage = update.heroBackgroundImage;
    }

    if (update.header) {
      updateData.header = update.header as never;
    }

    if (update.pages) {
      updateData.pages = update.pages as never;
    }

    if (update.footer) {
      updateData.footer = update.footer as never;
    }

    if (update.homeSections) {
      updateData.homeSections = update.homeSections as never;
    }

    if (update.aboutHomeSection) {
      updateData.aboutHomeSection = update.aboutHomeSection as never;
    }

    if (update.aboutPage) {
      updateData.aboutPage = update.aboutPage as never;
    }

    await prisma.siteSettings.update({
      where: { id: siteSettingsId },
      data: updateData,
    });

    // Revalidate all public pages to show updated content
    revalidatePath("/", "layout");
    revalidatePath("/home");
    revalidatePath("/about");
    revalidatePath("/blog");
    revalidatePath("/collection");
    revalidatePath("/contact");
    revalidatePath("/roadmap");

    return getSiteSettings();
  } catch (error) {
    throw new Error(`Failed to update site settings: ${error}`);
  }
}

export function getPageContent(settings: SiteSettingsServer, page: PageKey) {
  return settings.pages[page] ?? defaultSiteSettings.pages[page];
}


