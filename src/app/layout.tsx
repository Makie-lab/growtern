import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowTern — Grow Your Internship Career",
  description:
    "GrowTern helps students and aspiring professionals find internships, build skills, and launch careers through mentorship, AHP-weighted competency assessments, and Philippines-based expert guidance.",
  keywords: ["internship", "career", "mentorship", "students", "assessment", "AHP", "Philippines"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" data-scroll-behavior="smooth">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
