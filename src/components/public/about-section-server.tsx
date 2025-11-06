import { AboutSection } from "./about-section";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings-server";

const MAX_TESTIMONIALS = 8;

export async function AboutSectionServer() {
  try {
    const [testimonials, settings] = await Promise.all([
      // Use Prisma directly instead of HTTP-based serverClient to avoid prerendering issues
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
        take: MAX_TESTIMONIALS,
      }),
      getSiteSettings(),
    ]);

    // Transform database objects to match AnimatedTestimonials interface
    const transformedTestimonials = testimonials.map((testimonial) => ({
      quote: testimonial.quote,
      name: testimonial.name,
      designation: testimonial.designation,
      src: testimonial.image,
    }));

    return (
      <AboutSection
        testimonials={transformedTestimonials}
        aboutHomeSection={settings.aboutHomeSection}
      />
    );
  } catch (error) {
    // Silently handle errors during prerendering or when database is unavailable
    // This prevents the page from crashing during static generation
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching testimonials or site settings:", error);
    }
    // Return empty testimonials array on error with default about section
    return (
      <AboutSection
        testimonials={[]}
        aboutHomeSection={{
          title: "The Rise of Juanito Bayani",
          description: "Juanito Bayani is more than just a game.",
          image: "/img/about/1.jpg",
        }}
      />
    );
  }
}

