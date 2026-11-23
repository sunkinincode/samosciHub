import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPublicHubData, updateDb } from "@/lib/db";
import { Member, ServiceWebsite, SiteConfig } from "@/types/hub";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicHubData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "ไม่สามารถโหลดข้อมูลได้" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      siteConfig?: Partial<SiteConfig>;
      members?: Member[];
      services?: ServiceWebsite[];
    };

    const updated = await updateDb((current) => ({
      ...current,
      siteConfig: body.siteConfig
        ? { ...current.siteConfig, ...body.siteConfig }
        : current.siteConfig,
      members: Array.isArray(body.members) ? body.members : current.members,
      services: Array.isArray(body.services) ? body.services : current.services,
    }));

    return NextResponse.json({
      siteConfig: updated.siteConfig,
      members: updated.members,
      services: updated.services,
      updatedAt: updated.updatedAt,
    });
  } catch {
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ" }, { status: 400 });
  }
}
