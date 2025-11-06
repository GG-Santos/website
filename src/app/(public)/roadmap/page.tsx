import Image from "next/image";
import Link from "next/link";
import { PageBannerServer } from "@/components/public/page-banner-server";
import { serverClient } from "@/lib/trpc/server";

export const metadata = {
  title: "Roadmap - Your Brand",
  description: "View our development roadmap and upcoming features",
};

export default async function RoadmapPage() {
  const { items } = await serverClient.roadmap.getPublished.query({
    limit: 50,
    offset: 0,
  });

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      <PageBannerServer
        page="roadmap"
        fallbackTitle="Roadmap"
        fallbackSubtitle="See what’s ahead for Juanito Bayani"
      />
      
      <div className="neoh_fn_roadmappage">
        <div className="container">
        <div className="neoh_fn_roadmaplist">
          <ul className="roadlist">
            {items.length === 0 ? (
              <li className="road_item">
                <div className="t_item">
                  <div className="t_item_info">
                    <p className="fn_desc">
                      No roadmap items yet. Check back soon!
                    </p>
                  </div>
                </div>
              </li>
            ) : (
              items.map((item) => (
                <li className="road_item" key={item.id}>
                  <div className="t_item">
                    <div className="t_item_img">
                      <div className="neoh_fn_gallery_1_2">
                        <div className="gallery_in">
                          {item.gallery.length >= 3 ? (
                            <>
                              <div className="item row2">
                                <div className="relative h-full w-full min-h-[200px]">
                                  <Image
                                    alt={item.title}
                                    className="object-cover rounded-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    src={item.gallery[0] || "/img/timeline/1/1.jpg"}
                                    unoptimized={item.gallery[0]?.startsWith("http")}
                                  />
                                </div>
                              </div>
                              <div className="item">
                                <div className="relative h-full w-full min-h-[200px]">
                                  <Image
                                    alt={item.title}
                                    className="object-cover rounded-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    src={item.gallery[1] || "/img/timeline/1/2.jpg"}
                                    unoptimized={item.gallery[1]?.startsWith("http")}
                                  />
                                </div>
                              </div>
                              <div className="item">
                                <div className="relative h-full w-full min-h-[200px]">
                                  <Image
                                    alt={item.title}
                                    className="object-cover rounded-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    src={item.gallery[2] || "/img/timeline/1/3.jpg"}
                                    unoptimized={item.gallery[2]?.startsWith("http")}
                                  />
                                </div>
                              </div>
                            </>
                          ) : item.gallery.length > 0 ? (
                            <>
                              <div className="item row2">
                                <div className="relative h-full w-full min-h-[200px]">
                                  <Image
                                    alt={item.title}
                                    className="object-cover rounded-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    src={item.gallery[0] || "/img/timeline/1/1.jpg"}
                                    unoptimized={item.gallery[0]?.startsWith("http")}
                                  />
                                </div>
                              </div>
                              {item.gallery[1] ? (
                                <div className="item">
                                  <div className="relative h-full w-full min-h-[200px]">
                                    <Image
                                      alt={item.title}
                                      className="object-cover rounded-md"
                                      fill
                                      sizes="(max-width: 768px) 100vw, 40vw"
                                      src={item.gallery[1] || "/img/timeline/1/2.jpg"}
                                      unoptimized={item.gallery[1]?.startsWith("http")}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="item">
                                  <div className="relative h-full w-full min-h-[200px]">
                                    <Image
                                      alt={item.title}
                                      className="object-cover rounded-md"
                                      fill
                                      sizes="(max-width: 768px) 100vw, 40vw"
                                      src={item.featuredImage || "/img/timeline/1/2.jpg"}
                                      unoptimized={item.featuredImage?.startsWith("http")}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="item row2">
                              <div className="relative h-full w-full min-h-[200px]">
                                <Image
                                  alt={item.title}
                                  className="object-cover rounded-md"
                                  fill
                                  sizes="(max-width: 768px) 100vw, 60vw"
                                  src={item.featuredImage || "/img/timeline/1/1.jpg"}
                                  unoptimized={item.featuredImage?.startsWith("http")}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="t_item_info">
                      <p className="fn_date">
                        <span>{formatDate(item.createdAt)}</span>
                      </p>
                      <h3 className="fn_title">
                        <Link href={`/roadmap/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="fn_desc">{item.excerpt}</p>
                      <p className="fn_read">
                        <Link
                          className="neoh_fn_button only_text"
                          href={`/roadmap/${item.slug}`}
                        >
                          <span className="text">Read More</span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
}
