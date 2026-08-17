import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { categories, resources } from "@/data/features";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryResources = resources.filter((r) => r.category === category.name);

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto">
      {/* Back link */}
      <Link
        href="/#categories"
        className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity mb-8"
      >
        <ArrowLeft size={16} />
        Back to categories
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-2">{category.name}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {category.name}
        </h1>
        <p className="text-base opacity-60 max-w-2xl">
          {category.description}
        </p>
        <p className="text-sm opacity-40 mt-2">
          {categoryResources.length} free resources available
        </p>
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryResources.map((resource) => (
          <a
            key={resource.id}
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 flex flex-col gap-3 glass-hover group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug group-hover:opacity-80 transition-opacity">
                {resource.title}
              </h3>
              <ExternalLink size={14} className="flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity mt-0.5" />
            </div>
            <p className="text-xs opacity-55 leading-relaxed flex-1">
              {resource.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--hairline)]">
              <span className="text-[11px] font-medium opacity-40">
                {resource.provider}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900">
                Free
              </span>
            </div>
            {/* Role tags */}
            <div className="flex flex-wrap gap-1">
              {resource.roles.map((role) => (
                <span
                  key={role}
                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--tint)] opacity-60"
                >
                  {role}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
