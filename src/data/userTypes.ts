import type { Category } from "./features";

export type UserType = "guest" | "student" | "graduate" | "employee";

export interface UserPreferences {
  userType: UserType;
  selectedRole?: string;
  createdAt: string;
}

export const STUDENT_PRIORITIES: Category[] = [
  "Certifications",
  "Hackathons",
  "Workshops",
  "Projects",
];

export const GRADUATE_PRIORITIES: Category[] = [
  "Internships",
  "Certifications",
  "Projects",
  "Webinars",
];

export const EMPLOYEE_PRIORITIES: Category[] = [
  "Webinars",
  "Certifications",
  "Workshops",
  "Scholarships",
];

const STORAGE_KEY = "growtern_user_preferences";

export function getUserPreferences(): UserPreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserPreferences;
  } catch {
    return null;
  }
}

export function setUserPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    console.error("Failed to save user preferences to localStorage");
  }
}

export function clearUserPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("Failed to clear user preferences from localStorage");
  }
}
