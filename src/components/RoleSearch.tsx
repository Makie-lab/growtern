"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink } from "lucide-react";
import { resources, roles, type Role } from "@/data/features";

// Extended roles list
const allRoles: Role[] = [
  ...roles,
];

export default function RoleSearch() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleQuery, setRoleQuery] = useState("");
  const [resourceQuery, setResourceQuery] = useState("");

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roleQuery) return allRoles;
    return allRoles.filter((r) =>
      r.toLowerCase().includes(roleQuery.toLowerCase())
    );
  }, [roleQuery]);

  // Duplicate roles for seamless infinite scroll animation
  const marqueeRoles = useMemo(() => [...filteredRoles, ...filteredRoles], [filteredRoles]);

  const filtered = selectedRole
    ? resources.filter((r) => r.roles.includes(selectedRole))
    : [];

  const displayResults = resourceQuery
    ? filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(resourceQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(resourceQuery.toLowerCase())
      )
    : filtered;

  return (
    <section
      id="search"
      aria-label="Search by role"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Find your path</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Search by{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            role
          </span>
        </h2>
        <p className="text-base opacity-60 max-w-xl mx-auto">
          Search for a role or click one from the ticker below to find matching resources.
        </p>
      </div>

      {/* Search bar for roles - always visible */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-full border border-[var(--hairline-strong)] bg-white shadow-sm transition-shadow focus-within:shadow-md focus-within:border-black/20">
          <Search size={18} className="opacity-40 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search roles... (e.g. Frontend, Cloud, Data)"
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            className="flex-1 min-w-0 outline-none bg-transparent text-sm"
          />
          {roleQuery && (
            <button
              onClick={() => setRoleQuery("")}
              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Animated marquee ticker - roles scroll right to left */}
      <div className="relative overflow-hidden mb-8 py-2">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          <div className="marquee-content">
            {marqueeRoles.map((role, i) => (
              <button
                key={`${role}-${i}`}
                onClick={() => {
                  setSelectedRole(selectedRole === role ? null : role);
                  setResourceQuery("");
                }}
                className={`chip flex-shrink-0 ${selectedRole === role ? "chip--active" : ""}`}
                aria-pressed={selectedRole === role}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected role indicator + resource search */}
      {selectedRole && (
        <div className="animate-fade-in">
          <div className="max-w-xl mx-auto mb-6">
            <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-[var(--hairline-strong)] bg-white shadow-sm">
              <Search size={16} className="opacity-40 flex-shrink-0" />
              <input
                type="text"
                placeholder={`Search resources for ${selectedRole}...`}
                value={resourceQuery}
                onChange={(e) => setResourceQuery(e.target.value)}
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
              />
              {resourceQuery && (
                <button
                  onClick={() => setResourceQuery("")}
                  className="text-xs opacity-50 hover:opacity-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <p className="text-sm opacity-50 mb-4">
            Showing {displayResults.length} resource{displayResults.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold opacity-80">{selectedRole}</span>
            <button
              onClick={() => setSelectedRole(null)}
              className="ml-2 text-xs opacity-50 hover:opacity-100 underline"
            >
              clear
            </button>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayResults.map((resource) => (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-subtle p-5 flex flex-col gap-2 glass-hover group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-snug group-hover:opacity-80 transition-opacity">
                    {resource.title}
                  </h4>
                  <ExternalLink size={14} className="flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity mt-0.5" />
                </div>
                <p className="text-xs opacity-55 leading-relaxed flex-1">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--hairline)]">
                  <span className="text-[11px] font-medium opacity-40">
                    {resource.provider}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(30, 58, 95, 0.1)", color: "#1e3a5f" }}
                  >
                    {resource.category}
                  </span>
                </div>
              </a>
            ))}
          </div>
          {displayResults.length === 0 && (
            <p className="text-center text-sm opacity-40 py-8">
              No resources found. Try a different search term.
            </p>
          )}
        </div>
      )}

      {!selectedRole && (
        <p className="text-center text-sm opacity-40 mt-2">
          Click a role from the ticker above to discover resources
        </p>
      )}
    </section>
  );
}
