import TernLogo from "./TernLogo";
import TernFlock from "./TernFlock";

const footerLinks = [
  { label: "Home", href: "/#home" },
  { label: "Offerings", href: "/#offerings" },
  { label: "Categories", href: "/#categories" },
  { label: "Compare", href: "/#compare" },
  { label: "Roles", href: "/#roles" },
  { label: "Search", href: "/#search" },
];

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-5 sm:px-8 lg:px-[1in] relative overflow-hidden">
      {/* Tern flock decoration - bottom */}
      <div className="absolute bottom-4 left-0 w-[200px] sm:w-[350px] opacity-20 pointer-events-none">
        <TernFlock color="#1e3a5f" flip />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Top row - logo and links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <TernLogo size={24} color="#1e3a5f" />
            <span className="text-lg sm:text-xl tracking-tight">
              <span className="font-bold">Grow</span>
              <span
                className="font-bold italic"
                style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif", color: "#1e3a5f" }}
              >
                Tern
              </span>
            </span>
          </div>

          <nav aria-label="Footer" className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-wrap">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] sm:text-[15px] opacity-50 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row - copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-5 border-t border-[var(--hairline)]">
          <p className="text-[12px] sm:text-[14px] opacity-40">
            &copy; {new Date().getFullYear()} GrowTern. All rights reserved.
          </p>
          <p className="text-[12px] sm:text-[14px] opacity-40">
            Built for Asia-Pacific students & professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
