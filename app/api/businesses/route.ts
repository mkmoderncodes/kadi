import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/slug";
// import { getCurrentUser } from "@/lib/auth"; // wire up once auth is built

// POST /api/businesses — create a new business for the logged-in owner
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, phone, whatsapp, templateId, ownerId } = body;

  if (!name || !ownerId) {
    return NextResponse.json(
      { error: "name and ownerId are required" },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(name);

  const business = await db.business.create({
    data: {
      name,
      slug,
      description,
      phone,
      whatsapp,
      templateId: templateId ?? "RETAIL",
      ownerId,
      status: "DRAFT",
    },
  });

  return NextResponse.json(business, { status: 201 });
}

// GET /api/businesses?ownerId=... — list an owner's businesses
export async function GET(req: NextRequest) {
  const ownerId = req.nextUrl.searchParams.get("ownerId");
  if (!ownerId) {
    return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
  }

  const businesses = await db.business.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(businesses);
}
