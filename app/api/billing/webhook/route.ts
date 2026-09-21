import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// Paystack signs every webhook with your secret key so you can verify
// it actually came from them (not a forged request). Configure this
// URL — https://kadi.app/api/billing/webhook — in the Paystack
// dashboard.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    const payment = await db.payment.update({
      where: { reference },
      data: { status: "SUCCESS" },
    });

    await db.business.update({
      where: { id: payment.businessId },
      data: { planTier: payment.planTier },
    });
  }

  if (event.event === "charge.failed") {
    await db.payment.update({
      where: { reference: event.data.reference },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ received: true });
}
