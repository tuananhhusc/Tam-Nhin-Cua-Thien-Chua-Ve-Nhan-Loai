export default function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized Latin Cross */}
        <rect x="10.5" y="2" width="3" height="20" rx="1" fill="currentColor" />
        <rect x="4" y="7" width="16" height="3" rx="1" fill="currentColor" />
        {/* Small decorative diamonds */}
        <rect
          x="12"
          y="0.5"
          width="2"
          height="2"
          rx="0.3"
          transform="rotate(45 12 0.5)"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
