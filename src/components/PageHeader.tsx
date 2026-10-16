export default function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        {title}{" "}
        {accent && (
          <span className="font-serif italic" style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}>
            {accent}
          </span>
        )}
      </h1>
      {description && <p className="text-base opacity-60 max-w-2xl">{description}</p>}
      {children}
    </div>
  );
}
