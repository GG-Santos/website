import { unstable_noStore } from "next/cache";
import { AboutSectionServer } from "@/components/public/about-section-server";
import { BlogPreview } from "@/components/public/blog-preview";
import { CollectionPreviewWrapper } from "@/components/public/collection-preview-wrapper";
import { FeaturesSectionServer } from "@/components/public/features-section-server";
import { HeroSection } from "@/components/public/hero-section";
import { InvestorSectionServer } from "@/components/public/investor-section-server";
import { getPageContent, getSiteSettings } from "@/lib/site-settings-server";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  unstable_noStore();
  const settings = await getSiteSettings();
  const { heroBackgroundImage, homeSections } = settings;
  const homePage = getPageContent(settings, "home");

  return (
    <>
      <HeroSection
        backgroundImage={heroBackgroundImage}
        subtitle={homePage.subtitle}
        title={homePage.title}
      />
      {homeSections.about ? <AboutSectionServer /> : null}
      {homeSections.features ? <FeaturesSectionServer /> : null}
      {homeSections.collection ? <CollectionPreviewWrapper /> : null}
      {homeSections.investors ? <InvestorSectionServer /> : null}
      {homeSections.blog ? <BlogPreview /> : null}
    </>
  );
}
