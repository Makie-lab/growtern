"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  Home,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Sun,
  Target,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import TernLogo from "@/components/TernLogo";
import { signOut, useAccount } from "@/components/account/useAccount";
import { clearUserPreferences } from "@/data/userTypes";
import { applyTheme, getSavedTheme, saveTheme, type ThemeMode } from "@/lib/theme";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/assessment", label: "Assessment", Icon: ClipboardCheck },
  { href: "/career-path", label: "Career Path", Icon: Target },
  { href: "/experts", label: "Experts", Icon: Users },
  { href: "/dashboard", label: "My Account", Icon: UserRound },
];

const THEMES: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string | null | undefined, email: string | undefined) {
  const source = name || email || "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <TernLogo size={26} color="#1e3a5f" />
      <span className="text-lg tracking-tight">
        <span className="font-bold">Grow</span>
        <span className="font-bold italic accent-text" style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}>
          Tern
        </span>
      </span>
    </Link>
  );
}

/** Feature-focused app layout: sidebar on desktop, top bar + bottom tabs on mobile. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { account, isLoaded } = useAccount();
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const saved = getSavedTheme();
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    setTheme(mode);
    saveTheme(mode);
  };

  const handleSignOut = () => {
    clearUserPreferences();
    signOut();
  };

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="app-sidebar hidden lg:flex fixed inset-y-0 left-0 w-[248px] flex-col z-40">
        <div className="px-5 pt-6 pb-8">
          <Brand />
          <p className="text-[10px] opacity-45 mt-1 ml-[34px]">Career assessment · Philippines</p>
        </div>

        <nav aria-label="App" className="flex-1 px-3 space-y-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`app-nav-link ${active ? "app-nav-link--active" : ""}`}
              >
                <Icon size={18} strokeWidth={2} /> {label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-[var(--hairline)]">
            <Link href="/explore" className="app-nav-link">
              <BookOpen size={18} strokeWidth={2} /> Free resources
            </Link>
          </div>
        </nav>

        <div className="p-3 space-y-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--tint)]" role="group" aria-label="Theme">
            {THEMES.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                title={label}
                aria-pressed={theme === value}
                onClick={() => changeTheme(value)}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${
                  theme === value ? "bg-[var(--background)] shadow-sm" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          {!isLoaded ? (
            <div className="h-[58px] rounded-xl bg-[var(--tint)] animate-pulse-subtle" />
          ) : account ? (
            <div className="flex items-center gap-3 p-2 rounded-xl border border-[var(--hairline)]">
              <span className="w-9 h-9 rounded-full accent-bg accent-text flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials(account.name, account.email)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{account.name ?? "Personal account"}</p>
                <p className="text-[10px] opacity-50 truncate">{account.email}</p>
              </div>
              <button type="button" onClick={handleSignOut} title="Sign out" aria-label="Sign out" className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/sign-up" className="btn-primary w-full justify-center text-xs py-2.5">
                <UserPlus size={14} /> Create personal account
              </Link>
              <Link href="/sign-in" className="btn-secondary w-full justify-center text-xs py-2.5">
                <LogIn size={14} /> Sign in
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="app-topbar lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14">
        <Brand />
        {isLoaded &&
          (account ? (
            <Link href="/dashboard" aria-label="My account" className="w-8 h-8 rounded-full accent-bg accent-text flex items-center justify-center text-[11px] font-bold">
              {initials(account.name, account.email)}
            </Link>
          ) : (
            <Link href="/sign-in" className="btn-secondary text-xs px-3 py-1.5">
              Sign in
            </Link>
          ))}
      </header>

      <main className="lg:pl-[248px] relative z-[2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 lg:pt-10 pb-28 lg:pb-12">{children}</div>
      </main>

      {/* Mobile bottom tabs */}
      <nav aria-label="App" className="app-bottombar lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-5">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${active ? "font-semibold accent-text" : "opacity-55"}`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {label.replace("My ", "")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
