"use client";

import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className }: HtmlContentProps) {
  const sanitizedContent = useMemo(() => {
    // Sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "code", "pre", "a", "img", "div", "span",
        "mark", "sub", "sup", "del", "ins",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style", "target", "rel"],
      ALLOW_DATA_ATTR: false,
    });
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
