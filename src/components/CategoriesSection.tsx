import Link from "next/link";
import {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  ArrowRight,
  Video,
} from "lucide-react";
import { categories } from "@/data/features";

const iconMap: Record<string, typeof Award> = {
  Award,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  Video,
};

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      aria-label="Browse categories"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 deco-cross relative overflow-hidden"
    >
      <div className="mb-8 text-center">
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

      {/* Minimized Category Cards - icon + title inline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Award;
          return (
            <Link
              key={cat.name}
              href={`/category/${cat.slug}`}
              className="glass-card px-4 py-3 flex items-center gap-3 glass-hover group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center accent-bg flex-shrink-0">
                <Icon size={18} className="accent-icon" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{cat.name}</h3>
                <p className="text-[11px] opacity-40">{cat.count} resources</p>
              </div>
              <ArrowRight
                size={14}
                className="opacity-0 group-hover:opacity-50 -translate-x-1 group-hover:translate-x-0 transition-all flex-shrink-0"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
