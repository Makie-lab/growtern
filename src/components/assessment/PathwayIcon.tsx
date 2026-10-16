import { BarChart3, Code2, Network, ShieldCheck, type LucideProps } from "lucide-react";
import type { Pathway } from "@/data/assessment/pathways";

const icons = { BarChart3, Code2, Network, ShieldCheck };

export default function PathwayIcon({ icon, ...props }: { icon: Pathway["icon"] } & LucideProps) {
  const Icon = icons[icon];
  return <Icon {...props} />;
}
