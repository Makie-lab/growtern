import { ArrowDown } from "lucide-react";
import TernLogo from "./TernLogo";

export default function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="section-scroll min-h-[calc(100vh-2rem)] flex items-center px-4 pt-24 pb-16 sm:pt-28"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-start text-left animate-fade-in">
        {/* Logo mark — just the tern, no border */}
        <div className="mb-6 animate-float">
          <TernLogo size={56} color="#1e3a5f" />
        </div>

        {/* Brand name — Grow+Tern close together, Tern in serif font */}
        <h1 className="text-7xl sm:text-8xl lg:text-9xl leading-none tracking-tighter mb-5">
          <span className="font-black">Grow</span>
          <span
            className="font-bold italic"
            style={{
              fontFamily: "'Instrument Serif', ui-serif, Georgia, serif",
              color: "#1e3a5f",
            }}
          >
            Tern
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-2xl sm:text-3xl opacity-70 mb-3 max-w-2xl">
          Free resources to{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            grow
          </span>{" "}
          your career.
        </p>

        <p className="text-lg sm:text-xl opacity-50 mb-12 max-w-xl">
          Discover certifications, internships, hackathons, and more — curated
          for students and aspiring professionals. Search by role, find what
          you need.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
          <a href="#categories" className="btn-primary">
            Browse Categories
          </a>
          <a href="#roles" className="btn-secondary">
            Explore Roles
          </a>
        </div>

        {/* Scroll indicator */}
        <a
          href="#offerings"
          aria-label="Scroll to offerings"
          className="opacity-40 hover:opacity-70 transition-opacity"
        >
          <ArrowDown size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
