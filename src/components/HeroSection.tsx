import { ArrowDown } from "lucide-react";
import TernLogo from "./TernLogo";
import TernFlock from "./TernFlock";
import HeroGraphic from "./HeroGraphic";

export default function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="section-scroll min-h-[calc(100vh-2rem)] flex items-center px-4 pt-24 pb-16 sm:pt-28 relative overflow-hidden deco-squares"
    >
      {/* Tern flock decoration - top right */}
      <div className="absolute top-20 right-0 w-[300px] sm:w-[400px] opacity-40 pointer-events-none">
        <TernFlock color="#1e3a5f" />
      </div>

      {/* Animated vector graphic - right side */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[300px] sm:w-[400px] lg:w-[500px] pointer-events-none hidden md:block">
        <HeroGraphic />
      </div>

      {/* Decorative squares */}
      <div className="absolute top-32 left-8 w-16 h-16 border border-[#1e3a5f]/[0.3] rotate-12 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-40 right-12 w-10 h-10 border border-[#1e3a5f]/[0.25] -rotate-6 pointer-events-none hidden sm:block" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-start text-left animate-fade-in">
        {/* Logo mark */}
        <div className="mb-6 animate-float">
          <TernLogo size={56} color="#1e3a5f" />
        </div>

        {/* Brand name */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-none tracking-tighter mb-4 sm:mb-6 deco-corner">
          <span className="font-black">Grow</span>
          <span
            className="font-bold italic accent-text"
            style={{
              fontFamily: "'Instrument Serif', ui-serif, Georgia, serif",
            }}
          >
            Tern
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl opacity-70 mb-3 sm:mb-4 max-w-3xl para-bordered">
          Free resources to{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            grow
          </span>{" "}
          your career.
        </p>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-50 mb-8 sm:mb-12 max-w-2xl">
          Certifications, internships, hackathons, webinars, and more — curated
          for Asia-based students and professionals. Search by role, compare paths, find what you need.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
          <a href="#categories" className="btn-primary">
            Browse Categories
          </a>
          <a href="#compare" className="btn-secondary">
            Compare Roles
          </a>
        </div>

        {/* Scroll indicator - centered under the whole intro */}
        <div className="w-full flex justify-center">
          <a
            href="#offerings"
            aria-label="Scroll to offerings"
            className="opacity-40 hover:opacity-70 transition-opacity"
          >
            <ArrowDown size={20} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
