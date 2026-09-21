import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_TYPES = ["PAGE_VIEW", "WHATSAPP_CLICK", "CALL_CLICK", "MAP_CLICK"];

// POST /api/businesses/[slug]/track — lightweight, fire-and-forget
// from the public page (e.g. navigator.sendBeacon or a plain fetch
// with no await on the click handler).
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const business = await db.business.findUnique({ where: { slug: params.slug } });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { type } = await req.json();
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  await db.analyticsEvent.create({ data: { businessId: business.id, type } });

  return NextResponse.json({ ok: true });
}
