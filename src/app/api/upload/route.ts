import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "ไฟล์รูปภาพต้องมีขนาดไม่เกิน 8 MB" },
        { status: 400 }
      );
    }

    const extFromMime = ALLOWED_TYPES[file.type];
    const origExt = path.extname(file.name).toLowerCase();
    const validExts = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
    const ext = extFromMime || (validExts.includes(origExt) ? origExt : "");

    if (!ext) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์รูปภาพ (.png, .jpg, .webp, .gif, .svg)" },
        { status: 400 }
      );
    }

    const baseName = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40) || "upload";

    const fileName = `${Date.now()}-${baseName}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path.join(uploadsDir, fileName), buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch {
    return NextResponse.json({ error: "อัปโหลดไฟล์ไม่สำเร็จ" }, { status: 500 });
  }
}
