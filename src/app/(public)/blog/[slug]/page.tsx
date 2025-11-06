import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HtmlContent } from "@/components/blog/html-content";
import { serverClient } from "@/lib/trpc/server";

const TOP_ARTICLES_COUNT = 3;
const ICON_SPANS_COUNT = 15;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  // Mark as dynamic to allow Math.random() usage
  unstable_noStore();
  const { slug } = await props.params;

  try {
    const post = await serverClient.blog.getBySlug.query({ slug });

    return {
      title: `${post.title} - Blog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  // Mark as dynamic to allow Math.random() usage (prevents static generation)
  unstable_noStore();
  const { slug } = await props.params;

  let post;
  let adjacent;

  try {
    [post, adjacent] = await Promise.all([
      serverClient.blog.getBySlug.query({ slug }),
      serverClient.blog.getAdjacent.query({ slug }),
    ]);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Fetch top articles and categories
  const [topArticles, categories] = await Promise.all([
    serverClient.blog.getTopArticles.query({ limit: TOP_ARTICLES_COUNT }),
    serverClient.blog.getCategories.query(),
  ]);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="neoh_fn_blog_single neoh_fn_single">
      {/* Single Background */}
      <div className="single_bg" />
      {/* !Single Background */}

      {/* Single Content */}
      <div className="single_content">
        <div className="container" id="blog-single-content">
          {/* Breadcrumbs */}
          <div className="neoh_fn_breadcrumbs">
            <p>
              <Link href="/">Home</Link>
              <span className="separator">/</span>
              <Link href="/blog">Blog</Link>
              <span className="separator">/</span>
              <span className="current">{post.title}</span>
            </p>
          </div>

          {/* Hero Image */}
          <div className="single_img">
            <Image
              alt={post.title}
              className="rounded-[10px]"
              height={675}
              src={post.image}
              width={1200}
            />
          </div>

          {/* Page With Sidebar */}
          <div className="neoh_fn_wsidebar">
            {/* Left Sidebar */}
            <div className="sidebar_left">
              {/* Mini Items */}
              <div className="neoh_fn_minis">
                <div className="m_item">
                  <a href="#">{formatDate(post.createdAt)}</a>
                </div>
                <div className="m_item">
                  <span>
                    By <a href="#">{post.author.name}</a>
                  </span>
                </div>
              </div>
              {/* !Mini Items */}

              {/* Single Title */}
              <div className="single_title">
                <h2 className="fn_title">{post.title}</h2>
                <div className="categories">
                  {post.categories.map((category, index) => (
                    <span key={category}>
                      <a
                        href={`/blog?category=${encodeURIComponent(category)}`}
                      >
                        {category}
                      </a>
                      {index < post.categories.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
              {/* !Single Title */}

              {/* Single Description */}
              <div className="single_desc">
                <HtmlContent
                  className="prose prose-invert max-w-none"
                  content={post.content}
                />
              </div>
              {/* !Single Description */}

              {/* Author Information Box */}
              <div className="neoh_fn_author_info">
                <div className="info_img">
                  <Image
                    alt={post.author.name}
                    height={150}
                    src={post.author.image || "/img/blog/author.jpg"}
                    width={150}
                  />
                </div>
                <div className="info_desc">
                  <h3 className="fn_title">{post.author.name}</h3>
                  <p className="fn_desc">
                    {post.author.bio || "Blog author and content creator."}
                  </p>
                  <ul className="social">
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
              </div>
              {/* !Author Information Box */}

              {/* Tags */}
              <div className="neoh_fn_tags">
                <h4 className="label">Tags:</h4>
                {post.tags.map((tag, index) => (
                  <span key={tag}>
                    <a href={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</a>
                    {index < post.tags.length - 1 && <span>,</span>}
                  </span>
                ))}
              </div>
              {/* !Tags */}
            </div>
            {/* !Left Sidebar */}

            {/* Right Sidebar */}
            <div className="sidebar_right">
              {/* Widget (Top Articles) */}
              <div className="widget widget-articles">
                <div className="wid-title">
                  <span className="text">Latest Articles</span>
                  <span className="icon" />
                </div>
                <div className="neoh_fn_widget_articles">
                  <ul>
                    {topArticles.map((item, index) => {
                      const rank = index + 1;
                      return (
                        <li key={item.id}>
                          <div className="item">
                            <Link
                              className="full_link"
                              href={`/blog/${item.slug}`}
                            />
                            <h3 className="fn_title">{item.title}</h3>
                            <p className="fn_date">
                              <span className="post_date">
                                {formatDate(item.createdAt)}
                              </span>
                            </p>
                            <span className="count">{rank}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {/* !Widget (Top Articles) */}

              {/* Widget (Custom Categories) */}
              <div className="widget widget-custom-categories">
                <div className="wid-title">
                  <span className="text">Categories</span>
                  <span className="icon" />
                </div>
                <div
                  className="neoh_fn_categories"
                  data-count={4}
                  data-less="Show Less"
                  data-more="Show More"
                >
                  <ul>
                    {categories.map((category) => (
                      <li key={category.name}>
                        <a
                          href={`/blog?category=${encodeURIComponent(category.name)}`}
                        >
                          {category.name}
                        </a>
                        <span className="count">{category.count}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="clearfix" />
                </div>
              </div>
              {/* !Widget (Custom Categories) */}
            </div>
            {/* !Right Sidebar */}
          </div>
          {/* !Page With Sidebar */}
        </div>

        {/* Previous & Next Box */}
        <div className="neoh_fn_pnb">
          <div className="container">
            <div className="pnb_wrapper">
              <div className="prev item">
                {adjacent.prev ? (
                  <>
                    <Link
                      className="full_link"
                      href={`/blog/${adjacent.prev.slug}`}
                    />
                    <div className="item_in">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${adjacent.prev.image})`,
                        }}
                      />
                      <div className="desc">
                        <p className="fn_desc">Prev Post</p>
                        <h3 className="fn_title">{adjacent.prev.title}</h3>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="item_in">
                    <div className="desc">
                      <p className="fn_desc">No Previous Post</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="trigger">
                <Link className="full_link" href="/blog" />
                <div className="icon">
                  {Array.from({ length: ICON_SPANS_COUNT }, (_, i) => (
                    <span key={`icon-span-${i}`} />
                  ))}
                </div>
              </div>
              <div className="next item">
                {adjacent.next ? (
                  <>
                    <Link
                      className="full_link"
                      href={`/blog/${adjacent.next.slug}`}
                    />
                    <div className="item_in">
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url(${adjacent.next.image})`,
                        }}
                      />
                      <div className="desc">
                        <p className="fn_desc">Next Post</p>
                        <h3 className="fn_title">{adjacent.next.title}</h3>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="item_in">
                    <div className="desc">
                      <p className="fn_desc">No Next Post</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* !Previous & Next Box */}
      </div>
      {/* !Single Content */}
    </div>
  );
}
