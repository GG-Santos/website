"use client";

import { useActiveAnchors } from "fumadocs-core/toc";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Constants for TOC positioning
const TOC_DEPTH_OFFSETS = {
  SHALLOW: 0,
  MEDIUM: 10,
  DEEP: 10,
} as const;

const DEPTH_THRESHOLDS = {
  SHALLOW_MAX: 2,
  MEDIUM_DEPTH: 3,
} as const;

const TEXT_OFFSETS = {
  SHALLOW: 14,
  MEDIUM: 26,
  DEEP: 36,
} as const;

type ZigzagTOCItemType = {
  title: string;
  url: string;
  depth: number;
};

type ZigzagTOCProps = {
  items: ZigzagTOCItemType[];
  className?: string;
};

export function ZigzagTOC({ items, className }: ZigzagTOCProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);
  const activeAnchors = useActiveAnchors();

  // Helper function to get element bounds
  const getElementBounds = useCallback(
    (container: HTMLElement, item: ZigzagTOCItemType) => {
      const element = container.querySelector(
        `a[href="${item.url}"]`
      ) as HTMLElement;
      if (!element) {
        return null;
      }

      const styles = getComputedStyle(element);
      const offset = getLineOffset(item.depth) + 1;
      const top = element.offsetTop + Number.parseFloat(styles.paddingTop);
      const bottom =
        element.offsetTop +
        element.clientHeight -
        Number.parseFloat(styles.paddingBottom);

      return { offset, top, bottom };
    },
    []
  );

  // Helper function to add path segment
  const addPathSegment = useCallback(
    (
      d: string[],
      bounds: { offset: number; top: number; bottom: number },
      prevBounds?: { offset: number; top: number; bottom: number } | null
    ) => {
      if (!prevBounds) {
        // First segment
        d.push(`M${bounds.offset} ${bounds.top}`);
      } else if (prevBounds.offset !== bounds.offset) {
        // Add diagonal line
        d.push(`L${prevBounds.offset} ${prevBounds.bottom}`);
        d.push(`L${bounds.offset} ${bounds.top}`);
      } else {
        // Continue vertical line
        d.push(`L${bounds.offset} ${bounds.top}`);
      }

      // Add vertical line to bottom
      d.push(`L${bounds.offset} ${bounds.bottom}`);
    },
    []
  );

  // Helper function to generate complete zigzag path (vertical + diagonal)
  const generateZigzagPath = useCallback(
    (container: HTMLElement) => {
      let w = 0;
      let h = 0;
      const d: string[] = [];
      let prevBounds: { offset: number; top: number; bottom: number } | null =
        null;

      for (const item of items) {
        const bounds = getElementBounds(container, item);
        if (!bounds) {
          continue;
        }

        w = Math.max(bounds.offset, w);
        h = Math.max(h, bounds.bottom);

        addPathSegment(d, bounds, prevBounds);
        prevBounds = bounds;
      }

      return { path: d.join(" "), width: w + 1, height: h };
    },
    [items, getElementBounds, addPathSegment]
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    function onResize() {
      if (container.clientHeight === 0) {
        return;
      }

      const zigzagPathData = generateZigzagPath(container);

      setSvg(zigzagPathData);
    }

    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [generateZigzagPath]);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-fd-card p-3 text-fd-muted-foreground text-xs">
        No headings found
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Main zigzag line with SVG mask */}
      {svg && (
        <div
          className="rtl:-scale-x-100 absolute start-0 top-0"
          style={{
            width: svg.width,
            height: svg.height,
            maskImage: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`
            )}")`,
          }}
        >
          {/* Active indicator thumb */}
          <TocThumb
            activeAnchors={activeAnchors}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        </div>
      )}

      {/* TOC items container */}
      <div className="flex flex-col" ref={containerRef}>
        {items.map((item, i) => (
          <TOCItem
            item={item}
            key={item.url}
            lower={items[i + 1]?.depth}
            upper={items[i - 1]?.depth}
          />
        ))}
      </div>
    </div>
  );
}

function getItemOffset(depth: number): number {
  if (depth <= DEPTH_THRESHOLDS.SHALLOW_MAX) {
    return TEXT_OFFSETS.SHALLOW;
  }
  if (depth === DEPTH_THRESHOLDS.MEDIUM_DEPTH) {
    return TEXT_OFFSETS.MEDIUM;
  }
  return TEXT_OFFSETS.DEEP;
}

function getLineOffset(depth: number): number {
  if (depth <= DEPTH_THRESHOLDS.SHALLOW_MAX) {
    return TOC_DEPTH_OFFSETS.SHALLOW;
  }
  if (depth === DEPTH_THRESHOLDS.MEDIUM_DEPTH) {
    return TOC_DEPTH_OFFSETS.MEDIUM;
  }
  return TOC_DEPTH_OFFSETS.DEEP;
}

function TOCItem({
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  item: ZigzagTOCItemType;
  upper?: number;
  lower?: number;
}) {
  const activeAnchors = useActiveAnchors();
  const offset = getLineOffset(item.depth);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);

  // Check if this item is active
  const isActive = activeAnchors.includes(item.url.slice(1));

  return (
    <a
      className={cn(
        "prose overflow-wrap-anywhere relative py-1.5 text-fd-muted-foreground text-sm transition-colors first:pt-0 last:pb-0 hover:text-fd-accent-foreground",
        isActive && "text-fd-primary"
      )}
      data-active={isActive}
      data-depth={item.depth}
      href={item.url}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
    >
      {/* Diagonal connector for depth transitions */}
      {offset !== upperOffset && (
        <svg
          className="-top-1.5 rtl:-scale-x-100 absolute start-0 size-4"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Diagonal connector line</title>
          <line
            className="stroke-fd-foreground/10"
            strokeWidth="1"
            x1={upperOffset}
            x2={offset}
            y1="0"
            y2="12"
          />
        </svg>
      )}

      {/* Vertical line segment */}
      <div
        className={cn(
          "absolute inset-y-0 w-px bg-fd-foreground/10",
          offset !== upperOffset && "top-1.5",
          offset !== lowerOffset && "bottom-1.5"
        )}
        style={{
          insetInlineStart: offset,
        }}
      />

      {item.title}
    </a>
  );
}

function TocThumb({
  containerRef,
  activeAnchors,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeAnchors: string[];
}) {
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(containerRef.current && thumbRef.current)) {
      return;
    }

    const container = containerRef.current;
    const thumb = thumbRef.current;

    function updateThumb() {
      if (activeAnchors.length === 0 || container.clientHeight === 0) {
        thumb.style.setProperty("--fd-top", "0px");
        thumb.style.setProperty("--fd-height", "0px");
        return;
      }

      let upper = Number.MAX_VALUE;
      let lower = 0;

      for (const anchor of activeAnchors) {
        const element = container.querySelector(
          `a[href="#${anchor}"]`
        ) as HTMLElement;
        if (!element) {
          continue;
        }

        const styles = getComputedStyle(element);
        upper = Math.min(
          upper,
          element.offsetTop + Number.parseFloat(styles.paddingTop)
        );
        lower = Math.max(
          lower,
          element.offsetTop +
            element.clientHeight -
            Number.parseFloat(styles.paddingBottom)
        );
      }

      thumb.style.setProperty("--fd-top", `${upper}px`);
      thumb.style.setProperty("--fd-height", `${lower - upper}px`);
    }

    updateThumb();

    const observer = new ResizeObserver(updateThumb);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, activeAnchors]);

  return (
    <div
      className="mt-(--fd-top) h-(--fd-height) bg-fd-primary transition-all"
      ref={thumbRef}
      role="none"
      style={
        {
          "--fd-top": "0px",
          "--fd-height": "0px",
        } as React.CSSProperties
      }
    />
  );
}

