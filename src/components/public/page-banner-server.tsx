import { getPageContent, getSiteSettings } from "@/lib/site-settings-server";
import type { PageKey } from "@/lib/site-settings";
import { PageBanner } from "./page-banner";

type PageBannerServerProps = {
  page: PageKey;
  fallbackTitle: string;
  fallbackSubtitle?: string;
};

export async function PageBannerServer({
  page,
  fallbackTitle,
  fallbackSubtitle,
}: PageBannerServerProps) {
  const settings = await getSiteSettings();
  const pageContent = getPageContent(settings, page);

  const title = pageContent?.title || fallbackTitle;
  const subtitle = pageContent?.subtitle || fallbackSubtitle;

  return <PageBanner title={title} subtitle={subtitle} />;
}


