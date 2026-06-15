/**
 * Processes the raw theological essay markdown into a format suitable for
 * react-markdown rendering. This includes:
 * - Converting the custom table format to proper GFM table syntax
 * - Splitting content from references
 * - Adding proper heading markers if missing
 * - Extracting Table of Contents (TOC) on the server side
 * - Replacing Vietnamese words with attached footnote digits into HTML sup elements
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Generates a URL-friendly slug from a heading text.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Strips footnote markers like superscript numbers from heading text.
 */
export function cleanHeadingText(text: string): string {
  return text.replace(/\d+$/g, "").trim();
}

/**
 * Replaces digits attached directly to Vietnamese words with HTML sup element
 * for footnote interactions (e.g. "Ngài1" -> "Ngài<sup class="footnote-ref" data-idx="1">1</sup>")
 */
export function replaceFootnotes(text: string): string {
  // Matches a unicode letter followed by 1 or 2 digits, ensuring it's not followed by a digit.
  // It checks for word boundary, punctuation, or end of string to prevent matching inside numbers like "2026"
  return text.replace(
    /(\p{L})(\d{1,2})(?=\b|[\p{P}]|$)/gu,
    '$1<sup class="footnote-ref" data-idx="$2">$2</sup>'
  );
}

export function processMarkdownContent(raw: string): {
  articleContent: string;
  references: string[];
  tocItems: TOCItem[];
  wordCount: number;
  readingTime: number;
} {
  const lines = raw.split("\n").map((l) => l.replace(/\r$/, ""));

  // Find where references start (line starting with "Nguồn trích dẫn" or similar)
  const refIndex = lines.findIndex(
    (l) =>
      l.trim().startsWith("Nguồn trích dẫn") ||
      l.trim().startsWith("Tài liệu tham khảo")
  );

  let contentLines: string[];
  let referenceLines: string[];

  if (refIndex !== -1) {
    contentLines = lines.slice(0, refIndex);
    referenceLines = lines.slice(refIndex + 1).filter((l) => l.trim().length > 0);
  } else {
    contentLines = lines;
    referenceLines = [];
  }

  const tocItems: TOCItem[] = [];
  // Process content: add heading markers, convert table, replace footnotes, extract TOC
  const processedContent = processContentLines(contentLines, tocItems);

  // Add references section to TOC if references exist
  if (referenceLines.length > 0) {
    tocItems.push({
      id: "nguon-trich-dan",
      text: "Nguồn Trích Dẫn",
      level: 2,
    });
  }

  const fullText = contentLines.join(" ").replace(/#+|[*_]+|\[|\]|\(|\)/g, "");
  const wordCount = fullText.split(/\s+/).filter((w) => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    articleContent: processedContent,
    references: referenceLines,
    tocItems,
    wordCount,
    readingTime,
  };
}

function processContentLines(lines: string[], tocItems: TOCItem[]): string {
  const result: string[] = [];
  let i = 0;
  let h2Count = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect the title (first line, no heading marker)
    if (i === 0 && line.length > 0 && !line.startsWith("#")) {
      const headingText = cleanHeadingText(line);
      tocItems.push({
        id: slugify(headingText),
        text: headingText,
        level: 1,
      });
      result.push(`# ${line}`);
      i++;
      continue;
    }

    // Detect major section headings: "1. ...", "2. ...", etc.
    const majorHeadingMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (majorHeadingMatch && !line.startsWith("#")) {
      h2Count++;
      if (h2Count > 1) {
        result.push("");
        result.push("___");
      }
      result.push("");
      const headingText = cleanHeadingText(line);
      tocItems.push({
        id: slugify(headingText),
        text: headingText,
        level: 2,
      });
      result.push(`## ${line}`);
      i++;
      continue;
    }

    // Detect sub-section headings: "1.1. ...", "1.2. ...", etc.
    const subHeadingMatch = line.match(/^(\d+\.\d+)\.\s+(.+)$/);
    if (subHeadingMatch && !line.startsWith("#")) {
      result.push("");
      const headingText = cleanHeadingText(line);
      tocItems.push({
        id: slugify(headingText),
        text: headingText,
        level: 3,
      });
      result.push(`### ${line}`);
      i++;
      continue;
    }

    // Detect "Kết Luận" heading
    if (line === "Kết Luận" || line === "Kết luận") {
      h2Count++;
      if (h2Count > 1) {
        result.push("");
        result.push("___");
      }
      result.push("");
      const headingText = cleanHeadingText(line);
      tocItems.push({
        id: slugify(headingText),
        text: headingText,
        level: 2,
      });
      result.push(`## ${line}`);
      i++;
      continue;
    }

    // Detect the theological comparison table
    // The table starts with "Chiều Kích Phân Tích" line
    if (line.startsWith("Chiều Kích Phân Tích")) {
      const tableResult = extractTable(lines, i);
      result.push("");
      result.push(tableResult.markdown);
      result.push("");
      i = tableResult.endIndex;
      continue;
    }

    // Regular paragraph or empty line
    if (lines[i].trim().length > 0) {
      result.push(replaceFootnotes(lines[i]));
    } else {
      result.push(lines[i]);
    }
    i++;
  }

  return result.join("\n");
}

interface TableExtractionResult {
  markdown: string;
  endIndex: number;
}

function extractTable(lines: string[], startIdx: number): TableExtractionResult {
  const headers = [
    replaceFootnotes(lines[startIdx].trim()),
    replaceFootnotes(lines[startIdx + 1].trim()),
    replaceFootnotes(lines[startIdx + 2].trim()),
  ];

  const rows: string[][] = [];
  let i = startIdx + 3;

  // Read row data - each row is defined by header line followed by 2 data lines
  while (i < lines.length) {
    const currentLine = lines[i]?.trim() || "";

    // Empty line marks end of table
    if (currentLine === "") {
      i++;
      break;
    }

    // Check if this is a row header (like "Bản chất Nguồn gốc")
    const nextLine1 = lines[i + 1]?.trim() || "";
    const nextLine2 = lines[i + 2]?.trim() || "";

    if (currentLine && nextLine1 && nextLine2) {
      rows.push([
        replaceFootnotes(currentLine),
        replaceFootnotes(nextLine1),
        replaceFootnotes(nextLine2),
      ]);
      i += 3;
    } else if (currentLine && nextLine1) {
      rows.push([
        replaceFootnotes(currentLine),
        replaceFootnotes(nextLine1),
        "",
      ]);
      i += 2;
    } else {
      i++;
    }
  }

  // Build markdown table
  const tableLines: string[] = [];
  tableLines.push(`| ${headers[0]} | ${headers[1]} | ${headers[2]} |`);
  tableLines.push(`| :--- | :--- | :--- |`);

  for (const row of rows) {
    const cells = row.map((cell) => cell.replace(/\|/g, "\\|"));
    tableLines.push(`| ${cells[0]} | ${cells[1]} | ${cells[2]} |`);
  }

  return {
    markdown: tableLines.join("\n"),
    endIndex: i,
  };
}
