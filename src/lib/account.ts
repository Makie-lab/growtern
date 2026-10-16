/**
 * PLACEHOLDER AUTH — a personal account identified by email, kept in a cookie.
 *
 * There is no password: anyone who types an email is "signed in" as that
 * account. Good enough for running the app locally. Replace with a real auth
 * provider (e.g. Clerk) before putting the app online.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfile, type Profile } from "@/lib/db";

export const SESSION_COOKIE = "growtern_session";

export interface Account {
  userId: string;
  email: string;
  name: string | null;
  profile: Profile;
}

export async function getAccount(): Promise<Account | null> {
  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  const profile = await getProfile(userId);
  if (!profile) return null;
  return { userId, email: profile.email, name: profile.full_name, profile };
}

/** For pages: redirect to sign-in when there is no account. */
export async function requireAccount(returnTo: string): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  return account;
}
