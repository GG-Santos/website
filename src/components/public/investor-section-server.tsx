import { InvestorSection } from "./investor-section";
import { serverClient } from "@/lib/trpc/server";

export async function InvestorSectionServer() {
  try {
    const techstack = await serverClient.techstack.getPublished.query();
    return <InvestorSection investors={techstack || []} />;
  } catch (error) {
    // Silently handle errors during prerendering or when database is unavailable
    // This prevents the page from crashing during static generation
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching techstack:", error);
    }
    return <InvestorSection investors={[]} />;
  }
}

