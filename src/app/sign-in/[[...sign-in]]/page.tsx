import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/account/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your personal GrowTern account.">
      <SignIn />
    </AuthShell>
  );
}
