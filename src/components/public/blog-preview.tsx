"use client";

import { Button } from "@shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useRef } from "react";

export function BlogPreview() {
  const { data, isLoading } = trpc.blog.getPublished.useQuery({
    limit: 3,
    offset: 0,
  });

  const posts = data?.posts || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (posts.length === 0) return;

    const blog = document.querySelector("#blog .neoh_fn_moving_blog");
    if (!blog) return;

    // Create moving box if it doesn't exist
    let movingBox = boxRef.current;
    if (!movingBox) {
      const body = document.body;
      const div = document.createElement("div");
      div.classList.add("neoh_fn_moving_box");
      body.appendChild(div);
      movingBox = div;
    }

    const blogItems = document.querySelectorAll("#blog .neoh_fn_moving_blog .item");

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
      const activeItem = document.querySelector("#blog .neoh_fn_moving_blog .item.active");
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
  }, [posts]);

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-20" id="blog">
        <div className="container max-w-6xl">
          {/* Main Title */}
          <div className="neoh_fn_title">
            <h3 className="fn_title">Latest News</h3>
            <div className="line">
              <span />
            </div>
          </div>
          {/* !Main Title */}
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-20" id="blog">
      <div className="container max-w-6xl">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Latest News</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}

        <div ref={boxRef} className="neoh_fn_moving_box" />
        <div className="neoh_fn_moving_blog">
          <ul>
          {posts.map((post) => (
              <li key={post.id}>
                <div className="item">
                  <img
                    src={post.image}
                  alt={post.title}
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
            ))}
          </ul>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            className="border-0 bg-primary px-8 py-6 font-semibold text-base text-white shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
            size="lg"
          >
            <Link className="text-white" href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5 text-white" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}