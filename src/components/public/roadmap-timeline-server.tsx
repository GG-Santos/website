import { RoadmapTimeline } from "./roadmap-timeline";
import { serverClient } from "@/lib/trpc/server";

export async function RoadmapTimelineServer() {
  try {
    const { items } = await serverClient.roadmap.getPublished.query({
      limit: 7,
      offset: 0,
    });

    return <RoadmapTimeline items={items || []} />;
  } catch (error) {
    console.error("Error fetching roadmap items:", error);
    return <RoadmapTimeline items={[]} />;
  }
}
