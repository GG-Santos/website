import { CollectionPreview } from "./collection-preview";
import { serverClient } from "@/lib/trpc/server";
import { RoadmapTimelineServer } from "./roadmap-timeline-server";
import { Suspense } from "react";

export async function CollectionPreviewServer() {
  const { items } = await serverClient.gameAsset.getFeatured.query();

  return (
    <CollectionPreview
      items={items}
      roadmapComponent={
        <Suspense
          fallback={
            <div className="neoh_fn_title">
              <h3 className="fn_title">Full Development Roadmap</h3>
              <div className="line">
                <span />
              </div>
            </div>
          }
        >
          <RoadmapTimelineServer />
        </Suspense>
      }
    />
  );
}

