"use client";

import { useState } from "react";
import Link from "next/link";

interface RoadmapItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  gallery: string[];
  createdAt: Date | string;
  displayDate?: Date | string | null;
}

interface RoadmapTimelineProps {
  items: RoadmapItem[];
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function RoadmapTimeline({ items }: RoadmapTimelineProps) {
  const [active, setActive] = useState(items.length > 0 ? Math.min(2, items.length) : 1);
  const [activeTimeline, setActiveTimeline] = useState(items.length > 0 ? Math.min(2, items.length) : 1);
  
  const onClick = (value: number) => {
    setActive(value);
    setActiveTimeline(value);
  };

  const activeClass = (index: number) => {
    const idx = index + 1;
    if (idx === active) return "active";
    if (idx > active) return "next";
    return "previous";
  };

  const filter = (value: number) => {
    if (active === 0 || active === 1) return 100;
    return (100 / active) * value;
  };

  if (items.length === 0) {
    return (
      <>
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Full Development Roadmap</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
        <div style={{ padding: "40px 0", textAlign: "center", color: "#aaa" }}>
          <p>No roadmap items available yet.</p>
        </div>
      </>
    );
  }

  // Show only the first 7 items for timeline
  const displayItems = items.slice(0, 7);

  return (
    <>
      {/* Main Title */}
      <div className="neoh_fn_title">
        <h3 className="fn_title">Full Development Roadmap</h3>
        <div className="line">
          <span />
        </div>
      </div>
      {/* !Main Title */}
      
      {/* Timeline */}
      <div className="neoh_fn_timeline">
          {/* Timeline Content */}
          <div className="timeline_content">
            <ul className="timeline_list">
              {displayItems.map((item, index) => (
                <li
                  key={item.id}
                  className={`timeline_item ${activeClass(index)}`}
                  data-index={index + 1}
                >
                  <div className="t_item">
                    <div className="t_item_img">
                      <div className="neoh_fn_gallery_1_2">
                        <div className="gallery_in">
                          {item.gallery.length >= 3 ? (
                            <>
                              <div className="item row2" style={{ height: "100%" }}>
                                <img src={item.gallery[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div className="item" style={{ height: "100%" }}>
                                <img src={item.gallery[1]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div className="item" style={{ height: "100%" }}>
                                <img src={item.gallery[2]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            </>
                          ) : item.gallery.length > 0 ? (
                            <>
                              <div className="item row2" style={{ height: "100%" }}>
                                <img src={item.gallery[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              {item.gallery[1] ? (
                                <div className="item" style={{ height: "100%" }}>
                                  <img src={item.gallery[1]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ) : (
                                <div className="item" style={{ height: "100%" }}>
                                  <img src={item.featuredImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="item row2" style={{ height: "100%" }}>
                              <img src={item.featuredImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="t_item_info">
                      <p className="fn_date">
                        <span>{formatDate(item.displayDate || item.createdAt)}</span>
                      </p>
                      <h3 className="fn_title">
                        <Link href={`/roadmap/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="fn_desc">{item.excerpt || ""}</p>
                      <p className="fn_read">
                        <Link href={`/roadmap/${item.slug}`} className="neoh_fn_button only_text">
                          <span className="text">Read More</span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* !Timeline Content */}
          
          {/* Timeline Progress */}
          <div className="timeline_progress">
            {/* Nav */}
            <a
              className={activeTimeline === 1 ? "nav_prev c-pointer inactive" : "nav_prev c-pointer"}
              onClick={() => {
                if (activeTimeline > 1) {
                  const newValue = activeTimeline - 1;
                  setActiveTimeline(newValue);
                  setActive(newValue);
                }
              }}
            >
              <img src="/svg/right-arr.svg" alt="" className="fn__svg" />
            </a>
            <a
              className={activeTimeline === displayItems.length ? "nav_next c-pointer inactive" : "nav_next c-pointer"}
              onClick={() => {
                if (activeTimeline < displayItems.length) {
                  const newValue = activeTimeline + 1;
                  setActiveTimeline(newValue);
                  setActive(newValue);
                }
              }}
            >
              <img src="/svg/right-arr.svg" alt="" className="fn__svg" />
            </a>
            {/* !Nav */}
            <div className="progress_line_wrapper">
              <div
                className="progress_line"
                style={{
                  width: "1615px", // Extended to reach last dot (1500px + 115px padding)
                  transform: activeTimeline >= 5 
                    ? `translateX(-${((1040 - 580) / 1615) * 100}%)` // Center dot 5 (1040px) at position 3 (580px) when reaching dot 5+
                    : "translateX(0%)", // No scrolling adjustment for dots 1-4
                }}
              >
                <ul>
                  {displayItems.map((item, index) => {
                    const idx = index + 1;
                    return (
                      <li key={item.id} className={activeClass(index)}>
                        <a onClick={() => onClick(idx)}>
                          <span className="text">{formatDate(item.displayDate || item.createdAt)}</span>
                          <span className="circle" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <span className="active_line" />
              </div>
            </div>
          </div>
          {/* !Timeline Progress */}
        </div>
        {/* !Timeline */}
    </>
  );
}
