import TernLogo from "./TernLogo";

export default function CTASection() {
  return (
    <section
      id="cta"
      aria-label="Get started"
      className="section-scroll max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 deco-diamond deco-rings relative"
    >
      <div className="glass-card p-12 sm:p-16 lg:p-20 text-center relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #6366f1)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #f59e0b, #1e3a5f)" }}
        />

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <TernLogo size={56} color="#1e3a5f" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Start{" "}
            <span
              className="font-serif italic"
              style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
            >
              growing
            </span>{" "}
            today
          </h2>

          <p className="text-lg opacity-60 max-w-xl mx-auto mb-10">
            All resources are free. No signups, no hidden costs. Just pick a
            category or search by your target role and go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#categories" className="btn-primary text-[15px] px-8 py-3.5">
              Browse Categories
            </a>
            <a href="#search" className="btn-secondary text-[15px] px-8 py-3.5">
              Search by Role
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
