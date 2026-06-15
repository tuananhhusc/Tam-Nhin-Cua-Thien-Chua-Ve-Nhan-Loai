"use client";

import { useEffect } from "react";

/**
 * Observes elements with class "fade-in-section" and adds "visible"
 * class when they enter the viewport, creating a staggered reveal effect.
 */
export default function ScrollFadeObserver() {
  useEffect(() => {
    // 1. IntersectionObserver to handle the fade-in logic
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
      }
    );

    // Helper to observe existing and new elements
    const observeElements = () => {
      document.querySelectorAll(".fade-in-section:not(.visible)").forEach((el) => {
        intersectionObserver.observe(el);
      });
    };

    // Initial observation
    observeElements();

    // 2. MutationObserver to handle dynamic content (e.g., MarkdownRenderer remounts)
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldObserve = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldObserve = true;
          break;
        }
      }
      if (shouldObserve) {
        // Debounce slightly to allow batch DOM updates
        setTimeout(observeElements, 50);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
