interface HeroGraphicProps {
  className?: string;
}

export default function HeroGraphic({ className = "" }: HeroGraphicProps) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Floating circles with pulse animation */}
      <circle cx="200" cy="200" r="120" stroke="var(--accent)" strokeWidth="0.8" opacity="0.15" className="animate-[spin_40s_linear_infinite]" />
      <circle cx="200" cy="200" r="160" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" className="animate-[spin_60s_linear_infinite_reverse]" />
      <circle cx="200" cy="200" r="80" stroke="var(--accent)" strokeWidth="1" opacity="0.2" strokeDasharray="8 8" className="animate-[spin_25s_linear_infinite]" />

      {/* Connection nodes */}
      <circle cx="200" cy="80" r="6" fill="var(--accent)" opacity="0.3" className="animate-[pulse_3s_ease-in-out_infinite]" />
      <circle cx="320" cy="200" r="5" fill="var(--accent)" opacity="0.25" className="animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
      <circle cx="200" cy="320" r="5" fill="var(--accent)" opacity="0.25" className="animate-[pulse_3s_ease-in-out_infinite_1s]" />
      <circle cx="80" cy="200" r="6" fill="var(--accent)" opacity="0.3" className="animate-[pulse_3s_ease-in-out_infinite_1.5s]" />

      {/* Diagonal nodes */}
      <circle cx="280" cy="120" r="4" fill="var(--accent)" opacity="0.2" className="animate-[pulse_4s_ease-in-out_infinite_0.3s]" />
      <circle cx="120" cy="280" r="4" fill="var(--accent)" opacity="0.2" className="animate-[pulse_4s_ease-in-out_infinite_0.8s]" />
      <circle cx="280" cy="280" r="3.5" fill="var(--accent)" opacity="0.15" className="animate-[pulse_4s_ease-in-out_infinite_1.2s]" />
      <circle cx="120" cy="120" r="3.5" fill="var(--accent)" opacity="0.15" className="animate-[pulse_4s_ease-in-out_infinite_1.8s]" />

      {/* Connection lines between nodes */}
      <line x1="200" y1="80" x2="280" y2="120" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="280" y1="120" x2="320" y2="200" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="320" y1="200" x2="280" y2="280" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="280" y1="280" x2="200" y2="320" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="200" y1="320" x2="120" y2="280" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="120" y1="280" x2="80" y2="200" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="80" y1="200" x2="120" y2="120" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <line x1="120" y1="120" x2="200" y2="80" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />

      {/* Cross connections */}
      <line x1="200" y1="80" x2="200" y2="320" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 6" />
      <line x1="80" y1="200" x2="320" y2="200" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 6" />

      {/* Center element - abstract logo mark */}
      <circle cx="200" cy="200" r="24" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />
      <circle cx="200" cy="200" r="8" fill="var(--accent)" opacity="0.2" />

      {/* Floating squares */}
      <rect x="145" y="380" width="18" height="18" stroke="var(--accent)" strokeWidth="0.8" opacity="0.15" transform="rotate(15 154 389)" className="animate-[bounce_5s_ease-in-out_infinite]" />
      <rect x="300" cy="350" width="12" height="12" stroke="var(--accent)" strokeWidth="0.8" opacity="0.1" transform="rotate(-10 306 356)" className="animate-[bounce_6s_ease-in-out_infinite_1s]" />

      {/* Bottom decorative lines */}
      <path d="M100 420 Q200 400 300 430" stroke="var(--accent)" strokeWidth="0.8" opacity="0.1" fill="none" />
      <path d="M120 450 Q220 430 320 460" stroke="var(--accent)" strokeWidth="0.6" opacity="0.08" fill="none" />

      {/* Floating dots trail */}
      <circle cx="160" cy="360" r="2" fill="var(--accent)" opacity="0.15" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      <circle cx="240" cy="370" r="2.5" fill="var(--accent)" opacity="0.12" className="animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
      <circle cx="310" cy="380" r="2" fill="var(--accent)" opacity="0.1" className="animate-[pulse_2.8s_ease-in-out_infinite_1s]" />

      {/* Abstract code brackets */}
      <path d="M150 140 L140 150 L150 160" stroke="var(--accent)" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
      <path d="M250 140 L260 150 L250 160" stroke="var(--accent)" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
    </svg>
  );
}
