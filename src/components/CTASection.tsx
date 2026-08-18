import TernLogo from "./TernLogo";

export default function CTASection() {
  return (
    <section
      id="cta"
      aria-label="Get started"
      className="section-scroll max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 deco-diamond deco-rings relative"
    >
      <div className="glass-card p-10 sm:p-14 text-center relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #1e3a5f, #6366f1)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, #f59e0b, #1e3a5f)" }}
        />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <TernLogo size={48} color="#1e3a5f" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Start{" "}
            <span
              className="font-serif italic"
              style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
            >
              growing
            </span>{" "}
            today
          </h2>

          <p className="text-base opacity-60 max-w-lg mx-auto mb-8">
            All resources are free. No signups, no hidden costs. Just pick a
            category or search by your target role and go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#categories" className="btn-primary">
              Browse Categories
            </a>
            <a href="#search" className="btn-secondary">
              Search by Role
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
