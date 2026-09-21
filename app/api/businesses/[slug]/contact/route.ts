import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/businesses/[slug]/contact — anyone visiting the public
// page can submit this, no auth required.
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const business = await db.business.findUnique({ where: { slug: params.slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, phone, email, message } = await req.json();
  if (!name || !message) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  await db.contactSubmission.create({
    data: { businessId: business.id, name, phone, email, message },
  });

  await db.analyticsEvent.create({
    data: { businessId: business.id, type: "CONTACT_SUBMIT" },
  });

  return NextResponse.json({ ok: true });
}
