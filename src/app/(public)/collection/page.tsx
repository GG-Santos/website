import { PageBannerServer } from "@/components/public/page-banner-server";
import { serverClient } from "@/lib/trpc/server";
import { CollectionPageClient } from "./collection-page-client";

export default async function CollectionPage() {
  const { items } = await serverClient.gameAsset.getPublished.query({
    limit: 100,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <PageBannerServer
        page="collection"
        fallbackTitle="Game Assets"
        fallbackSubtitle="Explore the art and assets behind the game"
      />
      <div className="neoh_fn_collectionpage">
        <CollectionPageClient items={items} />
      </div>
    </div>
  );
}
