import fs from "fs";
import path from "path";
import ArticlePage from "@/components/ArticlePage";
import { processMarkdownContent } from "@/lib/processContent";

export default function Home() {
  // Read the markdown file at build/request time (Server Component)
  const mdPath = path.join(process.cwd(), "content", "tnctcvnl.md");
  let rawContent = "";

  try {
    rawContent = fs.readFileSync(mdPath, "utf-8");
  } catch {
    // Fallback: try the parent directory
    try {
      const fallbackPath = path.join(process.cwd(), "..", "tnctcvnl.md");
      rawContent = fs.readFileSync(fallbackPath, "utf-8");
    } catch {
      rawContent = "# Lỗi\n\nKhông tìm thấy file nội dung. Vui lòng đặt file `tnctcvnl.md` vào thư mục `content/` trong project.";
    }
  }

  const { articleContent, references, tocItems, wordCount, readingTime } = processMarkdownContent(rawContent);

  return (
    <ArticlePage
      articleContent={articleContent}
      references={references}
      tocItems={tocItems}
      wordCount={wordCount}
      readingTime={readingTime}
    />
  );
}
