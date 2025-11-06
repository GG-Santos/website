"use client";

import { Link, usePathname } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import type { TOCItemType } from "fumadocs-core/toc";
import { TOCProvider } from "fumadocs-ui/components/layout/toc";
import { useTreeContext } from "fumadocs-ui/contexts/tree";
import { type ComponentProps, type ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ZigzagTOC } from "./zigzag-toc";

export type DocsPageProps = {
  toc?: TOCItemType[];
  children: ReactNode;
};

export function DocsPage({ toc = [], ...props }: DocsPageProps) {
  return (
    <TOCProvider toc={toc}>
      <main className="flex w-full min-w-0 flex-col">
        <article className="flex w-full max-w-[860px] flex-1 flex-col gap-6 px-4 py-8 md:mx-auto md:px-6">
          {props.children}
          <Footer />
        </article>
      </main>
      {toc.length > 0 && (
        <div className="sticky top-20 h-[calc(100vh-5rem)] w-72 shrink-0 overflow-auto p-4 max-xl:hidden">
          <h3 className="mb-4 inline-flex items-center gap-1.5 text-fd-muted-foreground text-sm">
            <svg
              className="lucide size-4"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Table of contents</title>
              <path d="M15 18H3" />
              <path d="M17 6H3" />
              <path d="M21 12H3" />
            </svg>
            On this page
          </h3>
          <ZigzagTOC
            items={toc.map((item) => ({
              title: String(item.title),
              url: item.url,
              depth: item.depth,
            }))}
          />
        </div>
      )}
    </TOCProvider>
  );
}

export function DocsBody(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("prose", props.className)}>
      {props.children}
    </div>
  );
}

export function DocsDescription(props: ComponentProps<"p">) {
  // don't render if no description provided
  if (props.children === undefined) {
    return null;
  }

  return (
    <p
      {...props}
      className={cn("mb-8 text-fd-muted-foreground text-lg", props.className)}
    >
      {props.children}
    </p>
  );
}

export function DocsTitle(props: ComponentProps<"h1">) {
  return (
    <h1 {...props} className={cn("font-semibold text-3xl", props.className)}>
      {props.children}
    </h1>
  );
}

function scanNavigationItems(items: PageTree.Node[]): PageTree.Item[] {
  const result: PageTree.Item[] = [];

  for (const item of items) {
    if (item.type === "page") {
      result.push(item);
    } else if (item.type === "folder") {
      if (item.index) {
        result.push(item.index);
      }
      result.push(...scanNavigationItems(item.children));
    }
  }

  return result;
}

function Footer() {
  const { root } = useTreeContext();
  const pathname = usePathname();

  const flatten = useMemo(() => scanNavigationItems(root.children), [root]);

  const { previous, next } = useMemo(() => {
    const idx = flatten.findIndex((item) => item.url === pathname);

    if (idx === -1) {
      return {};
    }
    return {
      previous: flatten[idx - 1],
      next: flatten[idx + 1],
    };
  }, [flatten, pathname]);

  return (
    <div className="flex flex-row items-center justify-between gap-2 font-medium">
      {previous ? <Link href={previous.url}>{previous.name}</Link> : null}
      {next ? <Link href={next.url}>{next.name}</Link> : null}
    </div>
  );
}

