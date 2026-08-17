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
      {/* Tern bird in flight - single color, elegant silhouette */}
      <path
        d="M8 36c2-1 6-2 10-1.5C22 35 26 37 28 38c2 1 4.5 1.5 7 1 3-.6 5-2 7-4 1.5-1.5 3-3.5 4-6 .8-2 1.2-4 1-6-.2-2-1-3.5-2.5-4.5-1.5-1-3.5-1.2-5.5-.5-1.5.5-3 1.5-4 3-.8 1.2-1.2 2.5-1 4 .2 1.2.8 2 1.8 2.6 1 .6 2.2.6 3.2.1.8-.4 1.4-1 1.6-1.8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wing sweep */}
      <path
        d="M18 34.5c4-6 10-11 17-13.5 4-1.4 8-1.8 11.5-1"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail fork */}
      <path
        d="M8 36c1 2 2.5 4.5 5 6.5M8 36c-0.5 3 0 6 1.5 8.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Long wing feather */}
      <path
        d="M28 38c6-1 13-4.5 18-10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
