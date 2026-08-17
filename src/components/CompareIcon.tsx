interface CompareIconProps {
  size?: number;
  className?: string;
}

export default function CompareIcon({ size = 18, className = "" }: CompareIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Top dot */}
      <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
      {/* Diagonal slash */}
      <line x1="7" y1="19" x2="17" y2="5" />
      {/* Bottom dot */}
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
