import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateDb } from "@/lib/db";
import { Member } from "@/types/hub";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Member>;
    if (!body.name?.trim() || !body.role?.trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อ-สกุล และตำแหน่ง" },
        { status: 400 }
      );
    }

    let createdMember: Member | null = null;
    const updated = await updateDb((current) => {
      const nextOrder =
        current.members.length > 0
          ? Math.max(...current.members.map((m) => m.order)) + 1
          : 1;

      createdMember = {
        id: `mem-${Date.now()}`,
        name: body.name!.trim(),
        nickname: body.nickname?.trim() || "",
        role: body.role!.trim(),
        department: body.department?.trim() || "ฝ่ายบริหาร",
        yearAndMajor: body.yearAndMajor?.trim() || "คณะวิทยาศาสตร์ ม.อ.",
        bio: body.bio?.trim() || "",
        quote: body.quote?.trim() || "",
        imageUrl: body.imageUrl?.trim() || "/assets/members/member-1.svg",
        order: typeof body.order === "number" ? body.order : nextOrder,
        contacts: {
          instagram: body.contacts?.instagram?.trim() || "",
          facebook: body.contacts?.facebook?.trim() || "",
          line: body.contacts?.line?.trim() || "",
          email: body.contacts?.email?.trim() || "",
        },
      };

      return {
        ...current,
        members: [...current.members, createdMember],
      };
    });

    return NextResponse.json({
      member: createdMember,
      members: [...updated.members].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "เพิ่มข้อมูลกรรมการไม่สำเร็จ" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as
      | { members: Member[] }
      | Partial<Member>;

    if ("members" in body && Array.isArray(body.members)) {
      const updated = await updateDb((current) => ({
        ...current,
        members: body.members!,
      }));
      return NextResponse.json({
        members: [...updated.members].sort((a, b) => a.order - b.order),
      });
    }

    const item = body as Partial<Member>;
    if (!item.id) {
      return NextResponse.json({ error: "ไม่พบรหัสกรรมการ" }, { status: 400 });
    }

    const updated = await updateDb((current) => ({
      ...current,
      members: current.members.map((mem) =>
        mem.id === item.id
          ? {
              ...mem,
              ...item,
              name: item.name !== undefined ? item.name.trim() : mem.name,
              nickname:
                item.nickname !== undefined ? item.nickname.trim() : mem.nickname,
              role: item.role !== undefined ? item.role.trim() : mem.role,
              department:
                item.department !== undefined ? item.department.trim() : mem.department,
              yearAndMajor:
                item.yearAndMajor !== undefined
                  ? item.yearAndMajor.trim()
                  : mem.yearAndMajor,
              bio: item.bio !== undefined ? item.bio.trim() : mem.bio,
              quote: item.quote !== undefined ? item.quote.trim() : mem.quote,
              imageUrl:
                item.imageUrl !== undefined && item.imageUrl.trim()
                  ? item.imageUrl.trim()
                  : mem.imageUrl,
              contacts: item.contacts
                ? { ...mem.contacts, ...item.contacts }
                : mem.contacts,
            }
          : mem
      ),
    }));

    return NextResponse.json({
      members: [...updated.members].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "อัปเดตข้อมูลกรรมการไม่สำเร็จ" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ไม่พบรหัสกรรมการที่ต้องการลบ" }, { status: 400 });
    }

    const updated = await updateDb((current) => ({
      ...current,
      members: current.members.filter((mem) => mem.id !== id),
    }));

    return NextResponse.json({
      members: [...updated.members].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "ลบข้อมูลกรรมการไม่สำเร็จ" }, { status: 400 });
  }
}
