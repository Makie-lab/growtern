import TernLogo from "./TernLogo";

const footerLinks = [
  { label: "Home", href: "/#home" },
  { label: "Offerings", href: "/#offerings" },
  { label: "Categories", href: "/#categories" },
  { label: "Roles", href: "/#roles" },
  { label: "Search", href: "/#search" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + brand */}
        <div className="flex items-center gap-2">
          <TernLogo size={24} color="#1e3a5f" />
          <span className="text-lg tracking-tight">
            <span className="font-bold">Grow</span>
            <span
              className="font-bold italic"
              style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif", color: "#1e3a5f" }}
            >
              Tern
            </span>
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm opacity-50 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs opacity-40">
          &copy; {new Date().getFullYear()} GrowTern. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
