import crypto from "crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

export const ADMIN_COOKIE_NAME = "samosci_admin_token";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "samosci-psu-hub-blueprint-secret-key-2026";

export function computeAdminToken(adminPassword: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`samosci-admin:${adminPassword}`)
    .digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    const db = await getDb();
    const expectedToken = computeAdminToken(db.adminPassword);
    return safeEqual(token, expectedToken);
  } catch {
    return false;
  }
}
