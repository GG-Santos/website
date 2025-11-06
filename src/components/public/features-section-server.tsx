import { FeaturesSection } from "./features-section";
import { serverClient } from "@/lib/trpc/server";

export async function FeaturesSectionServer() {
  try {
    const objectives = await serverClient.gameObjective.getPublished.query();

    // Transform database objects to match InfiniteCarousel interface
    const cards = objectives.map((obj) => ({
      category: obj.category,
      title: obj.title,
      src: obj.image,
      content: null as React.ReactNode,
    }));

    return <FeaturesSection cards={cards} />;
  } catch (error) {
    console.error("Error fetching game objectives:", error);
    // Return empty cards array on error
    return <FeaturesSection cards={[]} />;
  }
}

