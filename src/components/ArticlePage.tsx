"use client";

import { useState, useEffect } from "react";
import ReadingProgressBar from "./ReadingProgressBar";
import SiteHeader from "./SiteHeader";
import TableOfContents, { TOCItem } from "./TableOfContents";
import MobileTOCDrawer from "./MobileTOCDrawer";
import MarkdownRenderer from "./MarkdownRenderer";
import References from "./References";
import ScrollFadeObserver from "./ScrollFadeObserver";

interface ArticlePageProps {
  articleContent: string;
  references: string[];
  tocItems: TOCItem[];
  wordCount?: number;
  readingTime?: number;
}

export default function ArticlePage({
  articleContent,
  references,
  tocItems,
  wordCount,
  readingTime,
}: ArticlePageProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize fade-in after component mounts
  useEffect(() => {

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ReadingProgressBar />
      <SiteHeader onToggleTOC={() => setIsTocOpen(true)} />

      {/* Mobile TOC Drawer */}
      <MobileTOCDrawer
        items={tocItems}
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Hero / Intro Section */}
        <section className="intro-section py-12 sm:py-16 lg:py-20 text-center px-4">
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Decorative Cross */}
            <div className="flex justify-center mb-6 text-gold opacity-50">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="10.5" y="1" width="3" height="22" rx="1.5" />
                <rect x="3" y="6.5" width="18" height="3" rx="1.5" />
              </svg>
            </div>

            <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-burgundy/70 mb-3 font-medium">
              Khảo sát nghiên cứu chuyên sâu
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy leading-tight mb-6">
              Tầm Nhìn Của Thiên Chúa
              <br />
              <span className="text-gold-light">Về Nhân Loại</span>
            </h1>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />

            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-charcoal-muted mb-8 font-sans">
              {readingTime && (
                <span className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  ⏱️ {readingTime} phút đọc
                </span>
              )}
              {wordCount && (
                <span className="flex items-center gap-1.5 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  📝 ~{wordCount.toLocaleString()} từ
                </span>
              )}
            </div>

            <p className="font-serif text-charcoal-light text-base sm:text-lg leading-relaxed max-w-2xl mx-auto italic">
              &ldquo;Thiên Chúa, từ bản thể vô cùng hoàn hảo và hạnh phúc,
              vì lòng nhân hậu vô biên, đã tự ý tạo dựng con người để cho họ
              được thông phần sự sống hạnh phúc của chính Ngài.&rdquo;
            </p>

            <p className="font-sans text-xs text-charcoal-muted mt-3 tracking-wide">
              — Sách Giáo Lý Hội Thánh Công Giáo, số 1
            </p>
          </div>
        </section>

        {/* Article + TOC Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="lg:flex lg:gap-12">
            {/* Sidebar TOC (Desktop) */}
            <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
              <div className="toc-sidebar">
                <TableOfContents items={tocItems} />
              </div>
            </aside>

            {/* Main Article Content */}
            <main className="flex-1 min-w-0 max-w-[72ch] mx-auto lg:mx-0">
              <article>
                <MarkdownRenderer
                  content={articleContent}
                  references={references}
                />
                <References references={references} />
              </article>

              {/* Footer */}
              <footer className="mt-16 pt-8 border-t border-gold-muted text-center">
                <div className="flex justify-center mb-4 text-gold opacity-40">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="10.5" y="1" width="3" height="22" rx="1.5" />
                    <rect x="3" y="6.5" width="18" height="3" rx="1.5" />
                  </svg>
                </div>
                <p className="font-sans text-sm text-charcoal-muted">
                  Ad Maiorem Dei Gloriam
                </p>
                <p className="font-sans text-xs text-charcoal-muted/60 mt-1">
                  ✦ Để Thiên Chúa Được Vinh Danh Hơn ✦
                </p>
              </footer>
            </main>
          </div>
        </div>
      </div>

      {/* Back to top FAB */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-burgundy text-white shadow-lg shadow-burgundy/30 transition-all duration-300 hover:bg-burgundy-light hover:scale-110 focus:outline-none ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu trang"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      <ScrollFadeObserver />
    </>
  );
}
