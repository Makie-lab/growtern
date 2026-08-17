"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import CompareIcon from "./CompareIcon";
import { getUserPreferences, setUserPreferences, clearUserPreferences, type UserType } from "@/data/userTypes";

type NavItem = {
  id: string;
  label: string;
  Icon: typeof Home | null;
  customIcon?: boolean;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "offerings", label: "Offerings", Icon: Sparkles },
  { id: "categories", label: "Categories", Icon: LayoutGrid },
  { id: "compare", label: "Compare", Icon: null, customIcon: true },
  { id: "roles", label: "Roles", Icon: Network },
  { id: "search", label: "Search", Icon: Search },
];

const userTypeLabels: Record<UserType, { label: string; icon: typeof User }> = {
  guest: { label: "Guest", icon: User },
  student: { label: "Student", icon: BookOpen },
  graduate: { label: "Graduate", icon: GraduationCap },
  employee: { label: "Employee", icon: Briefcase },
};

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>("home");
  const [showPanel, setShowPanel] = useState(false);
  const [userType, setUserType] = useState<UserType>("guest");
  const panelRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) setUserType(prefs.userType);
  }, []);

  // Close panel on outside click
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

    const targets = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
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
        router.push(`/#${id}`);
        return;
      }
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        history.replaceState(null, "", `/#${id}`);
      }
    },
    [isHome, router]
  );

  const handleChangeType = (type: UserType) => {
    setUserType(type);
    setUserPreferences({ userType: type, createdAt: new Date().toISOString() });
    setShowPanel(false);
    window.location.reload();
  };

  const handleReset = () => {
    clearUserPreferences();
    setShowPanel(false);
    window.location.reload();
  };

  const UserIcon = userTypeLabels[userType].icon;

  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <ul className="nav-pill flex items-center gap-1 px-3 py-2">
        {navItems.map(({ id, label, Icon, customIcon }) => {
          const active = isHome && activeId === id;
          return (
            <li key={id}>
              <a
                href={`/#${id}`}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                title={label}
                onClick={handleClick(id)}
                className={`nav-icon-btn group relative ${
                  active ? "nav-icon-btn--active" : ""
                }`}
              >
                {customIcon ? (
                  <CompareIcon size={18} />
                ) : Icon ? (
                  <Icon size={18} strokeWidth={2} />
                ) : null}
                <span className="nav-tooltip">{label}</span>
              </a>
            </li>
          );
        })}

        {/* Divider */}
        <li className="w-px h-6 bg-black/10 mx-1" />

        {/* User account button */}
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

          {/* Dropdown panel */}
          {showPanel && (
            <div className="absolute top-full right-0 mt-3 w-[260px] bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl p-4 animate-fade-in z-50">
              {/* Current user info */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/8">
                <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
                  <UserIcon size={20} className="text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{userTypeLabels[userType].label}</p>
                  <p className="text-[10px] opacity-40">Current path</p>
                </div>
              </div>

              {/* Switch user type */}
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
                        isActive
                          ? "bg-[#1e3a5f]/10 font-semibold"
                          : "hover:bg-black/[0.03]"
                      }`}
                    >
                      <TypeIcon size={16} className={isActive ? "text-[#1e3a5f]" : "opacity-50"} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-semibold">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reset / Guest */}
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm opacity-50 hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut size={16} />
                <span>Reset to Guest</span>
              </button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
