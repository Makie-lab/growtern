interface SkylineProps {
  className?: string;
  color?: string;
}

export default function Skyline({ className = "", color = "#1e3a5f" }: SkylineProps) {
  return (
    <div className={`w-full flex items-center gap-0 ${className}`}>
      {/* Horizontal line extending left */}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color})` , opacity: 0.3 }} />

      {/* Skyline SVG - mountains, trees, buildings */}
      <svg
        viewBox="0 0 480 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[320px] sm:w-[400px] lg:w-[480px] flex-shrink-0"
        aria-hidden="true"
        style={{ opacity: 0.35 }}
      >
        {/* Ground line */}
        <line x1="0" y1="72" x2="480" y2="72" stroke={color} strokeWidth="1" />

        {/* Mountains - far background */}
        <path d="M0 72 L30 38 L60 72" stroke={color} strokeWidth="1" fill="none" />
        <path d="M20 72 L55 30 L90 72" stroke={color} strokeWidth="1" fill="none" />
        <path d="M50 72 L80 42 L110 72" stroke={color} strokeWidth="0.8" fill="none" />

        {/* Mountain with snow cap */}
        <path d="M75 72 L105 25 L135 72" stroke={color} strokeWidth="1.2" fill="none" />
        <path d="M95 40 L105 25 L115 40" stroke={color} strokeWidth="0.8" fill="none" strokeDasharray="2 2" />

        {/* Trees - pines */}
        <path d="M150 72 L150 58" stroke={color} strokeWidth="1" />
        <path d="M145 62 L150 52 L155 62" stroke={color} strokeWidth="0.8" fill="none" />
        <path d="M146 58 L150 48 L154 58" stroke={color} strokeWidth="0.8" fill="none" />

        <path d="M165 72 L165 60" stroke={color} strokeWidth="1" />
        <path d="M161 64 L165 55 L169 64" stroke={color} strokeWidth="0.8" fill="none" />
        <path d="M162 60 L165 51 L168 60" stroke={color} strokeWidth="0.8" fill="none" />

        <path d="M178 72 L178 62" stroke={color} strokeWidth="0.8" />
        <path d="M175 66 L178 58 L181 66" stroke={color} strokeWidth="0.7" fill="none" />

        {/* Small round tree */}
        <path d="M192 72 L192 63" stroke={color} strokeWidth="0.8" />
        <circle cx="192" cy="59" r="4" stroke={color} strokeWidth="0.8" fill="none" />

        {/* Buildings - city skyline */}
        {/* Tall thin building */}
        <rect x="210" y="35" width="12" height="37" stroke={color} strokeWidth="1" fill="none" />
        <line x1="213" y1="40" x2="213" y2="42" stroke={color} strokeWidth="0.6" />
        <line x1="216" y1="40" x2="216" y2="42" stroke={color} strokeWidth="0.6" />
        <line x1="219" y1="40" x2="219" y2="42" stroke={color} strokeWidth="0.6" />
        <line x1="213" y1="48" x2="213" y2="50" stroke={color} strokeWidth="0.6" />
        <line x1="216" y1="48" x2="216" y2="50" stroke={color} strokeWidth="0.6" />
        <line x1="219" y1="48" x2="219" y2="50" stroke={color} strokeWidth="0.6" />
        <line x1="213" y1="56" x2="213" y2="58" stroke={color} strokeWidth="0.6" />
        <line x1="216" y1="56" x2="216" y2="58" stroke={color} strokeWidth="0.6" />
        <line x1="219" y1="56" x2="219" y2="58" stroke={color} strokeWidth="0.6" />

        {/* Medium building */}
        <rect x="226" y="45" width="16" height="27" stroke={color} strokeWidth="1" fill="none" />
        <line x1="230" y1="49" x2="230" y2="51" stroke={color} strokeWidth="0.6" />
        <line x1="234" y1="49" x2="234" y2="51" stroke={color} strokeWidth="0.6" />
        <line x1="238" y1="49" x2="238" y2="51" stroke={color} strokeWidth="0.6" />
        <line x1="230" y1="56" x2="230" y2="58" stroke={color} strokeWidth="0.6" />
        <line x1="234" y1="56" x2="234" y2="58" stroke={color} strokeWidth="0.6" />
        <line x1="238" y1="56" x2="238" y2="58" stroke={color} strokeWidth="0.6" />
        <line x1="230" y1="63" x2="230" y2="65" stroke={color} strokeWidth="0.6" />
        <line x1="234" y1="63" x2="234" y2="65" stroke={color} strokeWidth="0.6" />

        {/* Tallest building with antenna */}
        <rect x="246" y="22" width="14" height="50" stroke={color} strokeWidth="1" fill="none" />
        <line x1="253" y1="22" x2="253" y2="14" stroke={color} strokeWidth="0.8" />
        <circle cx="253" cy="13" r="1.5" stroke={color} strokeWidth="0.6" fill="none" />
        <line x1="249" y1="28" x2="249" y2="30" stroke={color} strokeWidth="0.5" />
        <line x1="253" y1="28" x2="253" y2="30" stroke={color} strokeWidth="0.5" />
        <line x1="257" y1="28" x2="257" y2="30" stroke={color} strokeWidth="0.5" />
        <line x1="249" y1="36" x2="249" y2="38" stroke={color} strokeWidth="0.5" />
        <line x1="253" y1="36" x2="253" y2="38" stroke={color} strokeWidth="0.5" />
        <line x1="257" y1="36" x2="257" y2="38" stroke={color} strokeWidth="0.5" />
        <line x1="249" y1="44" x2="249" y2="46" stroke={color} strokeWidth="0.5" />
        <line x1="253" y1="44" x2="253" y2="46" stroke={color} strokeWidth="0.5" />
        <line x1="249" y1="52" x2="249" y2="54" stroke={color} strokeWidth="0.5" />
        <line x1="253" y1="52" x2="253" y2="54" stroke={color} strokeWidth="0.5" />
        <line x1="257" y1="52" x2="257" y2="54" stroke={color} strokeWidth="0.5" />
        <line x1="249" y1="60" x2="249" y2="62" stroke={color} strokeWidth="0.5" />
        <line x1="253" y1="60" x2="253" y2="62" stroke={color} strokeWidth="0.5" />
        <line x1="257" y1="60" x2="257" y2="62" stroke={color} strokeWidth="0.5" />

        {/* Short wide building */}
        <rect x="264" y="52" width="20" height="20" stroke={color} strokeWidth="1" fill="none" />
        <line x1="268" y1="56" x2="268" y2="58" stroke={color} strokeWidth="0.5" />
        <line x1="274" y1="56" x2="274" y2="58" stroke={color} strokeWidth="0.5" />
        <line x1="280" y1="56" x2="280" y2="58" stroke={color} strokeWidth="0.5" />
        <line x1="268" y1="63" x2="268" y2="65" stroke={color} strokeWidth="0.5" />
        <line x1="274" y1="63" x2="274" y2="65" stroke={color} strokeWidth="0.5" />
        <line x1="280" y1="63" x2="280" y2="65" stroke={color} strokeWidth="0.5" />

        {/* Another building */}
        <rect x="288" y="40" width="13" height="32" stroke={color} strokeWidth="1" fill="none" />
        <line x1="291" y1="45" x2="291" y2="47" stroke={color} strokeWidth="0.5" />
        <line x1="295" y1="45" x2="295" y2="47" stroke={color} strokeWidth="0.5" />
        <line x1="298" y1="45" x2="298" y2="47" stroke={color} strokeWidth="0.5" />
        <line x1="291" y1="53" x2="291" y2="55" stroke={color} strokeWidth="0.5" />
        <line x1="295" y1="53" x2="295" y2="55" stroke={color} strokeWidth="0.5" />

        {/* More trees on the right */}
        <path d="M310 72 L310 60" stroke={color} strokeWidth="0.8" />
        <path d="M307 64 L310 56 L313 64" stroke={color} strokeWidth="0.7" fill="none" />

        <path d="M322 72 L322 63" stroke={color} strokeWidth="0.7" />
        <circle cx="322" cy="59" r="3.5" stroke={color} strokeWidth="0.7" fill="none" />

        {/* Distant hills */}
        <path d="M340 72 L365 50 L390 72" stroke={color} strokeWidth="0.8" fill="none" />
        <path d="M370 72 L400 44 L430 72" stroke={color} strokeWidth="1" fill="none" />
        <path d="M410 72 L440 52 L470 72" stroke={color} strokeWidth="0.8" fill="none" />

        {/* Small tree far right */}
        <path d="M455 72 L455 64" stroke={color} strokeWidth="0.7" />
        <path d="M452 67 L455 60 L458 67" stroke={color} strokeWidth="0.6" fill="none" />
      </svg>
    </div>
  );
}
