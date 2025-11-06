import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient } from "@/lib/trpc/server";
import { HtmlContent } from "@/components/blog/html-content";
import { PolygonDivider } from "@/components/public/polygon-divider";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

export async function generateStaticParams() {
  try {
    const { items } = await serverClient.roadmap.getPublished.query({
      limit: 100,
      offset: 0,
    });
    
    const params = items.map((item) => ({
      slug: item.slug,
    }));
    
    // When using Cache Components, must return at least one result
    if (params.length === 0) {
      return [{ slug: "placeholder" }];
    }
    
    return params;
  } catch {
    // Return a placeholder to satisfy Cache Components requirement
    return [{ slug: "placeholder" }];
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  try {
    const item = await serverClient.roadmap.getBySlug.query({ slug: params.slug });

    return {
      title: `${item.title} - Roadmap`,
      description: item.excerpt,
    };
  } catch {
    return {
      title: "Roadmap Item Not Found",
    };
  }
}

export default async function RoadmapSinglePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  let item;
  try {
    item = await serverClient.roadmap.getBySlug.query({ slug: params.slug });
  } catch {
    notFound();
  }

  if (!item) {
    notFound();
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="neoh_fn_roadmap neoh_fn_single">
      {/* Single Background */}
      <div className="single_bg" />
      {/* !Single Background */}

      {/* Single Content */}
      <div className="single_content">
        <div className="container" id="roadmap-single-content">
          {/* Share Buttons */}
          <div className="neoh_fn_share">
            <h5 className="label">Share:</h5>
            <ul>
              <li>
                <a href="#">
                  <i className="fn-icon-twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fn-icon-facebook" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fn-icon-instagram" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fn-icon-pinterest" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fn-icon-behance" />
                </a>
              </li>
            </ul>
          </div>

          {/* Breadcrumbs */}
          <div className="neoh_fn_breadcrumbs">
            <p>
              <Link href="/">Home</Link>
              <span className="separator">/</span>
              <Link href="/roadmap">RoadMap</Link>
              <span className="separator">/</span>
              <span className="current">{item.title}</span>
            </p>
          </div>

          {/* Hero Image */}
          <div className="single_img">
            <Image
              alt={item.title}
              className="rounded-[10px]"
              height={675}
              src={item.featuredImage}
              width={1200}
            />
          </div>

          {/* Mini Items */}
          <div className="neoh_fn_minis">
            <div className="m_item">
              <a href="#">{formatDate(item.createdAt)}</a>
            </div>
            <div className="m_item">
              <span>
                By <a href="#">{item.author.name}</a>
              </span>
            </div>
          </div>
          {/* !Mini Items */}

          {/* Single Title */}
          <div className="single_title">
            <h2 className="fn_title">{item.title}</h2>
            <div className="categories">
              {item.categories.map((category, index) => (
                <span key={category}>
                  <a href="#">{category}</a>
                  {index < item.categories.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
          {/* !Single Title */}

          {/* Single Description */}
          <div className="single_desc">
            <HtmlContent content={item.content} className="prose prose-invert max-w-none" />
          </div>
          {/* !Single Description */}

          {/* Mosaic Gallery */}
          {item.gallery.length > 0 && (
            <div className="neoh_fn_mosaic">
              <ul>
                {item.gallery.map((imageUrl, index) => (
                  <li key={`gallery-${index}`}>
                    <div className="item" style={{ backgroundImage: `url(${imageUrl})` }}>
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        width={400}
                        height={400}
                        className="opacity-0"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* !Mosaic Gallery */}
        </div>

        {/* Video Section */}
        {item.youtubeVideoId && (
          <section id="video">
            {/* Dividers */}
            <PolygonDivider position="top" />
            <PolygonDivider position="bottom" />
            {/* !Dividers */}
            {/* Video Shortcode */}
            <div className="neoh_fn_video">
              <div className="bg_overlay">
                <div className="bg_image" data-bg-img={item.featuredImage} style={{ backgroundImage: `url(${item.featuredImage})` }} />
                <div className="bg_color" />
              </div>
              <div className="v_content" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10, padding: "60px 20px" }}>
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc={`https://www.youtube.com/embed/${item.youtubeVideoId}?autoplay=0&controls=1&rel=0`}
                  thumbnailSrc={item.featuredImage}
                  thumbnailAlt={item.title}
                />
              </div>
            </div>
            {/* !Video Shortcode */}
          </section>
        )}
        {/* !Video Section */}

        {/* Single Description (after video) - Removed since content is already displayed above */}
      </div>
      {/* !Single Content */}
    </div>
  );
}
