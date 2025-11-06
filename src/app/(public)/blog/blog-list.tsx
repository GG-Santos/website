"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  createdAt: Date | string;
}

interface BlogListProps {
  posts: BlogPost[];
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Pagination functions matching the reference
const pagination = (listClass: string, sort: number, active: number) => {
  if (typeof document === "undefined") return;
  const list = document.querySelectorAll(listClass);
  for (let i = 0; i < list.length; i++) {
    const element = list[i] as HTMLElement;
    if (active === 1) {
      if (i < sort) {
        element.classList.remove("d-none");
      } else {
        element.classList.add("d-none");
      }
    } else {
      if (i >= (active - 1) * sort && i < active * sort) {
        element.classList.remove("d-none");
      } else {
        element.classList.add("d-none");
      }
    }
  }
};

const getPagination = (totalNumber: number, sort: number) => {
  return new Array(Math.ceil(totalNumber / sort))
    .fill(0)
    .map((_, idx) => idx + 1);
};

export function BlogList({ posts }: BlogListProps) {
  const sort = 3; // Items per page
  const [active, setActive] = useState(1);
  
  // Calculate pagination pages based on posts length (not DOM)
  const totalPages = Math.ceil(posts.length / sort);
  const state = getPagination(posts.length, sort);
  
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    
    const blog = document.querySelector(".neoh_fn_moving_blog");
    if (!blog) return;

    // Create moving box if it doesn't exist
    let movingBox = boxRef.current;
    if (!movingBox) {
      const body = document.body;
      const div = document.createElement("div");
      div.classList.add("neoh_fn_moving_box");
      body.appendChild(div);
      movingBox = div as HTMLDivElement;
    }

    const blogItems = document.querySelectorAll(".neoh_fn_moving_blog ul li");
    
    // Run pagination immediately
    pagination(".neoh_fn_moving_blog ul li", sort, active);

    // Mouse hover effects for moving blog
    const handleMouseEnter = (event: Event) => {
      const list = event.currentTarget as HTMLElement;
      if (!list.classList.contains("active")) {
        list.classList.add("active");
        movingBox?.classList.add("active");
        const imgElement = list.querySelector(".moving_img") as HTMLImageElement;
        if (imgElement && movingBox) {
          const imgURL = imgElement.getAttribute("src");
          if (imgURL) {
            movingBox.style.backgroundImage = `url(${imgURL})`;
          }
        }
      }
    };

    const handleMouseLeave = () => {
      const activeItem = document.querySelector(".neoh_fn_moving_blog .item.active");
      if (activeItem) {
        activeItem.classList.remove("active");
      }
      movingBox?.classList.remove("active");
    };

    const handleMouseMove = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (movingBox) {
        movingBox.style.left = mouseEvent.clientX + 15 + "px";
        movingBox.style.top = mouseEvent.clientY + 15 + "px";
      }
    };

    blogItems.forEach((item) => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
      item.addEventListener("mousemove", handleMouseMove);
    });

    return () => {
      blogItems.forEach((item) => {
        item.removeEventListener("mouseenter", handleMouseEnter);
        item.removeEventListener("mouseleave", handleMouseLeave);
        item.removeEventListener("mousemove", handleMouseMove);
      });
    };
  }, [posts, active]);

  return (
    <>
      <div ref={boxRef} className="neoh_fn_moving_box" />
      <div className="neoh_fn_moving_blog">
        <ul>
          {posts.length === 0 ? (
            <li className="w-full">
              <div className="item">
                <p className="fn_desc">No blog posts yet. Check back soon for new content!</p>
              </div>
            </li>
          ) : (
            posts.map((post) => (
              <li key={post.id}>
                <div className="item">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={600}
                    className="moving_img"
                  />
                  <p className="fn_date">
                    <span>{formatDate(post.createdAt)}</span>
                  </p>
                  <h3 className="fn_title">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="fn_desc">{post.excerpt}</p>
                  <p className="fn_read">
                    <Link href={`/blog/${post.slug}`} className="neoh_fn_button only_text">
                      <span className="text">Read More</span>
                    </Link>
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="neoh_fn_pagination">
          <ul>
            {state.map((s) => (
              <li key={s}>
                <a
                  href="#"
                  className={active === s ? "current" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s);
                  }}
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* !Pagination */}
    </>
  );
}
