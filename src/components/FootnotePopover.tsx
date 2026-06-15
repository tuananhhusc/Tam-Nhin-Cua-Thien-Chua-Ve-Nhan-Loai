"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface FootnotePopoverProps {
  index: number;
  text: string;
}

export default function FootnotePopover({ index, text }: FootnotePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse reference text to extract title and url
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
  const url = urlMatch ? urlMatch[1] : null;
  const title = url ? text.replace(url, "").replace(/,\s*$/, "").trim() : text;

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Default: position above the trigger
    let top = triggerRect.top + scrollTop - popoverRect.height - 8;
    let left =
      triggerRect.left +
      scrollLeft +
      triggerRect.width / 2 -
      popoverRect.width / 2;

    // If there is not enough space above (too close to top of viewport, including header offset)
    if (triggerRect.top - popoverRect.height - 8 < 70) {
      // Position below the trigger
      top = triggerRect.bottom + scrollTop + 8;
    }

    // Keep popover within screen horizontal boundaries
    const viewportWidth = window.innerWidth;
    const margin = 12;
    if (left < margin) {
      left = margin;
    } else if (left + popoverRect.width > viewportWidth - margin) {
      left = viewportWidth - popoverRect.width - margin;
    }

    setCoords({ top, left });
  };

  // Re-calculate position when open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Also listen to resize or scroll to reposition
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Small delay to let user hover over the popover
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      className={`fixed z-50 w-72 p-4 rounded-lg shadow-xl border border-gold/30 bg-parchment-dark text-charcoal transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="tooltip"
    >
      <div className="flex justify-between items-start mb-1.5">
        <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-burgundy">
          Chú thích [{index}]
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          className="text-charcoal-muted hover:text-burgundy text-xs font-bold leading-none p-0.5 sm:hidden"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
      <p className="font-sans text-[12px] leading-relaxed text-charcoal-light mb-2">
        {title}
      </p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[11px] text-royal-blue hover:text-royal-blue-light hover:underline break-all block"
        >
          {url}
        </a>
      )}
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        className="footnote-ref cursor-pointer select-none hover:text-gold transition-colors inline-block px-0.5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {index}
      </span>
      {mounted && isOpen && createPortal(popoverContent, document.body)}
    </>
  );
}
