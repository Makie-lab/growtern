"use client";

import { useState, useEffect } from "react";
import { User, UserCheck, GraduationCap, Briefcase, BookOpen, ArrowRight } from "lucide-react";
import { getUserPreferences, setUserPreferences, type UserType } from "@/data/userTypes";

export default function UserSelection() {
  const [step, setStep] = useState<"initial" | "select-type" | "done">("initial");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs) {
      setStep("done");
    } else {
      setVisible(true);
    }
  }, []);

  const handleGuest = () => {
    setUserPreferences({ userType: "guest", createdAt: new Date().toISOString() });
    setStep("done");
    setVisible(false);
  };

  const handleUserType = (type: UserType) => {
    setUserPreferences({ userType: type, createdAt: new Date().toISOString() });
    setStep("done");
    setVisible(false);
    window.location.reload();
  };

  if (step === "done" || !visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        {step === "initial" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to GrowTern</h2>
            <p className="text-sm opacity-60 mb-8">
              How would you like to continue?
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setStep("select-type")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--hairline-strong)] hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                  <UserCheck size={22} className="text-[#1e3a5f]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Continue as User</p>
                  <p className="text-xs opacity-50">Personalized experience based on your path</p>
                </div>
                <ArrowRight size={16} className="opacity-30 group-hover:opacity-70 transition-opacity" />
              </button>

              <button
                onClick={handleGuest}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--hairline)] hover:border-[var(--hairline-strong)] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0">
                  <User size={22} className="opacity-50" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Continue as Guest</p>
                  <p className="text-xs opacity-50">Browse everything without personalization</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === "select-type" && (
          <div>
            <h2 className="text-2xl font-bold mb-1 text-center">I am a...</h2>
            <p className="text-sm opacity-60 mb-6 text-center">
              Choose your current stage — we&apos;ll prioritize what matters most to you.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleUserType("student")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--hairline-strong)] hover:border-blue-500/30 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={22} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Student</p>
                  <p className="text-xs opacity-50">Show me certifications, hackathons & projects</p>
                </div>
              </button>

              <button
                onClick={() => handleUserType("graduate")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--hairline-strong)] hover:border-purple-500/30 hover:bg-purple-50/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={22} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Graduate</p>
                  <p className="text-xs opacity-50">Show me internships, jobs & career paths</p>
                </div>
              </button>

              <button
                onClick={() => handleUserType("employee")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--hairline-strong)] hover:border-amber-500/30 hover:bg-amber-50/50 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={22} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Employee</p>
                  <p className="text-xs opacity-50">Show me webinars, upskilling & preferences</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep("initial")}
              className="w-full mt-4 text-xs opacity-40 hover:opacity-70 transition-opacity"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
