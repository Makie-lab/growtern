import { Suspense } from "react";
import AuthShell from "@/components/account/AuthShell";
import LocalSignInForm from "@/components/account/LocalSignInForm";

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your personal GrowTern account.">
      <Suspense>
        <LocalSignInForm mode="sign-in" />
      </Suspense>
    </AuthShell>
  );
}
