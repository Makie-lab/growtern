import { NextResponse } from "next/server";
import { getAccount } from "@/lib/account";
import { updateProfile, type AccountUserType } from "@/lib/db";

const USER_TYPES: AccountUserType[] = ["student", "graduate", "employee"];

function cleanText(value: unknown, max = 120): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

export async function GET() {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ profile: account.profile });
}

export async function PUT(request: Request) {
  const account = await getAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const userType = body?.userType as AccountUserType;
  if (!USER_TYPES.includes(userType)) {
    return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
  }

  // Fields omitted from the body keep their current value.
  const has = (key: string) => body !== null && Object.prototype.hasOwnProperty.call(body, key);
  const profile = await updateProfile(account.userId, {
    userType,
    schoolOrCompany: has("schoolOrCompany") ? cleanText(body?.schoolOrCompany) : account.profile.school_or_company,
    city: has("city") ? cleanText(body?.city) : account.profile.city,
  });
  return NextResponse.json({ profile });
}
