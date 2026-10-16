import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/account/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your personal account"
      subtitle="Save assessment results, track your career path and contact experts."
    >
      <SignUp />
    </AuthShell>
  );
}
