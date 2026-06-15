interface ReferencesProps {
  references: string[];
}

export default function References({ references }: ReferencesProps) {
  if (references.length === 0) return null;

  // Parse references: each reference line may contain a title and URL
  const parsed = references.map((ref, index) => {
    // Try to extract URL from the reference line
    const urlMatch = ref.match(/(https?:\/\/[^\s]+)/);
    const url = urlMatch ? urlMatch[1] : null;
    const title = url ? ref.replace(url, "").replace(/,\s*$/, "").trim() : ref;

    return { title, url, index: index + 1 };
  });

  return (
    <section id="nguon-trich-dan" className="references-section mt-16 pt-12 border-t-2 border-gold-muted fade-in-section scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold text-burgundy mb-8 pb-3 border-b border-gold-muted/50 inline-block">
        Tài Liệu Tham Khảo & Nguồn Trích Dẫn
      </h2>
      <ul className="space-y-5 list-none pl-0">
        {parsed.map((ref) => (
          <li key={ref.index} className="flex gap-4 text-charcoal-muted leading-relaxed group">
            <span className="font-serif font-bold text-burgundy-light min-w-[28px] mt-0.5 group-hover:text-burgundy transition-colors">
              [{ref.index}]
            </span>
            <div className="flex-1">
              <span className="text-charcoal-light font-medium">{ref.title}</span>
              {ref.url && (
                <div className="mt-1">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-royal-blue hover:text-royal-blue-light transition-colors break-all text-sm opacity-80 hover:opacity-100"
                  >
                    {ref.url}
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
