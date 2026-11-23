import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  computeAdminToken,
  isAdminAuthenticated,
  safeEqual,
} from "@/lib/auth";
import { getDb, updateDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string; action?: string };

    if (body.action === "logout") {
      const res = NextResponse.json({ authenticated: false, message: "ออกจากระบบแล้ว" });
      res.cookies.set(ADMIN_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    const password = typeof body.password === "string" ? body.password : "";
    if (!password) {
      return NextResponse.json({ error: "กรุณากรอกรหัสผ่าน" }, { status: 400 });
    }

    const db = await getDb();
    if (!safeEqual(password, db.adminPassword)) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const token = computeAdminToken(db.adminPassword);
    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "รูปแบบคำขอไม่ถูกต้อง" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const currentPassword = body.currentPassword ?? "";
    const newPassword = (body.newPassword ?? "").trim();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!safeEqual(currentPassword, db.adminPassword)) {
      return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });
    }

    await updateDb((current) => ({
      ...current,
      adminPassword: newPassword,
    }));

    const newToken = computeAdminToken(newPassword);
    const res = NextResponse.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    res.cookies.set(ADMIN_COOKIE_NAME, newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "ไม่สามารถอัปเดตรหัสผ่านได้" }, { status: 500 });
  }
}
