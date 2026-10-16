import AppShell from "@/components/app/AppShell";

/** Feature app: home hub, assessment, career path, experts and account. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
