"use client";

import { useEffect, useState, useCallback } from "react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first heading that is intersecting
    const visibleEntries = entries.filter((e) => e.isIntersecting);
    if (visibleEntries.length > 0) {
      // Use the one closest to the top
      const topEntry = visibleEntries.reduce((prev, curr) =>
        prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
      );
      setActiveId(topEntry.target.id);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    });

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, handleObserver]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label="Mục lục bài viết">
      <h2 className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-burgundy mb-4 px-3">
        Mục Lục
      </h2>
      <div className="space-y-0.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`toc-link ${item.level === 3 ? "toc-link-h3" : ""} ${
              activeId === item.id ? "active" : ""
            }`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
