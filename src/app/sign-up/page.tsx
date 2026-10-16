import { Suspense } from "react";
import AuthShell from "@/components/account/AuthShell";
import LocalSignInForm from "@/components/account/LocalSignInForm";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your personal account"
      subtitle="Save assessment results, track your career path and contact experts."
    >
      <Suspense>
        <LocalSignInForm mode="sign-up" />
      </Suspense>
    </AuthShell>
  );
}
