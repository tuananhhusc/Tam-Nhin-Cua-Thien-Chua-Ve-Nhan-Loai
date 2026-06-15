"use client";

import { useEffect } from "react";
import TableOfContents, { TOCItem } from "./TableOfContents";

interface MobileTOCDrawerProps {
  items: TOCItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileTOCDrawer({
  items,
  isOpen,
  onClose,
}: MobileTOCDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`toc-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`toc-drawer ${isOpen ? "open" : ""}`}
        aria-label="Mục lục di động"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-muted">
          <h2 className="font-sans text-sm font-bold text-burgundy uppercase tracking-wider">
            Mục Lục
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-charcoal-muted hover:text-burgundy transition-colors"
            aria-label="Đóng mục lục"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="py-4 px-2" onClick={onClose}>
          <TableOfContents items={items} />
        </div>
      </aside>
    </>
  );
}
