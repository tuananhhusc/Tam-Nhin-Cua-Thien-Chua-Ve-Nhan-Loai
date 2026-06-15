"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SectionDivider from "./SectionDivider";
import FootnotePopover from "./FootnotePopover";

interface MarkdownRendererProps {
  content: string;
  references: string[];
}

/**
 * Generates a URL-friendly slug from a heading text.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Extracts plain text from React children.
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText(
      (children as React.ReactElement<{ children?: React.ReactNode }>).props
        .children
    );
  }
  return "";
}

export default function MarkdownRenderer({
  content,
  references,
}: MarkdownRendererProps) {
  const components: Components = React.useMemo(() => ({
    h1: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h1 id={id} className="fade-in-section">
          {children}
        </h1>
      );
    },

    h2: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h2 id={id} className="fade-in-section group relative">
          <a
            href={`#${id}`}
            className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gold hover:text-gold-light hidden md:block"
            aria-label="Link to section"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </a>
          {children}
        </h2>
      );
    },

    h3: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h3 id={id} className="fade-in-section group relative">
          <a
            href={`#${id}`}
            className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gold hover:text-gold-light hidden md:block"
            aria-label="Link to section"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </a>
          {children}
        </h3>
      );
    },

    p: ({ children }) => {
      const text = extractText(children);
      if (!text.trim()) return null;
      return <p className="fade-in-section">{children}</p>;
    },

    blockquote: ({ children }) => (
      <blockquote className="fade-in-section">{children}</blockquote>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-8 fade-in-section">
        <table>{children}</table>
      </div>
    ),

    thead: ({ children }) => <thead>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th>{children}</th>,
    td: ({ children }) => <td>{children}</td>,

    ul: ({ children }) => <ul className="fade-in-section">{children}</ul>,
    ol: ({ children }) => <ol className="fade-in-section">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,

    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,

    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),

    hr: () => <SectionDivider />,

    // Customize sup elements for footnotes
    sup: ({ children, className, ...props }) => {
      if (className === "footnote-ref") {
        const idx = (props as any)["data-idx"] || (props as any)["dataIdx"];
        const refText = references[Number(idx) - 1] || "";
        return <FootnotePopover index={Number(idx)} text={refText} />;
      }
      return <sup {...props}>{children}</sup>;
    },
  }), [references]);

  return (
    <div className="article-prose" suppressHydrationWarning>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
