import { AboutSection } from "./about-section";
import { serverClient } from "@/lib/trpc/server";
import { getSiteSettings } from "@/lib/site-settings-server";

export async function AboutSectionServer() {
  try {
    const [testimonials, settings] = await Promise.all([
      serverClient.testimonial.getPublished.query(),
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
    console.error("Error fetching testimonials or site settings:", error);
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

