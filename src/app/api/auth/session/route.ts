import { NextResponse } from "next/server";
import { getAccount, SESSION_COOKIE } from "@/lib/account";
import { upsertProfileByEmail } from "@/lib/db";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Current placeholder account (or null). */
export async function GET() {
  const account = await getAccount();
  if (!account) return NextResponse.json({ account: null });
  const { email, name, profile } = account;
  return NextResponse.json({ account: { email, name, userType: profile.user_type } });
}

/** Placeholder sign-in / sign-up: name + email, no password. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; name?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) || null : null;
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const profile = await upsertProfileByEmail(email, name);
  const res = NextResponse.json({ account: { email: profile.email, name: profile.full_name, userType: profile.user_type } });
  res.cookies.set(SESSION_COOKIE, profile.user_id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
