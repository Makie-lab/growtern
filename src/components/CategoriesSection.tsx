import Link from "next/link";
import {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  ArrowRight,
} from "lucide-react";
import { categories } from "@/data/features";

const iconMap: Record<string, typeof Award> = {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
};

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      aria-label="Browse categories"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 deco-cross relative overflow-hidden"
    >
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Browse by category</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 inline-block section-accent pl-5">
          Choose what you{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            need
          </span>
        </h2>
        <p className="text-base opacity-60 max-w-xl mx-auto">
          Select a category to explore free resources curated for your growth.
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Award;
          return (
            <Link
              key={cat.name}
              href={`/category/${cat.slug}`}
              className="glass-card p-6 flex flex-col gap-4 glass-hover group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center accent-bg"
                >
                  <Icon size={22} className="accent-icon" />
                </div>
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-60 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm opacity-55 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-auto pt-3 border-t border-[var(--hairline)]">
                <span className="text-xs font-medium opacity-40">
                  {cat.count} free resources →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
