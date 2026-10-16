"use client";

import { useEffect, useState } from "react";

export interface ClientAccount {
  email: string;
  name: string | null;
  userType: "student" | "graduate" | "employee";
}

/** Client-side view of the placeholder session. */
export function useAccount() {
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : { account: null }))
      .then((data) => active && setAccount(data.account ?? null))
      .catch(() => undefined)
      .finally(() => active && setIsLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  return { account, isLoaded, isSignedIn: Boolean(account) };
}

export async function signOut() {
  await fetch("/api/auth/session", { method: "DELETE" });
  window.location.href = "/";
}
