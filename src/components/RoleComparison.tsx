"use client";

import { useState } from "react";
import { DollarSign, Target, GraduationCap, Building, ChevronDown } from "lucide-react";
import { roleComparisons, type RoleComparison as RoleCompType } from "@/data/roleComparison";

export default function RoleComparison() {
  const [selectedRoles, setSelectedRoles] = useState<RoleCompType[]>([
    roleComparisons[0],
    roleComparisons[2],
  ]);
  const [dropdownOpen, setDropdownOpen] = useState<0 | 1 | null>(null);

  const handleSelect = (index: 0 | 1, role: RoleCompType) => {
    setSelectedRoles((prev) => {
      const next = [...prev];
      next[index] = role;
      return next;
    });
    setDropdownOpen(null);
  };

  return (
    <section
      id="compare"
      aria-label="Compare roles"
      className="section-scroll max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 deco-circle relative overflow-hidden"
    >
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Compare roles</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 inline-block section-accent pl-5">
          Industry role{" "}
          <span
            className="font-serif italic"
            style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif" }}
          >
            comparison
          </span>
        </h2>
        <p className="text-base opacity-60 max-w-xl mx-auto">
          Compare salary ranges, focus areas, and what companies expect — based on Asia-Pacific markets.
        </p>
      </div>

      {/* Role selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[0, 1].map((i) => (
          <div key={i} className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === i ? null : (i as 0 | 1))}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-[var(--hairline-strong)] bg-[var(--background)] hover:shadow-sm transition-shadow"
            >
              <span className="font-semibold text-sm">{selectedRoles[i].name}</span>
              <ChevronDown size={16} className="opacity-40" />
            </button>
            {dropdownOpen === i && (
              <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-[var(--background)] border border-[var(--hairline-strong)] rounded-2xl shadow-xl max-h-[300px] overflow-y-auto animate-fade-in">
                {roleComparisons.map((role) => (
                  <button
                    key={role.name}
                    onClick={() => handleSelect(i as 0 | 1, role)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--tint)] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {selectedRoles.map((role, i) => (
          <div key={`${role.name}-${i}`} className="glass-card p-6 space-y-5">
            <h3 className="text-lg font-bold">{role.name}</h3>

            {/* Salary */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                <DollarSign size={16} className="text-[#1e3a5f]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Salary Range (Asia)</p>
                <p className="text-sm font-semibold mt-0.5">{role.salaryRange}</p>
              </div>
            </div>

            {/* Focus */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Target size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Focus</p>
                <p className="text-sm opacity-70 mt-0.5 leading-relaxed">{role.focus}</p>
              </div>
            </div>

            {/* Graduation pick */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Graduation Pick</p>
                <p className="text-sm font-semibold mt-0.5">{role.graduationPick}</p>
              </div>
            </div>

            {/* Company expectations */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Building size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-40">Companies Look For</p>
                <ul className="mt-1.5 space-y-1">
                  {role.companyExpectations.map((exp, j) => (
                    <li key={j} className="text-xs opacity-60 flex items-start gap-1.5">
                      <span className="opacity-40 mt-0.5">•</span>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
