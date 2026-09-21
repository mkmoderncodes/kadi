import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/businesses/[slug] — everything the public template needs to render
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const business = await db.business.findUnique({
    where: { slug: params.slug },
    include: {
      products: { orderBy: { sortOrder: "asc" } },
      photos: { orderBy: { sortOrder: "asc" } },
      hours: true,
      socialLinks: true,
    },
  });

  if (!business || business.status !== "ACTIVE") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(business);
}
