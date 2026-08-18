interface TernLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function TernLogo({
  className = "",
  size = 32,
  color = "currentColor",
}: TernLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GrowTern logo"
    >
      {/* Tern / Sternidae bird in flight - clean outline silhouette */}
      {/* Body and head */}
      <path
        d="M12 34c4-1 9-1.5 14-0.5 5 1 9 3.5 12 5.5 2.5 1.5 5.5 2 8.5 1.2 3.5-1 6-3 8-5.5 1.8-2.2 3-5 2.8-7.8-.2-2.5-1.5-4.5-3.5-5.8-2.2-1.3-5-1.5-7.5-.2-2 1-3.5 2.8-4.2 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swept wing - left */}
      <path
        d="M12 34c2-5 6-10 12-14 4-2.5 8.5-4 13-4.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swept wing - right extension */}
      <path
        d="M46 26c3-0.5 6-0.2 8.5 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Forked tail */}
      <path
        d="M12 34c-1.5 3-2 6-1 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 34c-2.5 2-4 5-4 8.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Beak */}
      <path
        d="M42.5 21c2-0.5 4 0 5.5 1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Eye dot */}
      <circle cx="43" cy="22.5" r="1" fill={color} />
    </svg>
  );
}
