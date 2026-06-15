import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tuananhhusc.github.io/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai"),
  title: "Tầm Nhìn Của Thiên Chúa Về Nhân Loại – Khảo sát nghiên cứu chuyên sâu",
  description:
    "Khảo sát nghiên cứu chuyên sâu về nhân học thần học Công giáo toàn diện, trải dài từ nền tảng Imago Dei, qua mầu nhiệm sa ngã và cứu chuộc, đến vinh quang cánh chung của Trời Mới Đất Mới.",
  keywords: [
    "Nhân học thần học",
    "Công giáo",
    "Imago Dei",
    "Gaudium et Spes",
    "Thần học về Thân xác",
    "Cánh chung học",
    "Học thuyết xã hội Công giáo",
  ],
  authors: [{ name: "Khảo sát nghiên cứu chuyên sâu" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Tầm Nhìn Của Thiên Chúa Về Nhân Loại",
    description: "Khảo sát nghiên cứu chuyên sâu về nhân học thần học Công giáo toàn diện",
    type: "article",
    locale: "vi_VN",
    url: "https://tuananhhusc.github.io/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai",
    siteName: "Khảo sát nghiên cứu chuyên sâu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tầm Nhìn Của Thiên Chúa Về Nhân Loại - Khảo sát nghiên cứu chuyên sâu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tầm Nhìn Của Thiên Chúa Về Nhân Loại",
    description: "Khảo sát nghiên cứu chuyên sâu về nhân học thần học Công giáo toàn diện",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured ScholarlyArticle Schema for Catholic Academic SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": "Tầm Nhìn Của Thiên Chúa Về Nhân Loại",
    "alternativeHeadline": "Khảo sát nghiên cứu chuyên sâu về Nhân Học Thần Học Công Giáo",
    "genre": "Theology",
    "inLanguage": "vi-VN",
    "about": [
      "Catholic Theology",
      "Theological Anthropology",
      "Imago Dei",
      "Eschatology",
      "Catholic Social Teaching"
    ],
    "author": {
      "@type": "Organization",
      "name": "Khảo sát nghiên cứu chuyên sâu"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hội Thánh Công Giáo Việt Nam",
      "logo": {
        "@type": "ImageObject",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/47/Emblem_of_the_Holy_See_second.svg"
      }
    },
    "description": "Khảo sát nghiên cứu chuyên sâu về nhân học thần học Công giáo toàn diện, trải dài từ nền tảng Imago Dei, qua mầu nhiệm sa ngã và cứu chuộc, đến vinh quang cánh chung của Trời Mới Đất Mới."
  };

  return (
    <html
      lang="vi"
      className={`${merriweather.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai/manifest.json" />
        <meta name="theme-color" content="#722F37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-parchment text-charcoal">
        {children}

        {/* Register Service Worker for Offline reading PWA */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/Tam-Nhin-Cua-Thien-Chua-Ve-Nhan-Loai/sw.js').then(function(reg) {
                    console.log('SW registered successfully:', reg.scope);
                  }).catch(function(err) {
                    console.error('SW registration failed:', err);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
