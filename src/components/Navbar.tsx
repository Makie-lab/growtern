"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Sparkles,
  LayoutGrid,
  GitBranch,
  Search,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  Icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "offerings", label: "Offerings", Icon: Sparkles },
  { id: "categories", label: "Categories", Icon: LayoutGrid },
  { id: "compare", label: "Compare", Icon: GitBranch },
  { id: "roles", label: "Roles", Icon: GitBranch },
  { id: "search", label: "Search", Icon: Search },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>("home");
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

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
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (!isHome) {
        // Navigate to home page with hash
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

  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <ul className="nav-pill flex items-center gap-1 px-3 py-2">
        {navItems.map(({ id, label, Icon }) => {
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
                <Icon size={18} strokeWidth={2} />
                <span className="nav-tooltip">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
