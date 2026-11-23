import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateDb } from "@/lib/db";
import { ServiceStatus, ServiceWebsite } from "@/types/hub";

export const dynamic = "force-dynamic";

const ALLOWED_STATUS: ServiceStatus[] = ["active", "coming_soon", "maintenance"];

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ServiceWebsite>;
    if (!body.title?.trim() || !body.url?.trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อเว็บไซต์และลิงก์ URL" },
        { status: 400 }
      );
    }

    const status: ServiceStatus =
      body.status && ALLOWED_STATUS.includes(body.status) ? body.status : "active";

    let createdService: ServiceWebsite | null = null;
    const updated = await updateDb((current) => {
      const nextOrder =
        current.services.length > 0
          ? Math.max(...current.services.map((s) => s.order)) + 1
          : 1;

      createdService = {
        id: `srv-${Date.now()}`,
        title: body.title!.trim(),
        description: body.description?.trim() || "",
        url: body.url!.trim(),
        imageUrl: body.imageUrl?.trim() || "/assets/services/service-1.svg",
        category: body.category?.trim() || "บริการทั่วไป",
        status,
        featured: Boolean(body.featured),
        order: typeof body.order === "number" ? body.order : nextOrder,
      };

      return {
        ...current,
        services: [...current.services, createdService],
      };
    });

    return NextResponse.json({
      service: createdService,
      services: [...updated.services].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "เพิ่มเว็บไซต์บริการไม่สำเร็จ" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as
      | { services: ServiceWebsite[] }
      | Partial<ServiceWebsite>;

    if ("services" in body && Array.isArray(body.services)) {
      const updated = await updateDb((current) => ({
        ...current,
        services: body.services!,
      }));
      return NextResponse.json({
        services: [...updated.services].sort((a, b) => a.order - b.order),
      });
    }

    const item = body as Partial<ServiceWebsite>;
    if (!item.id) {
      return NextResponse.json({ error: "ไม่พบรหัสบริการ" }, { status: 400 });
    }

    const updated = await updateDb((current) => ({
      ...current,
      services: current.services.map((srv) =>
        srv.id === item.id
          ? {
              ...srv,
              ...item,
              title: item.title !== undefined ? item.title.trim() : srv.title,
              description:
                item.description !== undefined ? item.description.trim() : srv.description,
              url: item.url !== undefined ? item.url.trim() : srv.url,
              imageUrl:
                item.imageUrl !== undefined && item.imageUrl.trim()
                  ? item.imageUrl.trim()
                  : srv.imageUrl,
              category:
                item.category !== undefined ? item.category.trim() : srv.category,
            }
          : srv
      ),
    }));

    return NextResponse.json({
      services: [...updated.services].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "อัปเดตเว็บไซต์บริการไม่สำเร็จ" }, { status: 400 });
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
      return NextResponse.json({ error: "ไม่พบรหัสบริการที่ต้องการลบ" }, { status: 400 });
    }

    const updated = await updateDb((current) => ({
      ...current,
      services: current.services.filter((srv) => srv.id !== id),
    }));

    return NextResponse.json({
      services: [...updated.services].sort((a, b) => a.order - b.order),
    });
  } catch {
    return NextResponse.json({ error: "ลบเว็บไซต์บริการไม่สำเร็จ" }, { status: 400 });
  }
}
