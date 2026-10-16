import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { upsertProfile, type Profile } from "@/lib/db";

export interface Account {
  userId: string;
  email: string | null;
  name: string | null;
  profile: Profile;
}

/** Resolve the signed-in personal account and make sure it has a profile row. */
export async function getAccount(): Promise<Account | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const name = user?.fullName || user?.firstName || null;
  const profile = await upsertProfile({ userId, email, fullName: name });
  return { userId, email, name: profile.full_name ?? name, profile };
}

/** For pages: redirect to sign-in when there is no account. */
export async function requireAccount(returnTo: string): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  return account;
}
