"use client";

import { useEffect, useState } from "react";
import { BookOpen, Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { getUserPreferences, setUserPreferences } from "@/data/userTypes";
import type { AccountUserType } from "@/lib/db";

const TYPES: { value: AccountUserType; label: string; Icon: typeof BookOpen }[] = [
  { value: "student", label: "Student", Icon: BookOpen },
  { value: "graduate", label: "Graduate", Icon: GraduationCap },
  { value: "employee", label: "Employee", Icon: Briefcase },
];

export default function ProfileForm({
  email,
  initial,
  isNewAccount,
}: {
  email: string | null;
  isNewAccount: boolean;
  initial: { userType: AccountUserType; schoolOrCompany: string; city: string };
}) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // New account: adopt the path picked in the onboarding modal before sign-up.
  useEffect(() => {
    if (!isNewAccount) return;
    const local = getUserPreferences()?.userType;
    if (!local || local === "guest" || local === initial.userType) return;
    setForm((f) => ({ ...f, userType: local }));
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userType: local }),
    }).catch(() => undefined);
  }, [isNewAccount, initial.userType]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      // Keep the home page personalisation in sync with the account.
      setUserPreferences({ userType: form.userType, createdAt: new Date().toISOString() });
      setStatus("saved");
    } else {
      setStatus("error");
    }
  }

  const input = "w-full text-sm px-3 py-2 rounded-xl border border-[var(--hairline-strong)] bg-transparent focus:outline-none focus:border-[var(--accent)]";

  return (
    <section className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold">Personal profile</h2>
      </div>
      <p className="text-[11px] opacity-50 mb-4 truncate">{email}</p>

      <form onSubmit={save} className="space-y-4">
        <fieldset>
          <legend className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-2">I am a</legend>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--tint)]">
            {TYPES.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, userType: value }))}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] transition-all ${
                  form.userType === value ? "bg-[var(--background)] shadow-sm font-semibold" : "opacity-50 hover:opacity-80"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">School / company</span>
          <input className={`${input} mt-1`} value={form.schoolOrCompany} maxLength={120} onChange={(e) => setForm((f) => ({ ...f, schoolOrCompany: e.target.value }))} />
        </label>
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">City</span>
          <input className={`${input} mt-1`} value={form.city} maxLength={120} placeholder="e.g. Quezon City" onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        </label>
        <button type="submit" disabled={status === "saving"} className="btn-primary w-full text-sm py-2 inline-flex items-center justify-center gap-2">
          {status === "saving" && <Loader2 size={14} className="animate-spin" />}
          {status === "saved" ? "Saved" : "Save profile"}
        </button>
        {status === "error" && <p className="text-[11px] text-red-500">Could not save. Please try again.</p>}
      </form>

    </section>
  );
}
