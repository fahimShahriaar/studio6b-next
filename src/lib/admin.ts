import { auth } from "@/auth";

export type ActionResult = { ok: boolean; error?: string };

/** Throws if the caller is not an authenticated admin. Use in every mutating action. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export const ok = (): ActionResult => ({ ok: true });
export const fail = (error: string): ActionResult => ({ ok: false, error });
