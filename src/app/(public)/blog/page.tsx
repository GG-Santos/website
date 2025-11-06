import { PageBannerServer } from "@/components/public/page-banner-server";
import { BlogList } from "./blog-list";
import { serverClient } from "@/lib/trpc/server";

export const metadata = {
  title: "Blog - Juanito Bayani",
  description: "Read our latest articles and updates",
};

export default async function BlogPage() {
  const { posts } = await serverClient.blog.getPublished.query({
    limit: 50,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <PageBannerServer
        page="blog"
        fallbackTitle="Blog"
        fallbackSubtitle="Stories and updates from the team"
      />
      
      <div className="neoh_fn_blog_page">
        <div className="container">
          {/* Moving Blog List Shortcode */}
          <BlogList posts={posts} />
          {/* !Moving Blog List Shortcode */}
        </div>
      </div>
    </div>
  );
}
