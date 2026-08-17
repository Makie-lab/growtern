interface TernFlockProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

export default function TernFlock({ className = "", color = "#1e3a5f", flip = false }: TernFlockProps) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      {/* Bird 1 - large, leading */}
      <path
        d="M80 60c3-2 8-4 14-3 6 1 10 4 13 6 2 1.5 5 2 8 1.5 3-.5 6-2.5 8-5 1.5-2 2.5-4 2-6.5-.5-2.5-2-4-4-5-2-1-4.5-1-6.5.5-1.5.8-2.5 2-3 3.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path d="M80 60c1.5 2.5 3.5 5 6 7M80 60c-.5 3.5 0.5 6.5 2 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

      {/* Bird 2 - medium, upper right */}
      <path
        d="M160 35c2-1.5 6-3 10-2.5 5 .8 8 3 10 5 1.5 1 4 1.5 6 1 2.5-.5 4.5-2 6-4 1-1.5 1.5-3 1.5-5-.3-2-1.5-3-3.5-4-1.5-.7-3.5-.7-5 .5-1 .6-2 1.5-2.5 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M160 35c1 2 2.5 4 4.5 5.5M160 35c-.3 2.5 .3 5 1.5 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Bird 3 - small, far right */}
      <path
        d="M260 50c1.5-1 4.5-2.5 8-2 4 .6 6.5 2.5 8 4 1 .8 3 1.2 4.5.8 2-.4 3.5-1.5 4.5-3 .8-1.2 1-2.5 1-4-.2-1.5-1-2.5-2.5-3-1.2-.6-2.8-.5-4 .3-.8.5-1.5 1.2-1.8 2.2"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M260 50c.8 1.5 2 3.5 3.5 4.5M260 50c-.2 2 .2 4 1 5.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />

      {/* Bird 4 - tiny, high */}
      <path
        d="M320 25c1-.8 3.5-2 6-1.5 3 .5 5 2 6 3 .8.6 2 1 3.5.6 1.5-.3 2.5-1.2 3.5-2.5.5-1 .8-2 .7-3-.2-1.2-.8-2-2-2.5-1-.4-2.2-.4-3 .3-.6.4-1.2 1-1.4 1.8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Bird 5 - medium, lower left */}
      <path
        d="M40 90c2-1.2 5.5-2.8 9-2.2 4.5.7 7.5 3 9 4.5 1.2.8 3.5 1.2 5.5.8 2.2-.4 4-1.8 5.5-3.5 1-1.3 1.4-2.8 1.3-4.5-.2-1.7-1.2-3-3-3.8-1.4-.6-3.2-.6-4.5.4-1 .6-1.8 1.4-2.2 2.8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path d="M40 90c1 2 2.5 4 4.5 5.5M40 90c-.3 2.5.3 5 1.5 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />

      {/* Bird 6 - tiny, far upper */}
      <path
        d="M200 18c1-.6 3-1.5 5-1.2 2.5.4 4 1.5 5 2.5.6.5 1.8.7 2.8.5 1.2-.3 2-1 2.8-2 .4-.8.6-1.5.5-2.3-.1-1-.6-1.6-1.6-2-.8-.3-1.8-.3-2.5.2-.5.3-1 .8-1.1 1.4"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}
