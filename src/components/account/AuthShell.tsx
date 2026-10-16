import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TernLogo from "@/components/TernLogo";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={16} /> Back to GrowTern
      </Link>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <TernLogo size={44} color="#1e3a5f" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm opacity-60 mt-2">{subtitle}</p>
      </div>
      {children}
    </main>
  );
}
