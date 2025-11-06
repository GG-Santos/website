import { InvestorSection } from "./investor-section";
import { serverClient } from "@/lib/trpc/server";

export async function InvestorSectionServer() {
  try {
    const investors = await serverClient.investor.getPublished.query();
    return <InvestorSection investors={investors || []} />;
  } catch (error) {
    // Silently handle errors during prerendering or when database is unavailable
    // This prevents the page from crashing during static generation
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching investors:", error);
    }
    return <InvestorSection investors={[]} />;
  }
}

