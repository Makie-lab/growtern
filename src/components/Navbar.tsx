"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, signOut } from "@/components/account/useAccount";
import {
  Home,
  Sparkles,
  LayoutGrid,
  Search,
  User,
  BookOpen,
  GraduationCap,
  Briefcase,
  LogOut,
  Network,
  Sun,
  Moon,
  Monitor,
  ClipboardCheck,
  Users,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";
import CompareIcon from "./CompareIcon";
import { getUserPreferences, setUserPreferences, clearUserPreferences, type UserType } from "@/data/userTypes";

type ThemeMode = "light" | "dark" | "system";

type NavItem = {
  id: string;
  label: string;
  Icon: typeof Home | null;
  customIcon?: boolean;
  /** Route links (vs. home-page section anchors). */
  href?: string;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "offerings", label: "Offerings", Icon: Sparkles },
  { id: "categories", label: "Categories", Icon: LayoutGrid },
  { id: "compare", label: "Compare", Icon: null, customIcon: true },
  { id: "roles", label: "Roles", Icon: Network },
  { id: "search", label: "Search", Icon: Search },
  { id: "app", label: "GrowTern app", Icon: LayoutDashboard, href: "/" },
  { id: "assessment", label: "Assessment", Icon: ClipboardCheck, href: "/assessment" },
  { id: "experts", label: "Experts", Icon: Users, href: "/experts" },
];

const sectionItems = navItems.filter((n) => !n.href);

const userTypeLabels: Record<UserType, { label: string; icon: typeof User }> = {
  guest: { label: "Guest", icon: User },
  student: { label: "Student", icon: BookOpen },
  graduate: { label: "Graduate", icon: GraduationCap },
  employee: { label: "Employee", icon: Briefcase },
};

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
  } else if (mode === "light") {
    root.classList.add("light-mode");
    root.classList.remove("dark-mode");
  } else {
    root.classList.remove("dark-mode", "light-mode");
  }
}

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [showPanel, setShowPanel] = useState(false);
  const [userType, setUserType] = useState<UserType>("guest");
  const [theme, setTheme] = useState<ThemeMode>("system");
  const panelRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/explore";
  const { isSignedIn, account } = useAccount();

  // Restore active state from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sectionItems.some((n) => n.id === hash)) {
      setActiveId(hash);
    }
  }, []);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    function handlePopState() {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionItems.some((n) => n.id === hash)) {
        setActiveId(hash);
      } else {
        setActiveId("home");
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) setUserType(prefs.userType);
    const savedTheme = localStorage.getItem("growtern-theme") as ThemeMode | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Signed-in users: the account profile is the source of truth for the path.
  useEffect(() => {
    const type = account?.userType;
    if (!type) return;
    setUserType(type);
    const prefs = getUserPreferences();
    if (prefs?.userType !== type) setUserPreferences({ userType: type, createdAt: new Date().toISOString() });
  }, [account?.userType]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    }
    if (showPanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPanel]);

  useEffect(() => {
    if (!isHome) return;
    const targets = sectionItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (!isHome) {
        // Use window.location to fully navigate back to home with hash
        window.location.href = `/explore#${id}`;
        return;
      }
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        history.replaceState(null, "", `/explore#${id}`);
      }
    },
    [isHome]
  );

  const handleChangeType = async (type: UserType) => {
    setUserType(type);
    setUserPreferences({ userType: type, createdAt: new Date().toISOString() });
    if (isSignedIn && type !== "guest") {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: type }),
      }).catch(() => undefined);
    }
    setShowPanel(false);
    window.location.reload();
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("growtern-theme", mode);
    applyTheme(mode);
  };

  const handleReset = () => {
    clearUserPreferences();
    setShowPanel(false);
    window.location.reload();
  };

  const UserIcon = userTypeLabels[userType].icon;

  return (
    <nav aria-label="Primary" className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <ul className="nav-pill flex items-center gap-1 px-3 py-2">
        {navItems.map(({ id, label, Icon, customIcon, href }) => {
          if (href) {
            const routeActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={id}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={routeActive ? "page" : undefined}
                  title={label}
                  className={`nav-icon-btn group relative ${routeActive ? "nav-icon-btn--active" : ""}`}
                >
                  {Icon && <Icon size={18} strokeWidth={2} />}
                  <span className="nav-tooltip">{label}</span>
                </Link>
              </li>
            );
          }
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`/explore#${id}`}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                title={label}
                onClick={handleClick(id)}
                className={`nav-icon-btn group relative ${active && isHome ? "nav-icon-btn--active" : ""}`}
              >
                {customIcon ? <CompareIcon size={18} /> : Icon ? <Icon size={18} strokeWidth={2} /> : null}
                <span className="nav-tooltip">{label}</span>
              </a>
            </li>
          );
        })}

        <li className="w-px h-6 bg-[var(--hairline)] mx-1" />

        <li className="relative" ref={panelRef}>
          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`nav-icon-btn group relative ${showPanel ? "nav-icon-btn--active" : ""}`}
            aria-label="Account settings"
            title="Account"
          >
            <UserIcon size={18} strokeWidth={2} />
            <span className="nav-tooltip">Account</span>
          </button>

          {showPanel && (
            <div className="absolute top-full right-0 mt-3 w-[calc(100vw-32px)] sm:w-[280px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl p-4 animate-fade-in z-50">
              {/* User info */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--hairline)]">
                <div className="w-10 h-10 rounded-xl accent-bg flex items-center justify-center">
                  <UserIcon size={20} className="accent-icon" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {isSignedIn ? account?.name || account?.email : userTypeLabels[userType].label}
                  </p>
                  <p className="text-[10px] opacity-40 truncate">
                    {isSignedIn ? `Personal account · ${userTypeLabels[userType].label}` : "Guest · not signed in"}
                  </p>
                </div>
              </div>

              {/* Personal account */}
              <div className="space-y-1 mb-4">
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setShowPanel(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm accent-bg font-semibold"
                  >
                    <LayoutDashboard size={16} className="accent-icon" /> My dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-up" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm accent-bg font-semibold">
                      <UserPlus size={16} className="accent-icon" /> Create personal account
                    </Link>
                    <Link href="/sign-in" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-[var(--tint)]">
                      <LogIn size={16} className="opacity-50" /> Sign in
                    </Link>
                  </>
                )}
              </div>

              {/* Theme selector */}
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2">
                Appearance
              </p>
              <div className="flex items-center gap-1 mb-4 p-1 rounded-xl bg-[var(--tint)]">
                {themeOptions.map(({ value, label, icon: ThemeIcon }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      theme === value
                        ? "bg-[var(--background)] shadow-sm font-semibold"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    <ThemeIcon size={13} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Switch path */}
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2">
                Switch path
              </p>
              <div className="space-y-1 mb-3">
                {(["student", "graduate", "employee"] as UserType[]).map((type) => {
                  const { label, icon: TypeIcon } = userTypeLabels[type];
                  const isActive = userType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleChangeType(type)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors text-sm ${
                        isActive ? "accent-bg font-semibold" : "hover:bg-[var(--tint)]"
                      }`}
                    >
                      <TypeIcon size={16} className={isActive ? "accent-icon" : "opacity-50"} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full accent-bg accent-text font-semibold">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reset / sign out */}
              {isSignedIn ? (
                <button
                  onClick={() => {
                    clearUserPreferences();
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <LogOut size={16} />
                  <span>Reset to Guest</span>
                </button>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
